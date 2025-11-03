---
publishDate: 2025-11-07T00:00:00Z
title: "Securing Your Container Supply Chain: A Practical Guide to Sigstore, Cosign, and Policy Enforcement"
excerpt: A guide to implementing container supply chain security using Sigstore's keyless signing, SBOM generation, and Kubernetes policy enforcement, transforming container deployments from trust-based operations into cryptographically verifiable, auditable processes.
image: "/container-signing.png"
draft: false
tags:
    - cloud
    - container
    - cosign
    - signing
    - sbom
    - compliance
    - english
    - cyber-resilience-act
---

Container supply chain attacks represent a critical threat vector in modern software development. When an attacker compromises a container image, whether through malicious injection during the build process, registry tampering, or dependency poisoning, the consequences can cascade throughout an entire infrastructure. Organizations deploying containers without verification mechanisms operate under the assumption that images are authentic and unmodified, an assumption that recent supply chain incidents have proven dangerously optimistic.

Cryptographic signing of container images addresses the authenticity and integrity dimensions of this problem. A signed image provides verifiable proof of its origin and guarantees that its contents have not been altered since signing. Software Bill of Materials (SBOMs) complement this by providing transparency into an image's dependency tree, enabling rapid vulnerability identification and compliance verification. Together, these mechanisms transform container deployment from a trust-based operation into a verifiable, auditable process.

This guide provides a complete, hands-on implementation of container supply chain security using Sigstore's ecosystem. By the end, you will have a working GitHub Actions workflow that builds, signs, and attests container images with SBOMs, alongside a Kubernetes policy enforcement system that validates these signatures before allowing deployments.

All example code, Kubernetes manifests, and policy configurations referenced in this guide are available in the companion repository at **https://github.com/think-ahead-technologies/blog-container-signing**.

## Prerequisites

Before beginning this implementation, ensure you have:

- **Active [GitHub](https://github.com/) account**
- **Access to a Kubernetes cluster** where you can install admission controllers and deploy workloads (local clusters like [kind](https://github.com/kubernetes-sigs/kind) or [minikube](https://github.com/kubernetes/minikube) work for testing)
- **A container image to sign** - This guide uses nginx as the example application, but you can substitute any containerized application with a valid Dockerfile

## Understanding the Components

**Sigstore** is an open-source project that provides a comprehensive framework for signing, verifying, and protecting software artifacts. Rather than requiring developers to manage long-lived cryptographic keys, a process fraught with security and operational challenges, Sigstore leverages short-lived certificates bound to OpenID Connect (OIDC) identities. This approach eliminates key storage concerns while maintaining strong cryptographic guarantees about artifact provenance.

**Cosign** serves as the primary tool for signing and verifying container images within the Sigstore ecosystem. Version 3.0.2 implements keyless signing through integration with Fulcio, Sigstore's certificate authority, which issues short-lived certificates that bind ephemeral keys to OIDC identities from providers like GitHub, Google, or Microsoft. When you sign an image with Cosign, the signature and associated metadata are stored in the container registry alongside the image, while an immutable record is written to Rekor, Sigstore's transparency log. This dual-storage approach ensures that signatures remain verifiable even after the signing certificate expires.

**Syft**, developed by Anchore, generates Software Bill of Materials (SBOMs) by analyzing container images and filesystems to catalog all software components and dependencies. Version 1.36.0 supports multiple SBOM formats including SPDX and CycloneDX, the two industry-standard formats for representing software composition data. SPDX, originally developed by the Linux Foundation, excels in license compliance scenarios and is widely adopted in enterprise environments. CycloneDX, maintained by OWASP, is designed specifically for security use cases and provides rich vulnerability tracking capabilities.

**Policy Controller** is a Kubernetes admission controller that enforces image signature verification policies at deployment time. Operating as a validating webhook, Policy Controller intercepts pod creation requests and evaluates them against ClusterImagePolicy resources. Version 0.13.0 introduced support for the Sigstore bundle format, which standardizes how signatures and attestations are serialized and stored. When a deployment attempts to run a container image, Policy Controller verifies the image signature against the Rekor transparency log and checks any attached attestations, such as SBOMs, before allowing the pod to start. This enforcement layer ensures that only verified, compliant images execute in your cluster.

## GitHub Actions Workflow - Step by Step

This section breaks down each component of the signing and attestation workflow. The complete, integrated workflow appears in the next section.

### 3.1 Setting Up the Workflow File

The workflow file (`.github/workflows/build-sign-sbom.yaml`) begins with trigger configuration and critical permission settings:

```yaml
name: Build, Sign, and Attest Container Image

on:
    push:
        branches: [main]
    pull_request:
        branches: [main]

permissions:
    contents: read # Read repository contents
    packages: write # Push to GitHub Container Registry
    id-token: write # Required for OIDC authentication with Sigstore
```

The `id-token: write` permission is essential for keyless signing. This permission allows the workflow to obtain an OIDC token from GitHub's identity provider, which Fulcio uses to issue a short-lived signing certificate. Without this permission, keyless signing will fail. The token includes claims about the workflow's identity (repository, commit SHA, workflow name), which become part of the signed metadata.

### 3.2 Building the Container Image

The build step uses Docker Buildx for multi-platform support and tags the image for GitHub Container Registry:

```yaml
- name: Build container image
  run: |
      docker build -t ghcr.io/${{ github.repository }}:${{ github.sha }} .
      docker tag ghcr.io/${{ github.repository }}:${{ github.sha }} \
                 ghcr.io/${{ github.repository }}:latest
```

Using the commit SHA as the primary tag creates an immutable reference to the image, while the `latest` tag provides convenience for development workflows.

### 3.3 Pushing to GitHub Container Registry

After building, push both tags to the registry:

```yaml
- name: Log in to GitHub Container Registry
  uses: docker/login-action@v3
  with:
      registry: ghcr.io
      username: ${{ github.actor }}
      password: ${{ secrets.GITHUB_TOKEN }}

- name: Push container image
  run: |
      docker push ghcr.io/${{ github.repository }}:${{ github.sha }}
      docker push ghcr.io/${{ github.repository }}:latest
```

The image must exist in the registry before signing, as Cosign references it by digest rather than tag. This ensures that the signature remains valid regardless of tag mutations.

### 3.4 Installing Cosign and Syft

Pin specific tool versions to ensure reproducible builds and avoid unexpected behavior from version changes:

```yaml
- name: Install Cosign
  uses: sigstore/cosign-installer@v4.0.0
  with:
      cosign-release: "v2.6.1"

- name: Install Syft
  run: |
      curl -sSfL https://get.anchore.io/syft | sh -s -- -b /usr/local/bin v1.36.0
```

Version pinning prevents breaking changes from disrupting your pipeline. Update versions deliberately after testing in a non-production environment.

### 3.5 Generating SBOMs

Generate both SPDX and CycloneDX format SBOMs to maximize compatibility:

```yaml
# Generate SPDX format SBOM (Linux Foundation standard, license compliance focus)
- name: Generate SPDX SBOM
  env:
      DIGEST: ${{ steps.image-digest.outputs.digest }}
  run: |
      syft scan ghcr.io/${{ github.repository }}@${DIGEST} \
        -o spdx-json=sbom-spdx.json
      echo "SPDX SBOM generated successfully"

# Generate CycloneDX format SBOM (OWASP standard, security focus)
- name: Generate CycloneDX SBOM
  env:
      DIGEST: ${{ steps.image-digest.outputs.digest }}
  run: |
      syft scan ghcr.io/${{ github.repository }}@${DIGEST} \
        -o cyclonedx-json=sbom-cyclonedx.json
      echo "CycloneDX SBOM generated successfully"
```

### 3.6 Retrieving the Image Digest

Before signing, retrieve the immutable digest of the pushed image. Digests are cryptographic hashes that uniquely identify image content, unlike tags which can be reassigned:

```yaml
- name: Get image digest
  id: image-digest
  run: |
      DIGEST=$(docker inspect --format='{{index .RepoDigests 0}}' \
               ghcr.io/${{ github.repository }}:${{ github.sha }} | cut -d'@' -f2)
      echo "digest=${DIGEST}" >> $GITHUB_OUTPUT
      echo "Image digest: ${DIGEST}"
```

The digest is stored as a workflow output (`steps.image-digest.outputs.digest`) for use in subsequent signing and attestation steps. Signing by digest rather than tag ensures that the signature remains cryptographically bound to specific image content, regardless of tag mutations.

### 3.7 Signing the Container Image

Sign the image using keyless authentication via GitHub's OIDC provider:

```yaml
- name: Sign container image
  env:
      DIGEST: ${{ steps.image-digest.outputs.digest }}
  run: |
      cosign sign --yes \
        ghcr.io/${{ github.repository }}@${DIGEST}
```

The `--yes` flag bypasses the interactive confirmation prompt, necessary for CI/CD environments. Cosign automatically detects the GitHub OIDC token via the workflow's `id-token: write` permission and uses it to authenticate with Fulcio. Fulcio issues a short-lived certificate (valid for approximately 10 minutes) that binds the ephemeral signing key to the workflow's identity. The signature is stored in the registry as a separate artifact linked to the image digest, and an immutable record is written to Rekor's transparency log.

When Cosign signs an image, three critical pieces of metadata are recorded:

1. **The signature itself** - Cryptographic proof that the entity controlling the OIDC identity approved this image
2. **The certificate** - Contains the OIDC identity claims (repository, workflow, commit SHA, actor)
3. **The Rekor entry** - Immutable, timestamped proof that the signing occurred

This metadata enables verification of not just _that_ an image was signed, but _by whom_ and _when_.

### 3.8 Signing and Attaching SBOM Attestations

Attach both SBOMs as signed attestations to the container image:

```yaml
- name: Attest SPDX SBOM
  env:
      DIGEST: ${{ steps.image-digest.outputs.digest }}
  run: |
      cosign attest --yes \
        --type spdxjson \
        --predicate sbom-spdx.json \
        ghcr.io/${{ github.repository }}@${DIGEST}

- name: Attest CycloneDX SBOM
  env:
      DIGEST: ${{ steps.image-digest.outputs.digest }}
  run: |
      cosign attest --yes \
        --type cyclonedx \
        --predicate sbom-cyclonedx.json \
        ghcr.io/${{ github.repository }}@${DIGEST}
```

Attestations differ from simple signature verification. While signing proves _who_ created an artifact, attestations prove _properties about_ that artifact. An SBOM attestation cryptographically binds the SBOM to the image, proving that this specific SBOM accurately represents the contents of this specific image. This binding prevents attackers from substituting a benign SBOM for a compromised image or vice versa.

Attestations use the in-toto format, an industry standard for supply chain metadata. The `--predicate` flag specifies the attestation content (the SBOM), while `--type` indicates the attestation type for policy evaluation. Policy Controller can later require specific attestation types, ensuring that images not only have SBOMs but have SBOMs in expected formats.

## Complete GitHub Actions Workflow Example

The complete example can be found in the [Companion Repository](https://github.com/think-ahead-technologies/blog-container-signing/blob/main/.github/workflows/build-sign-sbom.yaml).

This workflow produces a fully signed and attested container image with:

1. **Cryptographic signature** proving the image was built by this repository's workflow
2. **SPDX SBOM attestation** for license compliance and general supply chain documentation
3. **CycloneDX SBOM attestation** for vulnerability management and security analysis
4. **Rekor transparency log entries** providing immutable audit trails for all signatures and attestations

All artifacts are stored in GitHub Container Registry and linked to the image by digest, ensuring the artifacts remain associated with the image regardless of tag changes.

## Deploying to Kubernetes

With the signing and attestation pipeline operational, the next phase deploys the signed container image to Kubernetes and implements policy-based enforcement. Before enabling Policy Controller, deploy a basic workload to establish baseline functionality and verify that signed images operate correctly. This section demonstrates deployment using nginx. The patterns shown apply to any containerized workload.

Create a namespace for the application:

```yaml
apiVersion: v1
kind: Namespace
metadata:
    name: signed-apps
    labels:
        policy.sigstore.dev/include: "true"
```

Deploy the signed container image:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
    name: nginx
    namespace: signed-apps
spec:
    replicas: 1
    selector:
        matchLabels:
            app: nginx
    template:
        metadata:
            labels:
                app: nginx
        spec:
            containers:
                - name: nginx
                  image: ghcr.io/think-ahead-technologies/blog-container-signing:c833b6902c4f5f10be28c107b2bcf01d6c108c5f
```

Apply the manifests to your cluster:

```bash
kubectl apply -f nginx-deployment.yaml
```

Verify the deployment status:

```bash
kubectl get pods -n signed-apps
kubectl logs -n signed-apps -l app=nginx
```

At this stage, the deployment succeeds regardless of signature status because no policy enforcement is active. The next section implements Policy Controller to validate signatures before allowing pods to start.

Complete Kubernetes manifests, including policy configurations for progressive enforcement stages, are available in the companion repository at **https://github.com/think-ahead-technologies/blog-container-signing** under the `kubernetes/` directory.

## Installing and Configuring Sigstore Policy Controller

Policy Controller enforcement should be implemented progressively, beginning with observability and advancing to blocking enforcement only after validating policy behavior. This approach minimizes disruption while building confidence in the policy configuration.

### Installing Policy Controller

Install Policy Controller v0.13.0 using Helm:

```bash
# Add the Sigstore Helm repository
helm repo add sigstore https://sigstore.github.io/helm-charts
helm repo update

# Install Policy Controller in the cosign-system namespace
helm upgrade --install \
    -create-namespace policy-controller \
    -n cosign-system \
    sigstore/policy-controller \
    --wait
```

Verify the installation:

```bash
kubectl get pods -n cosign-system
```

### Understanding ClusterImagePolicy Resources

ClusterImagePolicy is a custom resource that defines signature verification requirements. Each policy specifies:

- **Image patterns** - Which images the policy applies to (glob patterns supported)
- **Authorities** - Public keys or certificate identities to trust
- **Attestation requirements** - Required attestation types (e.g., SBOM, SLSA provenance)
- **Mode** - `enforce` (blocking) or `warn` (audit only)

A basic policy structure:

```yaml
apiVersion: policy.sigstore.dev/v1beta1
kind: ClusterImagePolicy
metadata:
    name: example-policy
spec:
    images:
        - glob: "**"
    authorities:
        - keyless:
              url: https://fulcio.sigstore.dev
              identities:
                  - issuer: https://token.actions.githubusercontent.com
                    subject: https://github.com/think-ahead-technologies/blog-container-signing/.github/workflows/*
    mode: enforce
```

### Stage 1 - Warn Mode

Begin with warn mode to observe policy violations without blocking deployments. This stage identifies images that would fail enforcement and allows time to remediate them.

```yaml
apiVersion: policy.sigstore.dev/v1alpha1
kind: ClusterImagePolicy
metadata:
    name: cip
spec:
    images:
        - glob: "**"
    authorities:
        - keyless:
              # Use Sigstore's public Fulcio instance
              url: https://fulcio.sigstore.dev
              identities:
                  # Match any GitHub Actions workflow from your organization
                  - issuer: "https://token.actions.githubusercontent.com"
                    subjectRegExp: "https://github.com/think-ahead-technologies/blog-container-signing/.github/workflows/build-sign-sbom.yaml@refs/heads/main"
    mode: warn
```

Apply the policy to your cluster:

```bash
kubectl apply -f kubernetes/policy-warn.yaml
```

Deploy an unsigned test image to observe warning behavior:

```bash
> kubectl create deploy unsigned-test --image=nginx -n signed-apps

Warning: failed policy: cip: spec.template.spec.containers[0].image
Warning: index.docker.io/library/nginx:latest@sha256:f547e3d0d5d02f7009737b284abc87d808e4252b42dceea361811e9fc606287f attestation keyless validation failed for authority authority-0 for index.docker.io/library/nginx@sha256:f547e3d0d5d02f7009737b284abc87d808e4252b42dceea361811e9fc606287f: no matching attestations:
deployment.apps/nginx created
```

The deployment is created, as expected. But you will see response indicates that the image failed verification but was allowed due to warn mode. Let's clean it up again.

```bash
kubectl delete deploy unsigned-test -n signed-apps
```

### Stage 2 - Signature Verification

After validating that your signed images pass policy checks in warn mode, enable enforcement for signature verification:

```yaml
apiVersion: policy.sigstore.dev/v1alpha1
kind: ClusterImagePolicy
metadata:
    name: cip
spec:
    images:
        - glob: "**"
    authorities:
        - keyless:
              # Use Sigstore's public Fulcio instance
              url: https://fulcio.sigstore.dev
              identities:
                  # Match any GitHub Actions workflow from your organization
                  - issuer: "https://token.actions.githubusercontent.com"
                    subject: "https://github.com/think-ahead-technologies/blog-container-signing/.github/workflows/build-sign-sbom.yaml@refs/heads/main"
    mode: enforce
```

Apply the updated policy to your cluster:

```bash
kubectl apply -f kubernetes/cip-enforce.yaml
```

Test with your signed nginx image:

```bash
# This should succeed (image is signed)
kubectl run signed-nginx \
  --image=ghcr.io/think-ahead-technologies/blog-container-signing:c833b6902c4f5f10be28c107b2bcf01d6c108c5f \
  -n signed-apps
```

Test with an unsigned image:

```bash
# This should be blocked
kubectl run unsigned-test --image=nginx:latest -n signed-apps
```

The unsigned image deployment will fail with an error message indicating signature verification failure:

```
Error from server (BadRequest): admission webhook "policy.sigstore.dev" denied the request:
validation failed: failed policy: github-signed-images-enforce:
spec.containers[0].image: ghcr.io/nginx:latest signature key validation failed
```

This error confirms that Policy Controller is enforcing signature requirements.

### SBOM Attestation Verification

Extend the policy to require SBOM attestations in addition to signatures. This ensures that not only are images signed, but they also include the supply chain transparency documentation required for compliance and security analysis.

```yaml
apiVersion: policy.sigstore.dev/v1alpha1
kind: ClusterImagePolicy
metadata:
    name: cip
spec:
    images:
        - glob: "**"
    authorities:
        - keyless:
              # Use Sigstore's public Fulcio instance
              url: https://fulcio.sigstore.dev
              identities:
                  # Match any GitHub Actions workflow from your organization
                  - issuer: "https://token.actions.githubusercontent.com"
                    subject: "https://github.com/think-ahead-technologies/blog-container-signing/.github/workflows/build-sign-sbom.yaml@refs/heads/main"
          attestations:
              - name: spdx-sbom-required
                predicateType: https://spdx.dev/Document
                policy:
                    type: cue
                    data: |
                        predicateType: "https://spdx.dev/Document"
              - name: cyclonedx-sbom-required
                predicateType: https://cyclonedx.org/bom
                policy:
                    type: cue
                    data: |
                        predicateType: "https://cyclonedx.org/bom"
    mode: enforce
```

Apply the comprehensive policy to your cluster:

```bash
kubectl apply -f policy-complete.yaml
```

Test deployment of an image with signatures and attestations:

```bash
# Should succeed (has signature + SBOMs)
kubectl run fully-attested-nginx \
  --image=ghcr.io/think-ahead-technologies/blog-container-signing:c833b6902c4f5f10be28c107b2bcf01d6c108c5f \
  -n signed-apps
```

## Verification and Testing

Manual verification provides confidence that the signing and attestation pipeline functions correctly before deploying enforcement policies.

### Verifying Image Signatures

Use Cosign to manually verify an image signature:

```bash
# Verify with GitHub OIDC identity
cosign verify \
  --certificate-identity-regexp="^https://github.com/think-ahead-technologies/blog-container-signing" \
  --certificate-oidc-issuer="https://token.actions.githubusercontent.com" \
  ghcr.io/think-ahead-technologies/blog-container-signing:c833b6902c4f5f10be28c107b2bcf01d6c108c5f
```

Expected output for a valid signature:

```
Verification for ghcr.io/think-ahead-technologies/blog-container-signing:c833b6902c4f5f10be28c107b2bcf01d6c108c5f
The following checks were performed on each of these signatures:
  - The cosign claims were validated
  - Existence of the claims in the transparency log was verified offline
  - The code-signing certificate was verified using trusted certificate authority certificates

[{"critical": {"identity": {"docker-reference": "ghcr.io/think-ahead-technologies/blog-container-signing"}...}]
```

The output confirms three critical validations:

1. The signature cryptographically verifies against the image digest
2. The signature exists in Rekor's transparency log
3. The signing certificate chains to a trusted root (Fulcio)

### Inspecting SBOM Attestations

Retrieve and examine SBOM attestations attached to the image:

```bash
# Download SPDX SBOM attestation
cosign verify-attestation \
  --type spdxjson \
  --certificate-identity-regexp="^https://github.com/think-ahead-technologies/blog-container-signing" \
  --certificate-oidc-issuer="https://token.actions.githubusercontent.com" \
  ghcr.io/think-ahead-technologies/blog-container-signing:c833b6902c4f5f10be28c107b2bcf01d6c108c5f | jq -r '.payload' | base64 -d | jq .
```

This command decodes the attestation and displays the SPDX SBOM content. You can inspect package lists, dependency relationships, and license information.

Expected output structure for SPDX SBOM:

```json
{
  "predicateType": "https://spdx.dev/Document",
  "predicate": {
    "spdxVersion": "SPDX-2.3",
    "name": "ghcr.io/think-ahead-technologies/blog-container-signing",
    "packages": [
      {
        "name": "nginx",
        "versionInfo": "1.25.3",
        "supplier": "Organization: nginx",
        "filesAnalyzed": false
      },
      ...
    ]
  }
}
```

```bash
# Download CycloneDX SBOM attestation
cosign verify-attestation \
  --type cyclonedx \
  --certificate-identity-regexp="^https://github.com/think-ahead-technologies/blog-container-signing" \
  --certificate-oidc-issuer="https://token.actions.githubusercontent.com" \
  ghcr.io/think-ahead-technologies/blog-container-signing:c833b6902c4f5f10be28c107b2bcf01d6c108c5f | jq -r '.payload' | base64 -d | jq .
```

Expected output structure for CycloneDX SBOM:

```json
{
  "predicateType": "https://cyclonedx.org/bom",
  "predicate": {
    "bomFormat": "CycloneDX",
    "specVersion": "1.5",
    "components": [
      {
        "type": "library",
        "name": "openssl",
        "version": "3.0.2",
        "purl": "pkg:deb/debian/openssl@3.0.2"
      },
      ...
    ]
  }
}
```

The CycloneDX output shows components with vulnerability identifiers (when available), enabling integration with vulnerability management systems.

### Common Issues and Solutions

While implementing this workflow, you may encounter these frequent issues:

**1. "Failed to get OIDC token" error during signing**

- **Cause**: Missing or incorrect `id-token: write` permission in workflow
- **Solution**: Verify that `permissions.id-token: write` is set at the workflow level, not just the job level. GitHub OIDC tokens require explicit permission grants.

**2. "Registry authentication failed" when pushing images**

- **Cause**: `GITHUB_TOKEN` lacks permissions to write to GitHub Container Registry
- **Solution**: Ensure `permissions.packages: write` is set and that your GitHub Container Registry is enabled for the repository. For organizational repositories, verify that package creation is allowed.

**3. Policy Controller blocks system pods after enabling enforcement**

- **Cause**: ClusterImagePolicy applies to all namespaces by default, including infrastructure namespaces
- **Solution**: Add namespace exemptions for `kube-system`, `kube-public`, `cosign-system`, and other infrastructure namespaces using the `exclude` field in your ClusterImagePolicy.

**4. "Signature verification failed" for correctly signed images**

- **Cause**: Identity mismatch between signing certificate and policy configuration
- **Solution**: Use `cosign verify --certificate-identity-regexp` with the exact pattern that matches your workflow identity. Check the certificate details with `cosign verify --output=text` to see the actual identity claims.

## Compliance and Audit Considerations

The implementation described in this guide directly addresses regulatory requirements emerging in 2025, particularly the European Union's Cyber Resilience Act (CRA), which mandates supply chain transparency for products containing software components.

**Rekor's transparency log** provides an immutable, append-only record of all signing events. Each signature operation writes an entry to Rekor containing the signature, certificate, and timestamp. This creates a cryptographically verifiable audit trail that cannot be altered or deleted retroactively. When investigating a security incident or conducting compliance audits, teams can query Rekor to determine exactly when an image was signed, by which identity, and under what circumstances. This capability satisfies audit requirements for provenance documentation and provides forensic evidence for incident response.

The **EU Cyber Resilience Act**, which entered into force in 2024 and becomes enforceable in December 2027, imposes specific obligations on manufacturers of products with digital elements sold in the EU market. The CRA requires manufacturers to maintain SBOMs in machine-readable formats for all software components, with a minimum scope covering top-level dependencies. The act positions SBOMs as essential tools for vulnerability tracking and cybersecurity risk management, enabling both manufacturers and regulatory authorities to respond rapidly to emerging threats. While the CRA does not mandate public disclosure of SBOMs, manufacturers must provide them to market surveillance authorities upon request. Non-compliance can result in penalties up to €15 million or 2.5% of global annual turnover.

## Conclusion and Next Steps

You now possess an implementation of container supply chain security built with industry-standard tools and configurations. Your environment includes:

1. A GitHub Actions workflow that automatically signs container images and generates dual-format SBOMs with every build
2. Cryptographically verifiable proof of image provenance through Sigstore's keyless signing infrastructure
3. Machine-readable transparency artifacts (SPDX and CycloneDX SBOMs) attached as attestations to every container image
4. A Kubernetes enforcement layer that validates signatures and attestations before allowing deployments
5. An immutable audit trail in Rekor's transparency log for compliance and incident response
6. A foundation for meeting EU Cyber Resilience Act requirements

The security posture improvements are substantial. Where container deployments previously relied on trust, they now operate on cryptographic verification. Where vulnerability management required manual tracking, SBOMs enable automated discovery. Where compliance audits depended on documentation, immutable transparency logs provide verifiable evidence.

### Additional Resources

To extend this implementation or deepen your understanding of container supply chain security:

**A word from us:** Achieve CRA compliance with [Kunnus](https://cyber-resilience.tech/), our Cyber Resilience Platform for manufacturing, IoT, and Industry 4.0. Complete with supply chain security, SBOM management, and EU Cyber Resilience Act consulting.

**Sigstore Documentation** ([https://docs.sigstore.dev](https://docs.sigstore.dev)) - The authoritative source for Cosign, Policy Controller, and the broader Sigstore ecosystem. Beyond the basics covered in this guide, you'll find documentation on custom attestation types for proprietary metadata, policy composition patterns for multi-tenant clusters, and integration guides for CI/CD platforms beyond GitHub Actions. The reference documentation includes detailed API specifications and troubleshooting guides for production deployments.

**EU Cyber Resilience Act Compliance** ([https://digital-strategy.ec.europa.eu/en/library/cyber-resilience-act](https://digital-strategy.ec.europa.eu/en/library/cyber-resilience-act)) - Official CRA documentation from the European Commission, essential for organizations selling products with digital elements in EU markets. This resource includes detailed technical annexes specifying SBOM requirements, vulnerability disclosure timelines, and security update obligations. Manufacturers can use this documentation to map their supply chain security implementation to specific CRA mandates and prepare compliance evidence for market surveillance authorities.

**Advanced Policy Controller Configurations** ([https://docs.sigstore.dev/policy-controller/overview/](https://docs.sigstore.dev/policy-controller/overview/)) - Deep dive into Policy Controller's advanced capabilities. Learn how to compose multiple policies for different image sources, implement custom validation logic using CUE or Rego, and integrate with external verification services. This resource covers complex scenarios like verifying private Sigstore deployments, implementing policy inheritance hierarchies, and monitoring policy effectiveness through metrics and alerts.

**SBOM and Vulnerability Scanning Integration** - Extend your SBOM implementation with automated vulnerability detection. Integrate Syft-generated SBOMs with Grype ([https://github.com/anchore/grype](https://github.com/anchore/grype)) for comprehensive vulnerability scanning that matches CVEs against your software components, or use Trivy ([https://github.com/aquasecurity/trivy](https://github.com/aquasecurity/trivy)) for multi-scanner detection including OS packages, language libraries, and infrastructure-as-code vulnerabilities. Both tools can consume SPDX and CycloneDX formats and integrate into CI/CD pipelines for automated security gates.
