---
publishDate: 2024-10-07T00:00:00Z
title: "Identity Aware Proxies: Die bessere Alternative zum VPN?"
excerpt: "Traditionelle Virtual Private Networks (VPNs) waren lange Zeit die bevorzugte Lösung, um Remote-Zugriff auf Unternehmensressourcen zu gewähren. Doch die zunehmende Komplexität von Netzwerken und die steigenden Cyberrisiken haben die Schwächen von VPNs offengelegt. Hier kommen Identity-Aware Proxies (IAP) ins Spiel – eine fortschrittlichere, sicherere und skalierbarere Alternative.

In diesem Blogbeitrag werfen wir einen Blick darauf, was Identity-Aware Proxies sind, wie sie sich von VPNs unterscheiden und warum sie die Zukunft des sicheren Zugriffs für moderne Unternehmen sind."
image: /identity-aware-proxy-dall-e.jpg
draft: true
tags:
    - cloud
    - architecture
    - zero-trust
    - deutsch
---

### Was ist ein Identity-Aware Proxy?

Ein **Identity-Aware Proxy (IAP)** ist eine Sicherheitslösung, die den Zugriff auf Ressourcen basierend auf der Identität des Nutzers, seiner Rolle und dem Kontext der Anfrage steuert, wie z.B. Standort oder Gerätesicherheit. Anstatt den Zugriff basierend auf dem Netzwerkstandort zu gewähren (wie es bei VPNs der Fall ist), konzentriert sich IAP darauf, **wer** der Benutzer ist und welche Rechte er hat. IAP nutzt zentrale Authentifizierung und Zugriffsrichtlinien, um sicherzustellen, dass nur verifizierte und vertrauenswürdige Nutzer auf bestimmte Ressourcen zugreifen können – auch wenn sie remote arbeiten.

Einfach ausgedrückt basiert IAP auf dem Prinzip der **Zero Trust Security** – „Vertraue niemandem, überprüfe immer“.

### Wie funktioniert IAP?

1. **Authentifizierung**: Bevor einem Nutzer Zugriff auf eine Ressource gewährt wird, überprüft IAP seine Identität mithilfe von Multi-Faktor-Authentifizierung (MFA) und Single Sign-On (SSO). Dies stellt sicher, dass der Zugriff durch die richtige Person erfolgt.
2. **Autorisierung**: IAP prüft die Berechtigungen und Rollen des Nutzers. Basierend auf vordefinierten Zugriffsrichtlinien wird entschieden, ob der Nutzer auf bestimmte Anwendungen oder Ressourcen zugreifen darf.
3. **Kontextuelle Überprüfung**: IAP geht über die einfache Identitätsprüfung hinaus und berücksichtigt auch den Kontext der Anfrage, z.B. das verwendete Gerät oder den Standort. Wenn z.B. eine Anfrage von einem verdächtigen Standort ausgeht, könnte IAP zusätzliche Sicherheitsmaßnahmen erfordern oder den Zugriff verweigern.
4. **Granulare Kontrolle**: Anders als ein VPN, das in der Regel den Zugriff auf das gesamte Netzwerk gewährt, ermöglicht IAP den Zugriff nur auf bestimmte Anwendungen oder Ressourcen. So können Unternehmen festlegen, auf welche Teile der Infrastruktur ein Nutzer zugreifen darf – was das Risiko von unbefugten Aktivitäten reduziert.

### Die Probleme mit VPNs

VPNs waren jahrzehntelang die Basis für sicheren Fernzugriff, aber in der heutigen Zeit haben sie deutliche Schwächen:

1. **Breiter Netzwerkzugriff**: VPNs gewähren in der Regel nach dem Verbindungsaufbau umfassenden Netzwerkzugriff. Dies erhöht die Angriffsfläche und das Risiko von Sicherheitsvorfällen, besonders wenn Anmeldedaten gestohlen werden oder das Gerät mit Malware infiziert ist.

2. **Skalierbarkeitsprobleme**: VPNs sind schwer skalierbar, besonders wenn viele Mitarbeiter, Auftragnehmer oder Partner von verschiedenen Standorten und Geräten aus zugreifen müssen. Die Verwaltung dieser Verbindungen kann komplex und anfällig für Engpässe sein.

3. **Sicherheitslücken**: VPNs bieten nur begrenzte Einblicke in das Verhalten der Nutzer, nachdem sie mit dem Netzwerk verbunden sind. Wenn die Anmeldedaten eines Nutzers gestohlen werden, kann ein Angreifer sich frei im Netzwerk bewegen, ohne dass dies sofort bemerkt wird.

4. **Nutzererfahrung**: VPNs können die Internetgeschwindigkeit verlangsamen, da der gesamte Datenverkehr verschlüsselt und über zentrale Server geleitet wird. Für Remote-Mitarbeiter, die auf konstante Zugriffe angewiesen sind, kann dies frustrierend sein.

### IAP vs. VPN: Die wichtigsten Unterschiede

| **Merkmal**           | **VPN**                                         | **Identity-Aware Proxy (IAP)**                   |
| --------------------- | ----------------------------------------------- | ------------------------------------------------ |
| **Zugriffskontrolle** | Basierend auf dem Netzwerkstandort              | Basierend auf der Identität und dem Kontext      |
| **Netzwerkzugriff**   | Umfassender Netzwerkzugriff                     | Granularer, anwendungsbezogener Zugriff          |
| **Skalierbarkeit**    | Schwer skalierbar                               | Einfach skalierbar mit Cloud und mobilen Geräten |
| **Nutzererfahrung**   | Langsamer aufgrund von Datenverkehrsumleitungen | Schneller, nahtloser Anwendungszugriff           |
| **Sicherheitsansatz** | Perimeter-basierte Sicherheit                   | Zero Trust, identitätszentriert                  |
| **Sichtbarkeit**      | Eingeschränkte Einsicht in Benutzeraktivitäten  | Detaillierte Protokolle und Überwachung          |

### Vorteile von Identity-Aware Proxies

1. **Verbesserte Sicherheit**: IAPs setzen auf das Zero-Trust-Modell. Nur verifizierte Identitäten können auf spezifische Anwendungen zugreifen. Die Überprüfung der Identitäten erfolgt hierbei kontinuierlich!
2. **Granulare Zugriffskontrolle**: Anders als VPNs bieten IAPs präzise Kontrolle darüber, auf welche Ressourcen jeder Nutzer zugreifen kann. Dies Reduziert die Angriffsvektoren, selbst bei gestohlenen oder verlorenen Zugangsdaten.
3. **Nahtlose Integration**: IAPs lassen sich einfach mit modernen Identitätsmanagement-Lösungen wie OAuth, SAML und Google Identity integrieren, um eine benutzerfreundliche und sichere Erfahrung zu bieten.
4. **Bessere Nutzererfahrung**: IAPs erfordern nicht, dass der gesamte Netzwerkverkehr durch zentrale Server geleitet wird, was den Zugriff auf Anwendungen schneller und zuverlässiger macht – besonders für global verteilte Remote-Teams.

5. **Sichtbarkeit und Compliance**: IAPs bieten detaillierte Protokolle über Nutzeraktivitäten, die für Audits, Compliance und Bedrohungserkennung wertvoll sind. Administratoren können genau nachvollziehen, wer wann auf welche Ressourcen zugegriffen hat. Manche Lösungen verstehen die Protokolle der geschützten Ressourcen, z.B. von Datenbanken, was noch bessere Audit Logs gewährleistet.

6. **Kosteneffizienz**: Da IAPs keine aufwendige VPN-Infrastruktur und weniger datenintensive Verkehrsweiterleitung benötigen, können sie für wachsende Unternehmen, insbesondere solche, die auf die Cloud umsteigen, kostengünstiger sein.

### Wann sollte man IAP anstelle von VPN wählen?

VPNs haben möglicherweise noch ihre Berechtigung in bestimmten Umgebungen oder für spezielle Anwendungsfälle, aber Identity-Aware Proxies sind die bessere Wahl für Unternehmen, die auf Cloud-Technologien und hybride Arbeitsmodelle setzen. Wenn Ihr Unternehmen auf sicheren, skalierbaren und einfach zu verwaltenden Fernzugriff setzt, ist eine IAP-Lösung die richtige Entscheidung.

Verwenden Sie IAP, wenn:

-   Ihre Mitarbeiter über verschiedene Standorte verteilt arbeiten.
-   Sie sicheren, granularen Zugriff auf spezifische Anwendungen benötigen.
-   Sie ein Zero-Trust-Sicherheitsmodell einführen möchten.
-   Sie die Angriffsfläche Ihres Netzwerks reduzieren und nicht mehr ausschließlich auf perimeterbasierte Sicherheit setzen wollen.

### Welche Optionen gibt es?

Es gibt viele verschiedene Optionen IAPs zu Implementieren. Hier wollen wir eine Auswahl an möglichen Lösungen vorstellen:

#### Für Azure Nutzer: [Entra Application Proxy](https://learn.microsoft.com/en-us/entra/identity/app-proxy/overview-what-is-app-proxy)

Wer sich voll auf das Microsoft Ökosystem einlässt hat mit dem Entra Application Proxy eine gute Lösung. Mit dem Entra Applicaton Proxy können Kunden Ihre On-Prem Anwendungen zugänglich machen, ohne hierfür eine DMZ zu benötigen. Außerdem profitieren Sie von SSO und granularen Sicherheitsrichtlinien.

#### Die Beste Lösung für einfachen und sicheren Zugang zur IT-Infrastruktur: [Teleport](https://goteleport.com/)

Wenn Zero-Trust nicht nur auf Webanwendungen angewendet werden soll. Teleport überzeugt durch die Vielzahl an Anwendungsprotokollen, die nativ unterstützt werden, aber auch mit einer einfachen Benutzerführung und den umfangreichen Möglichkeiten Zugriffe zu auditieren. Außerdem hat Teleport eine Privileged Access Management Lösung direkt integiert. Das Ganze gibt es sowohl als Cloud, als auch als Selbstgehostet Variante.

#### Die Open Source Lösung: [Ory OAuthkeeper](https://github.com/ory/oathkeeper)

Wer nach einer OSS Lösung sucht, die volle Flexibilität bietet, kann sich das Project Ory OAuthkeeper ansehen. OAuthkeeper stellt sicher, dass alle Webaufrufe authentifiziert sind. Optional kann er auch die Authorisierung sicherstellen. Damit hat man eine leichtgewichtige Lösung, um schnelle SSO in Applikationen zu nutzen, die es nativ nicht unterstützen.

### Fazit

Während Unternehmen weiter modernisieren und auf Cloud-Technologien setzen, werden die Grenzen von VPNs immer deutlicher. **Identity-Aware Proxies** bieten eine sicherere, skalierbarere und effizientere Methode für den Fernzugriff, insbesondere für Unternehmen, die sich nach dem **Zero-Trust-Prinzip** ausrichten. Mit ihrem identitätszentrierten Ansatz bieten IAPs granularen Zugriff, bessere Sichtbarkeit und eine nahtlose Nutzererfahrung – und sind damit eine robuste Alternative zu traditionellen VPNs.

Für Unternehmen, die ihre Sicherheitsarchitektur verbessern und gleichzeitig schnellen und zuverlässigen Zugriff auf Ressourcen ermöglichen wollen, sind Identity-Aware Proxies die Zukunft.
