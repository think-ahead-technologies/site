---
publishDate: 2025-09-29T00:00:00Z
title: "Software Supply Chain Security: Mastering the 2025 Threat Landscape with a Risk-Based CI/CD Maturity Framework"
excerpt: Self-hosting is a powerful approach to running your own infrastructure. In this blog post, we’ll explore how you can set up Teleport on your own infrastructure, using Terraform and GitOps.

[//]: # (image: /iac-pixabay-pexels.jpg)

draft: true
tags:
    - software supply chain security
    - CI/CD security
    - zero-trust
    - AI security
    - Github
    - GitLab
    - english
---

## **Part I: The New Nexus of Risk – The Escalation of the CI/CD Threat Landscape**

### **1.0 The Crisis of Trust: Quantifying the Supply Chain Security Imperative**

The contemporary threat landscape confirms that the software supply chain is no longer a peripheral concern but the primary attack surface leveraged by sophisticated state and criminal actors. Adversaries have successfully transitioned their focus from exploiting endpoint vulnerabilities to compromising the upstream processes that generate trusted software artifacts. This operational shift has elevated software supply chain security from a technical issue to a critical business continuity and governance risk.

#### **1.1 Global Financial and Corporate Impact**

The financial stakes associated with supply chain compromises are mounting rapidly and demonstrably. Industry analysis indicates that the cost of these attacks is accelerating dramatically, projected to exceed $60 billion globally in 2025 and rise further to over $80.6 billion by 2026 \[1\]. This massive exposure requires executive leadership to view CI/CD pipeline security as a fiduciary responsibility. Furthermore, the likelihood of compromise is statistically significant: Gartner projected that 45% of organisations will experience a software supply chain attack by 2025 \[1\]. Given these metrics, relying solely on preventative security measures is insufficient. This environment mandates the adoption of a mature security posture focused on resilience, rapid detection, and containment—practices characteristic of Maturity Level 3 and Level 4 organisations.

#### **1.2 The Failure of Perimeter Defense: From Target to Vector**

The defining characteristic of modern supply chain breaches is the exploitation of trust within the software delivery lifecycle. Attacks following the SolarWinds and 3CX models target the continuous integration and continuous delivery (CI/CD) pipelines because they offer the highest operational leverage. A single point of compromise within the build or release environment yields code execution capabilities across potentially thousands of downstream customer systems, effectively turning the producer's trusted system into a pervasive distribution vector for malware or backdoors. This necessitates treating the CI/CD environment as the organization’s "crown jewels," demanding a rigorous security framework that anticipates and defends against intrusion at every stage of the pipeline.

### **2.0 Deep Dive: Signature Supply Chain Incidents (2024–2025 Analysis)**

Recent, high-profile incidents underscore the evolution of attack sophistication, targeting new ecosystems, and exposing systemic failures in industry-wide Mean Time to Remediate (MTTR).

#### **2.1 The Open-Source Ecosystem and Sophisticated Backdoors (XZ Utils)**

The 2024 XZ Utils backdoor campaign demonstrated an unprecedented level of stealth, patience, and technical integration. Adversaries embedded an encrypted backdoor into the widely used XZ compression library via a compromised maintainer, using sophisticated techniques like glibc IFUNC tricks to bypass SSH authentication and grant unrestricted remote access. This incident highlighted that even foundational open-source components are subject to highly complex geopolitical targeting.
Furthermore, an analysis of the aftermath revealed a persistent challenge in artifact hygiene. Although the primary stable versions were quickly patched, as late as August 2025, researchers identified several Debian Docker development images on Docker Hub that still contained the compromised XZ Utils backdoor \[2\]. The continued presence of compromised artifacts, even in unmanaged or development containers, signifies a critical gap in organizational cleanup and inventory management. The technical implication is clear: successful security maturity, particularly at Level 3, requires continuous artifact integrity verification and scanning that extends rigorously beyond formal production environments into all development and staging registries. Failure to enforce these continuous checks allows latent threats to persist, compromising environments used for testing and potentially reinfecting cleaned production systems.

#### **2.2 Domain Hijack and Dependency Control (Polyfill.io)**

Dependency governance risks were dramatically highlighted by the Polyfill.io CDN hijack in February 2024\. After the domain was acquired by a Chinese company (Funnull), the widely-used Polyfill.js script was immediately modified to insert malicious code, redirecting end-users to scam sites, stealing sensitive data, or potentially performing remote code execution \[3\].
This attack exposed a collective industry failure in managing third-party dependencies and responding quickly to compromise. Despite extensive notifications regarding the attack, researchers observed that more than 380,000 hosts were still embedding the malicious Polyfill script as of July 2, 2024 \[4\]. This alarming delay between the initial February compromise and the widespread residual infection several months later demonstrates a systemic inability across organisations to quickly audit, track, and block compromised external assets. Achieving Level 4 maturity requires organisations to implement continuous risk scoring for _all_ suppliers and automated Policy-as-Code (PaC) enforcement that can instantly sever connections to compromised third-party resources, thereby dramatically lowering the MTTR for browser-based supply chain breaches.

#### **2.3 The Environment as the Target (Red Hat GitLab Breach, Sep 2025\)**

The September 2025 breach targeting a Red Hat Consulting GitLab instance, attributed to the Crimson Collective extortion group, demonstrates the strategic value of compromising the build and collaboration environments themselves. The attackers claimed to have exfiltrated approximately 570GB of compressed data from over 28,000 internal repositories \[5\]. The stolen data included CI secrets, configurations, and, critically, hundreds of Customer Engagement Reports (CERs). These CERs typically contain highly sensitive customer information, such as architecture diagrams, network maps, and authentication tokens—effectively providing a blueprint of customer IT environments \[5\].
This incident confirms that the security perimeter must extend beyond the main product supply chain. The loss of customer infrastructure blueprints and authentication tokens represents a strategic compromise far exceeding the theft of proprietary source code. The successful exfiltration of this data implies that the CI/CD environment where this data resided was not sufficiently segmented, allowing the adversary to move laterally and steal vast amounts of data once the initial foothold was established. The implication for governance is that organisations must defend all CI/CD environments—including those used for internal consulting or secondary projects—with Level 4 Zero-Trust controls, pervasive microsegmentation, and rigorous Just-In-Time (JIT) access policies to prevent lateral movement and catastrophic "crown jewel" theft \[6\].

### **3.0 Defining the Enhanced Risk Model for CI/CD**

The confluence of these events necessitates an updated, enhanced threat model for CI/CD pipelines, categorizing the risks that the maturity framework must address.

- **Credential & Secret Leakage:** The exposure of hard-coded or static credentials remains the most immediate and exploitable threat. Even when utilizing centralized vaults, the critical vulnerability lies in the long-lived nature of the tokens consumed by the CI agent. Failure to adopt Just-In-Time (JIT) access and ephemeral tokens represents a major attack surface, as static credentials offer attackers a persistent foothold once stolen \[7, 8\].
- **Malicious Dependencies / Supply-Chain Libraries:** This risk has broadened significantly. While traditional dependency confusion and vulnerable open-source libraries (e.g., npm ua-parser-js takeover) remain threats, the risk now extends into the realm of Artificial Intelligence and Machine Learning (AI/ML). Poisoned datasets or backdoored models (such as the 2025 nullifAI incident) introduce new vectors for hidden backdoors and biased outputs \[9, 10\].
- **Poisoned Pipelines (Configuration Injection):** This involves an attacker modifying pipeline definitions (YAML or build scripts) to execute arbitrary commands within the high-privilege build environment. The risk is exacerbated by insecure defaults, such as broad agent scopes or lack of network microsegmentation. To mitigate this risk effectively, organisations must deploy specialized runtime security measures, such as Endpoint Detection and Response (EDR) utilizing eBPF technology, to monitor and restrict kernel-level activity within ephemeral runners \[11, 12\].
- **Artifact Tampering (Integrity Violations):** This occurs when unsigned or improperly verified build outputs (binaries, containers) are swapped or modified post-build but prior to deployment. The lack of robust end-to-end provenance verification, such as full SLSA attestation chains, creates a critical gap that allows attackers to insert backdoors undetected.
- **Code/Data Exfiltration:** In a compromised environment, such as the Red Hat breach, malicious jobs can siphon proprietary code, configuration details, customer data, and secrets \[5\]. Robust access controls, network egress filtering, and runtime monitoring are necessary to prevent unauthorized outbound communication from the build node.
- **Insecure Defaults & Broad Access:** This category encompasses overly permissive configurations, including self-service provisioning of runners without approval, unchecked network egress, or inadequate Identity and Access Management (IAM). These defaults enable rapid lateral movement upon initial compromise.

## **Part II: The Enhanced CI/CD Security Maturity Framework**

This section introduces a structured, four-level maturity framework designed to provide CISOs and engineering leaders with a clear, prescriptive roadmap for minimizing the risks identified in the contemporary threat landscape.

### **4.0 Architecture of Assurance: Framework Levels and SLSA/SSDF Alignment**

The proposed framework integrates established foundational standards from industry bodies such as the National Institute of Standards and Technology (NIST) Secure Software Development Framework (SSDF) and the Supply-chain Levels for Software Artifacts (SLSA) \[13, 14\]. By adopting this structured approach, organisations can prioritize efforts effectively, starting with basic hygiene and progressing towards a fully attested, Zero-Trust environment. The framework levels are additive, meaning higher levels incorporate all controls from preceding levels.

- **Level 1: Foundational Hygiene and Visibility:** Focuses on baseline controls necessary to eliminate easily exploitable vulnerabilities, such as mandatory Multi-Factor Authentication (MFA), basic access controls, and initial vulnerability scanning. This stage focuses on basic visibility and process enforcement (e.g., protected branches).
- **Level 2: Automated Prevention and Enforcement (SLSA On-Ramp):** Introduces automated, preventive controls. This level mandates foundational artifact documentation (SBOM generation) and initial code signing. Level 2 aligns strategically with the initial requirements of the NIST SSDF and provides the necessary foundation to move onto higher SLSA levels \[14\].
- **Level 3: Real-Time Segmentation and Just-In-Time Access (Assume Breach):** This level adopts an "assume breach" posture, concentrating on reducing the blast radius of a successful compromise. Key controls include Just-In-Time (JIT) ephemeral credentials, immutable build agents, and continuous telemetry aggregation.
- **Level 4: Advanced Zero-Trust and End-to-End Attestation (Regulatory Institutionalization):** This is the highest level, demanding verifiable integrity across the entire software supply chain. It requires deterministic (reproducible) builds, multi-party code signing, pervasive Zero-Trust network segmentation, and automated, rapid incident response capabilities. Achieving Level 4 fully satisfies the highest attestation requirements of SLSA.

The following table summarizes the strategic requirements across the key security domains:
CI/CD Security Maturity Framework Summary

| Domain                  | Level 1 (Baseline)                 | Level 2 (Automated Prevention)                         | Level 3 (JIT/Segmented)                                    | Level 4 (Zero Trust/Attested)                                          |
| :---------------------- | :--------------------------------- | :----------------------------------------------------- | :--------------------------------------------------------- | :--------------------------------------------------------------------- |
| **Identity/Access**     | MFA required; Basic RBAC           | Minimal long-lived tokens; Review over-privilege       | JIT/time-bound access; Automated rotation \[7, 8\]         | Continuous authentication; Zero-trust networking; Key rotation \<24h   |
| **Build Configuration** | Protected branches; PR checks      | Approved action allowlist; Initial code signing        | Immutable agents; Comprehensive logging (OpenSSF)          | Reproducible builds; Full SLSA L4 attestation                          |
| **Dependency Gov.**     | Basic SCA scans; Trusted repos     | Mandatory SBOM generation; Allow/Block-lists           | SBOM enforcement (halt build if vulnerable); Vendor review | Continuous supplier risk scoring; AI/ML "AI-BOMs" \[15\]               |
| **Secret Management**   | No secrets in code; Basic scanning | Central vault (KMS) integration; Automated CI scanning | Ephemeral secrets (per-job token exchange)                 | Zero static credentials; Rotate all keys/tokens daily                  |
| **Monitoring/IR**       | Basic logging                      | Anomaly detection; EDR on build nodes \[11\]           | Telemetry into SIEM; Regular config auditing               | Automated remediation; Live threat hunting (e.g., eBPF runtime) \[12\] |

### **5.0 Domain-Specific Control Implementation: The Roadmap to Zero Trust CI/CD**

#### **5.1 Domain 1: Identity & Access Management (From Vaults to Ephemeral Tokens)**

Effective secret management must evolve beyond simply storing secrets in a central vault. While Level 1 and Level 2 require the use of centralized secrets vaults (e.g., cloud KMS, HashiCorp Vault) and automated scanning tools (such as Gitleaks) to enforce zero secrets being stored in code, Level 3 mandates the elimination of static access privileges.
The critical advancement at Level 3 is the implementation of Just-In-Time (JIT) access. JIT secrets delivery dictates that credentials, tokens, or keys are made available only at the precise moment of legitimate use, and access is immediately revoked upon job completion or expiration \[8\]. This transition relies on ephemeral credentials—one-time-use accounts or tokens that are created dynamically for the duration of a specific build job and immediately deprovisioned afterward \[7, 16\].
This shift to JIT delivery addresses the core security limitation inherent in static credentials: standing privilege. Even if a static secret is securely vaulted, a successful attacker who compromises a persistent CI agent or accesses pipeline logs can exploit that standing privilege for lateral movement or data exfiltration. By implementing JIT delivery, organisations enforce Zero Standing Privilege, rendering compromised persistent servers or logs valueless to the attacker once the specific job finishes. This capability directly mitigates the catastrophic risk of credential leakage demonstrated by incidents like the Red Hat breach, where stolen authentication tokens led to massive data theft \[5\]. Level 4 further institutionalizes this by requiring continuous authentication based on real-time workload behavior and a strict policy of rotating all non-machine-identity keys within a maximum 24-hour lifetime.

#### **5.2 Domain 2: Build Configuration and Integrity**

This domain ensures that the process of turning source code into a deployable artifact is secure and verifiable. Level 2 requirements focus on preventive measures, such as enforcing an approved allowlist of CI actions, plugins, and third-party tools to minimize injection risk via unauthorized components. It also mandates initial code-signing of commits or build recipes.
Level 3 mandates the use of immutable build agents or nodes. These containerized or virtual runners are provisioned for a single job and destroyed immediately after use, preventing persistence-seeking attackers from establishing a long-term foothold within the build environment.
Level 4 is defined by rigorous assurance of integrity through **Attestation and Reproducibility**. This requires implementing reproducible (deterministic) builds, where identical inputs always yield identical outputs. This feature is the foundation for achieving full SLSA-style build attestation (Level 4 compliance) \[13, 14\]. SLSA attestation verifies the complete provenance—the origin, dependencies, and process used—of every artifact, creating a non-forgeable, tamper-evident log that assures consumers that the final artifact matches the intended source code, thereby eliminating tampering risks post-build.

#### **5.3 Domain 3: Dependency & Open-Source Governance**

This domain focuses on managing the external risks imported via third-party code. Level 2 requires mandatory Software Bill of Materials (SBOMs) generation for all builds, along with the adoption of component allow-lists and block-lists, and the commitment of lockfiles.
Level 3 marks the strategic pivot from documentation to enforcement. At this level, **SBOMs become a policy gate**—builds are automatically halted if missing SBOMs are detected, or if components with known high-risk vulnerabilities are found. Crucially, Level 3 requires structured third-party vendor security reviews to provide visibility into suppliers’ internal security practices.
Level 4 institutionalizes continuous supply chain risk governance. This involves implementing continuous risk scoring of all suppliers and components based on vulnerability, license, and provenance risk. Furthermore, Level 4 requires the extension of component governance into the AI/ML ecosystem through the creation and maintenance of "AI-BOMs" (or ML-BOMs) for data and models \[15\]. This commitment aligns directly with the documentation requirements established by emerging regulations such as the EU Cyber Resilience Act (CRA) and the NIS2 Directive.

#### **5.4 Domain 4: Monitoring, Telemetry, and Incident Response**

Traditional logging (Level 1\) is reactive. Progressing to Level 3 requires continuous telemetry from the CI infrastructure to be ingested into a Security Information and Event Management (SIEM) system, along with anomaly detection (e.g., flagging new admin tokens or unusual IP activity). Furthermore, Endpoint Detection and Response (EDR) agents should be deployed on persistent build nodes.
The ultimate defense against sophisticated execution-based threats is achieved at Level 4 with **Runtime Defense**. This involves deploying EDR-style monitoring within ephemeral CI/CD runners using specialized kernel-level technologies like eBPF \[12\]. Tools like Harden-Runner leverage eBPF to provide fine-grained, kernel-level visibility and network egress filtering for ephemeral agents, restricting network traffic to only approved endpoints by default \[11\].
This capability is essential because advanced attacks, such as the XZ Utils backdoor, operate stealthily within the execution environment. Traditional endpoint security tools may be bypassed or may not function effectively in ephemeral, containerized CI environments. By deploying eBPF, the organization transforms the passive build environment into an active defense surface, capable of detecting and stopping malicious kernel-level behavior, thereby directly mitigating the "Poisoned Pipeline Execution" risk mid-build. Level 4 mandates continuous live threat hunting and automated remediation playbooks to ensure that the Mean Time to Remediate (MTTR) is maintained below one hour, satisfying stringent regulatory demands for rapid response.

## **Part III: Securing the AI/ML Supply Chain Extension (The 2025 Mandate)**

The integration of Artificial Intelligence and Machine Learning models into commercial products introduces novel and complex supply chain risks that demand dedicated maturity controls. The 2025 threat landscape has definitively shown that ML models are vulnerable execution artifacts.

### **6.0 The ML Pipeline Risk Surface and Model Integrity**

#### **6.1 New Vectors: Model Poisoning and Execution Artifacts**

The NullifAI incident, disclosed in February 2025, confirmed that public model repositories pose a direct threat to developers’ systems. Attackers uploaded trojanized ML models to Hugging Face, leveraging a "broken pickle" serialization trick to evade scanning \[9, 10\]. When unsuspecting developers loaded these models, a reverse shell was launched, compromising their local systems \[9\]. This highlights that ML model files, such as PyTorch .pt files or serialized formats like pickle, must be treated as potentially malicious executables requiring deep-level behavioral and signature scanning.

#### **6.2 Mapping to OWASP GenAI Top Risks (2025)**

The security requirements for AI pipelines must align with established frameworks, notably the OWASP GenAI Top 10 risks. The maturity model’s AI/ML extension specifically addresses:

- **LLM04: Data and Model Poisoning:** This focuses on preventing the manipulation of pre-training, fine-tuning, or embedding data to introduce vulnerabilities, backdoors, or systemic biases \[17, 18\].
- **LLM02: Sensitive Information Disclosure:** Controls are required to prevent large language models from inadvertently leaking proprietary or sensitive data derived from their training sets or system prompts \[17\].

### **7.0 AI/ML Maturity Controls (Extension to the Framework)**

Organizations at Level 3 and above must implement advanced controls to manage the AI/ML supply chain:

- **Level 3 (Provenance and Behavioral Checks):** Requires mandatory data provenance controls to track the source and transformations of all training and fine-tuning data. Additionally, organisations must implement bias, toxicity, and adversarial robustness checks on models prior to deployment, focusing on mitigating input-based risks.
- **Level 4 (Advanced Attestation and Detection):** This mandates the adoption of sophisticated technical controls:
    - **The AI-BOM Mandate:** Generating ML-BOMs (AI-BOMs) for all production models is required. These documents must detail not only software dependencies but also the datasets, training configurations, and lineage of the model itself. Standard formats like CycloneDX 1.5+ now support the ML-BOM specification \[15\]. The formalized adoption of ML-BOMs ensures regulatory traceability for AI systems, providing the foundational evidence needed to mitigate the risk of data poisoning (LLM04).
    - **Advanced Backdoor Detection:** To counter novel threats like NullifAI, Level 4 requires the implementation of research-backed techniques for detecting backdoors in models. Methods based on Interpretable Deep Learning (IBD) or information theory can reveal how a backdoor operates and have demonstrated significant increases in detection accuracy (up to 78%) with reduced time costs against compromised models, often operating effectively even under black-box conditions \[19\]. These practices safeguard the enterprise against both execution risks and the reputational and regulatory harm associated with poisoned or biased outputs.

## **Part IV: Strategic Governance and Compliance Mandates**

Achieving higher maturity levels is no longer merely a security recommendation; it is a legal prerequisite for operating in global markets. This framework institutionalizes security practices necessary for meeting mandatory global regulatory deadlines.

### **8.0 Mapping Maturity to Global Regulatory Requirements**

#### **8.1 The EU Cyber Resilience Act (CRA) – The SBOM as Law**

The EU Cyber Resilience Act (CRA), which took effect in December 2024, mandates "secure-by-design" practices and introduces strict obligations for software providers, fundamentally altering software transparency requirements.

- **Documentation and Transparency (Levels 2–3):** Mandatory SBOM generation and consistent enforcement (Level 3\) directly address the CRA’s requirements under Article 10, which requires providers to document software components meticulously and ensure proactive vulnerability management \[20\].
- **Incident Preparedness (Level 4):** The phased CRA deadlines require robust vulnerability and incident reporting procedures to be in place by September 2026\. Level 4 maturity, with its emphasis on rapid detection and automated remediation playbooks (KPI: MTTR \< 1 hour), ensures organisations are prepared for these mandated disclosure timelines. Full product compliance, including comprehensive SBOM usage, is required by December 2027\.

#### **8.2 The EU NIS2 Directive – Supply Chain Risk Governance**

The NIS2 Directive, which was intended for transposition by October 2024 (though implementation status varies across Member States in late 2025 \[21\]), explicitly mandates comprehensive supply chain risk management.

- **Supplier Accountability (Levels 3–4):** NIS2 Article 21 requires entities to manage supply chain risks through contractual cybersecurity obligations for suppliers. The framework’s Level 3 requirement for documented third-party vendor security reviews and Level 4 supply chain governance practices directly support this mandate.
- **Operational Continuity:** NIS2 mandates structured incident handling and timely supplier incident reporting. By adopting Level 4 controls (automated IR, forensic readiness, and rapid reporting KPIs), organisations ensure compliance with these stringent operational and reporting continuity requirements.

#### **8.3 Global Alignment (US EO 14028 and NIST)**

The comprehensive structure of this framework ensures alignment with international best practices, including the US Executive Order 14028 (2021) and subsequent guidance from CISA and NIST. The focus on secure build systems, mandatory SBOMs, and verifiable provenance echoes the core goals of the NIST Secure Software Development Framework (SSDF) \[22\]. SLSA’s four-level structure provides a prescriptive, prioritized pathway for organisations of all sizes to efficiently achieve the numerous, descriptive requirements laid out by the NIST SSDF \[13, 14\].

### **9.0 Institutionalizing Compliance as a KPI (Governance Model)**

Strategic governance involves transforming security efforts from periodic, static compliance assessments into continuous, automated assurance processes.

- **Policy-as-Code Enforcement:** By encoding policies (e.g., required SBOM presence, branch protection rules, secret scanning thresholds) using tools like Open Policy Agent (OPA), organisations ensure compliance gates are enforced automatically within the CI/CD pipeline (Level 2/3). This guarantees that security policies are consistently applied, auditable, and cannot be bypassed manually.
- **The Auditor’s Evidence Trail:** Level 4 practices, particularly the mandatory generation of full SLSA provenance logs, detailed CI telemetry, and ML-BOMs, provide incontrovertible evidence of secure development practices. This shifts the compliance audit process from a manual, document-intensive review to a real-time, verifiable confirmation of the secure SDLC, satisfying the rigorous documentation and traceability demands of global regulations.

## **Part V: Annex of Technical Controls and Best Practices**

This annex details the specific, actionable DevOps and Security controls necessary for implementing Level 3 and Level 4 maturity. These controls are derived from OWASP, OpenSSF, and observed mitigation strategies from the 2024–2025 breaches.

### **10.1 Source Repository Hardening**

- **Signed Commits:** Require cryptographic signing of all commits to ensure non-repudiation and prevent unauthorized code injection (Level 2).
- **Branch Protection and RBAC:** Enforce branch protections (no direct push to main, mandatory review) and apply strict Role-Based Access Control (RBAC) requiring MFA for all repository access.
- **Whitelisting:** Restrict the use of CI/CD actions and plugins to an approved allowlist.

### **10.2 Secret Management and JIT Implementation**

- **Central Vault Usage:** Mandate the use of centralized vaults or KMS (e.g., HashiCorp Vault, AWS Secrets Manager) for all non-development secrets (Level 2).
- **Ephemeral Credential Architecture:** Implement a token exchange architecture (Level 3\) where CI/CD agents authenticate to the vault using non-sensitive machine identity and receive short-lived session tokens for specific, authorized operations \[7, 8\].
- **Frequent Rotation:** Establish a policy of automatic credential rotation for all static keys and tokens with a maximum lifetime of 24 hours (Level 4).

### **10.3 Least-Privilege CI Runners and Network Segmentation**

- **Ephemeral Agents:** Use containerized, ephemeral build agents that are destroyed after a single execution to prevent attacker persistence (Level 3).
- **Network Microsegmentation and Egress Filtering:** Configure CI jobs with network microsegmentation. Mandate network egress filtering to restrict outbound traffic to an approved list of necessary endpoints (e.g., package registries, vault servers) \[11\]. Disable all default internet egress capabilities.
- **Runtime Monitoring (eBPF):** Deploy EDR-style runtime monitoring utilizing eBPF technology on the underlying CI infrastructure to detect and alert on unauthorized kernel-level activities, unusual process execution, or attempts to tamper with the host operating system \[11, 12\]. This provides the necessary visibility to counter execution-based threats within the build environment (Level 4).

### **10.4 Artifact Integrity and Provenance**

- **Code and Artifact Signing:** All compiled binaries, containers, and deployment manifests must be cryptographically signed by trusted, automated build system keys (Level 2/3).
- **Attestation Chains:** Implement full attestation chains using frameworks like in-toto to document the execution environment, dependencies, and parameters used for the build (Level 3).
- **SLSA L4 Requirements:** Enforce reproducible build practices (Level 4\) and use immutable registries that automatically reject unsigned or non-attested artifacts.

### **10.5 AI/ML Specific Controls**

- **Model Scanning:** Integrate specialized tools into the pipeline to perform static and dynamic analysis of imported ML models for known malicious patterns or misuse indicators (Level 3).
- **ML-BOM Generation:** Automatically generate ML-BOMs using CycloneDX or equivalent standards, documenting training data provenance, model architecture, and hyper-parameters for every production model (Level 4\) \[15\].
- **Advanced Backdoor Detection:** Implement multivariate-interaction-based detection methods or interpretable deep learning techniques, such as IBD, for detecting backdoors and poisoned examples in black-box models before deployment (Level 4\) \[19\].

### **10.6 Incident Preparedness and Forensic Readiness**

- **CI/CD Specific IR Plan:** Maintain a distinct Incident Response (IR) plan tailored specifically to pipeline compromises (Level 3).
- **Forensic Retention:** Ensure that comprehensive, tamper-evident logs of all build metadata, execution telemetry, and pipeline configuration changes are retained and ingested into the SIEM for forensic analysis (Level 3).
- **Regulatory Reporting Playbooks:** Establish automated playbooks that ensure rapid response and reporting procedures align with stringent regulatory timelines, such as the 24-hour and 72-hour windows stipulated by CRA and NIS2 (Level 4).

## **Conclusion and Strategic Mandate**

The escalating cost and technical sophistication of software supply chain attacks demand a fundamental shift in how organisations approach CI/CD security. The signature incidents of 2024 and 2025—from the deep stealth of XZ Utils and the residual chaos of Polyfill.io, to the strategic data theft in the Red Hat breach—confirm that legacy security models focused on perimeter defense and post-release scanning are obsolete.
The Enhanced Risk-Based CI/CD Maturity Framework provides the necessary architecture to move organisations beyond basic hygiene (Level 1\) into a state of continuous assurance and Zero Trust (Level 4). This evolution requires three critical strategic pivots:

1. **Elimination of Standing Privilege:** The move from vaulted secrets to Just-In-Time, ephemeral credentials (Level 3\) is paramount. This prevents attackers from leveraging stolen tokens for persistence or lateral movement, directly addressing the core vulnerability exploited in credential leakage incidents.
2. **Runtime and Artifact Verifiability:** The mandatory implementation of full SLSA L4 attestation and reproducible builds, combined with advanced EDR utilizing eBPF within the build runner (Level 4), transforms the passive pipeline into a secure, verifiable production factory, capable of detecting sophisticated code injection attempts mid-build.
3. **Institutionalized Governance and AI Traceability:** Achieving Level 3 and 4 maturity enables organisations to seamlessly meet global governance mandates. Specifically, SBOM enforcement satisfies the transparency requirements of the EU CRA, while continuous supplier risk scoring and rapid incident response processes align directly with the contractual accountability demanded by the NIS2 Directive. Furthermore, the adoption of ML-BOMs establishes regulatory readiness for the emerging AI supply chain.

By treating the CI/CD pipeline as the central hub of intellectual property and trust, and implementing the controls defined in Level 3 and Level 4, organisations can establish a resilient software delivery lifecycle that satisfies both advanced security requirements and mandatory global compliance obligations.
