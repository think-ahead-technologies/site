---
publishDate: 2025-06-03T00:00:00Z
title: "GitOps für regulierte und KRITIS-Umgebungen: Gitless Deployment mit OCI und Flux"
excerpt: "Organisationen in regulierten Branchen wie Finanzwesen, Gesundheitswesen, Energie oder staatlicher Verwaltung stehen unter enormem Druck, ihre IT-Systeme sicher, auditierbar und konform zu gestalten. Klassisches GitOps - bei dem Kubernetes-Manifeste direkt aus einem Git-Repository deployed werden - stößt in diesen Kontexten schnell an seine Grenzen: Git-Zugriffe vom Cluster sind oft untersagt, das Handling von Secrets unterliegt strengen Auflagen, und jede Änderung muss vollständig nachvollziehbar sein."
image: /secure-gitops.png
draft: false
tags:
    - kubernetes
    - architecture
    - zero-trust
    - gitops
    - kritis
    - deutsch
---

Die [Flux D2 Reference Architecture](https://raw.githubusercontent.com/controlplaneio-fluxcd/distribution/main/guides/ControlPlane_Flux_D2_Reference_Architecture_Guide.pdf) bietet hier einen modernen, sicherheitsorientierten Ansatz: Statt Git ist eine OCI Registry (z.B. JFrog Artifactory oder Harbor) die alleinige Quelle der Wahrheit. Deployments erfolgen über signierte, unveränderliche OCI Artifacts, die direkt im Cluster verifiziert und installiert werden - ganz ohne Git-Zugriff im Cluster. Diese „Gitless GitOps“-Architektur entkoppelt Quellcode-Verwaltung und Deployment vollständig, reduziert Risiken und erfüllt höchste Compliance-Anforderungen.

## Architekturüberblick

Die D2-Architektur besteht im Kern aus einem zentralen Container-Registry und drei voneinander getrennten Git-Repositories für Code und Konfiguration:<br><br>
• **OCI Registry (Single Source of Truth)**: Hier liegen alle Kubernetes-Konfigurationen als signierte, versionierte Container Images. Die Registry stellt sicher, dass nur verifizierte Inhalte deployed werden und ermöglicht feingranulare Zugriffskontrolle über RBAC.<br>
• **fleet Repository**: Beschreibt die gesamte Fleet- und Mandantenstruktur mit Hilfe des [Flux Operators](https://fluxcd.control-plane.io/operator/). Enthält z.B. Definitionen zur Flux-Installation mittels der [FluxInstance](https://fluxcd.control-plane.io/operator/fluxinstance/) CRD und zu Umgebungen per [ResourceSet](https://fluxcd.control-plane.io/operator/resourceset/) CRD.<br>
• **infra Repository**: Konfiguriert Plattformbestandteile wie Monitoring, Logging, Ingress, Policies oder den Cert-Manager - ebenfalls als OCI Artifacts.<br>
• **apps Repository**: Beinhaltet Applikations-spezifische Kubernetes-Konfigurationen, CI/CD-Flows und Rollouts pro Umgebung.<br>

Das Besondere: Die Repositories dienen nur noch als Quellcode-Historie - nicht mehr als Deployment-Ziel. Das Deployment erfolgt ausschließlich über Container-Images, die in der Registry landen. Git ist damit nicht mehr das Bindeglied zwischen CI und CD.

## Der Gitless Deployment-Flow

Die D2-Architektur organisiert den GitOps-Workflow in drei klar getrennte Phasen:

### 1. CI: Build & Sign

Ein Merge ins Haupt-Branch (z. B. main) triggert eine CI-Pipeline (z. B. GitHub Actions), die folgende Schritte ausführt:<br><br>
• Kubernetes-Manifeste werden mit Helm oder Kustomize gerendert.<br>
• Diese Manifeste werden mit der [Flux CLI](https://fluxcd.io/flux/cmd/flux_push_artifact/) in ein OCI-konformes Container Image gepackt.<br>
• Das Image wird mit [cosign](https://docs.sigstore.dev/cosign/signing/overview/) signiert - keyless und mit OIDC über GitHub (kein geheimer Schlüssel notwendig).<br>
• Zusätzlich werden SBOM (Software Bill of Materials) und Metadata wie Build-ID oder Workflow-Name eingebettet.<br>
• Das fertige Image wird in die Registry gepusht, z. B. als my-app:latest.<br>

Wichtig: Auf Github oder Gitlab ben;tigt diese CI-Pipeline keine Secrets, weder zum Signieren noch zum Pushen, da auf den OIDC Token im Pipeline Job ([GitHub](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication), [Gitlab](https://docs.gitlab.com/ci/jobs/ci_job_token/)) zurückgegriffen werden kann.

### 2. CD: Deployment per Flux

Flux ist in jeder Zielumgebung installiert und abonniert ein spezifisches OCI Artifact via OCIRepository. Sobald ein neues Image verfügbar ist, führt Flux folgende Schritte aus:<br><br>
• Image aus der Registry herunterladen.<br>
• Signatur [verifizieren](https://fluxcd.io/flux/components/source/ocirepositories/#cosign) (nur CI-signierte Images werden akzeptiert).<br>
• Manifeste aus dem Image extrahieren und anwenden.<br>

Der Clou: Die gesamte Kontrolle liegt in der Registry. Das Cluster kennt Git nicht mehr - es vertraut allein auf signierte, verifizierte Artifacts.

### 3. Promotion Pipeline

Ein zentrales Konzept in D2 ist die tag-basierte Promotion:<br><br>
• CI pusht initial nach my-app:latest → wird in Staging-Umgebung deployed.<br>
• Nach Tests erfolgt ein „Promotion Push“: z.B. als my-app:stable oder mit einem SemVer-Tag wie v1.2.3.<br>
• Die Produktionsumgebung folgt nur diesem „stable“-Tag.<br>

Dieses Modell ersetzt den klassischen „Git-Branch je Umgebung“-Ansatz durch ein sicheres, nachvollziehbares Tagging - Promotion wird ein expliziter, auditiabler Akt.

## Warum diese Architektur für KRITIS und regulierte Branchen ideal ist

#### Immutable Infrastruktur durch OCI Artifacts

Jede Konfiguration ist als unveränderliches, versioniertes Image gespeichert. Damit lässt sich jederzeit nachvollziehen, welche Manifeste deployed wurden. Kein „kubectl apply“ im Blindflug, kein Drift.

#### Signierte Deployments - by default

Flux deployt nur gültig signierte Images. Die Signatur erfolgt automatisch im CI-Prozess - keyless, ohne private Schlüssel. Das schützt gegen Supply-Chain-Angriffe und unerlaubte Änderungen.

#### Full Traceability & Audit Logs

Jeder Schritt - von Commit über Build bis zum Deployment - ist nachverfolgbar:<br><br>
• Git Commit → GitHub Actions Run → OCI Image mit SBOM & Provenance<br>
• Registry Logs zeigen, wer wann welches Image gepusht hat.<br>
• Flux protokolliert, wann welches Image wo deployed wurde.<br>

#### Staged Rollouts mit Promotion Control

Rollouts folgen einem definierten Prozess: Nur freigegebene Images (z.B. mit Stable-Tag) gelangen in Produktion. Tests und Approvals sind Voraussetzung für Promotion - nichts geschieht „versehentlich“.

#### Granulare Zugriffskontrolle per Registry-RBAC

Die Registry wird zur Kontrollinstanz: Nur CI-Workflows dürfen auf produktive Tags pushen. Entwickler haben ggf. nur Zugriff auf Staging-Tags. Damit wird Separation of Duties auf Infrastrukturebene durchgesetzt.

#### Keine Secrets in CI/CD

Dank OIDC und keyless Signing kommen sowohl CI als auch Cluster ohne klassische Secrets aus. Kein Risiko durch geleakte Keys oder Tokens.

#### Git ist nicht mehr der Single Point of Failure

Fällt Git aus oder wird kompromittiert, bleibt der Deployment-Prozess funktionsfähig - denn Flux vertraut der Registry, nicht dem Git-Repo. Das reduziert drastisch die Angriffsmöglichkeiten.

## Fazit

Das D2-Architekturmodell von Flux und ControlPlane ist eine wegweisende Lösung für GitOps in sicherheitskritischen und stark regulierten Umgebungen. Durch die Entkopplung von Git und Deployment, den Einsatz von OCI Artifacts und durchgehender Signaturprüfung bietet es:<br><br>
• maximale Nachvollziehbarkeit,<br>
• eine klare, sichere Promotion-Strategie,<br>
• und kompromisslose Kontrolle über jede Änderung.<br>

Organisationen in KRITIS-Sektoren, regulierten Industrien oder jeder Umgebung mit hohem Sicherheitsanspruch können damit moderne CI/CD-Prozesse etablieren - ohne Kompromisse bei Sicherheit oder Compliance.

Referenz:
Basierend auf der D2 Reference Architecture von ControlPlane, FluxCD-Dokumentation und den Best Practices rund um OCI, cosign und GitHub OIDC.
