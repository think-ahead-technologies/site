---
publishDate: 2025-03-98T00:00:00Z
title: "Zero-trust for Kubernetes Clusters and Applications with Teleport"
excerpt: Learn how to secure Kubernetes clusters and applications with Teleport’s zero trust architecture. This guide covers integrating Teleport Cloud with a Kind Kubernetes cluster, deploying Grafana, and using JWT authentication and application autodiscovery for secure access.
draft: true
tags:
    - teleport
    - zero-trust
    - security
    - kubernetes
    - grafana
    - english
---

## Prerequisites

Before we begin, ensure you have the following:

- **Teleport Cloud Account**: Sign up for a Teleport Cloud account if you haven't already.
- **Kind**: Install Kind to create a local Kubernetes cluster.
- **Helm**: Ensure Helm is installed for deploying applications on Kubernetes.
- **kubectl**: Install kubectl to interact with your Kubernetes cluster.
- **tsh (Teleport CLI)**: Install `tsh` for authentication and cluster access.

## Step 1: Set Up a Kind Kubernetes Cluster

First, we'll create a local Kubernetes cluster using Kind:

```bash
kind create cluster --name teleport-demo
```

This command initializes a Kubernetes cluster named `teleport-demo`.

## Step 2: Deploy the Teleport Kubernetes Agent

The Teleport Kubernetes Agent facilitates the integration between your Kubernetes cluster and the Teleport Cloud. We'll deploy it using Helm.

1. **Add the Teleport Helm Repository**:

    ```bash
    helm repo add teleport https://charts.releases.teleport.dev
    ```

2. **Update the Helm Repository**:

    ```bash
    helm repo update
    ```

3. **Install the Teleport Kubernetes Agent**:

    Create a `values.yaml` file with the following configuration:

    ```yaml
    proxyAddr: "your-account.teleport.sh:443"
    authToken: "your-teleport-auth-token"
    kubeClusterName: "teleport-demo"
    discover:
        - namespace: "default"
    ```

    Replace `your-account.teleport.sh:443` with your Teleport Cloud proxy address and `your-teleport-auth-token` with your Teleport authentication token. The `discover` field specifies the namespaces for application autodiscovery.

    Then, deploy the agent:

    ```bash
    helm install teleport-kube-agent teleport/teleport-kube-agent -f values.yaml
    ```

    This command installs the Teleport Kubernetes Agent in your cluster. For detailed configuration options, refer to the [Teleport Kubernetes Agent Helm Chart Reference](https://goteleport.com/docs/reference/helm-reference/teleport-kube-agent/).

## Step 3: Authenticate to Kubernetes Using Teleport (`tsh`)

Now that the Teleport Kubernetes Agent is running, we can authenticate to the Kubernetes cluster using `tsh`, the Teleport CLI.

1. **Login to Teleport Cloud**:

    ```bash
    tsh login --proxy=your-account.teleport.sh --user=your-teleport-username
    ```

    Replace `your-account.teleport.sh` with your Teleport Cloud proxy address and `your-teleport-username` with your Teleport username.

2. **List Available Kubernetes Clusters**:

    ```bash
    tsh kube ls
    ```

    This command will display the Kubernetes clusters registered with Teleport.

3. **Select and Authenticate to the Kubernetes Cluster**:

    ```bash
    tsh kube login teleport-demo
    ```

    This sets up the Kubernetes authentication context, allowing you to interact with your Kubernetes cluster using `kubectl`.

4. **Verify Kubernetes Access**:

    ```bash
    kubectl get pods -A
    ```

    If authentication was successful, you should see a list of running pods in your Kubernetes cluster.

## Step 4: Deploy Grafana on Kubernetes

Next, we'll deploy Grafana using its official Helm chart.

1. **Add the Grafana Helm Repository**:

    ```bash
    helm repo add grafana https://grafana.github.io/helm-charts
    ```

2. **Update the Helm Repository**:

    ```bash
    helm repo update
    ```

3. **Install Grafana**:

    Create a `grafana-values.yaml` file with the following configuration to enable JWT authentication:

    ```yaml
    grafana.ini:
        auth.jwt:
            enabled: true
            header_name: X-Auth-Token
            email_claim: email
            jwk_set_url: https://your-teleport-domain/.well-known/jwks.json
    service:
        type: ClusterIP
    ```

    Replace `https://your-teleport-domain/.well-known/jwks.json` with the URL to your Teleport's JSON Web Key Set. Then, install Grafana:

    ```bash
    helm install grafana grafana/grafana -f grafana-values.yaml
    ```

    This configuration sets up Grafana to authenticate users based on JWT tokens issued by Teleport.

## Step 5: Expose Grafana via Teleport Application Autodiscovery

With the Teleport Kubernetes Agent deployed and Grafana configured for JWT authentication, Teleport can automatically discover and register Grafana as an application. This process allows users to access Grafana securely through Teleport without additional manual configuration.

For more details on Kubernetes application autodiscovery, refer to the [Teleport Documentation](https://goteleport.com/docs/enroll-resources/auto-discovery/kubernetes-applications/).

## Conclusion

By integrating Teleport with your Kubernetes cluster, you establish a zero trust security model that enhances the protection of both your infrastructure and applications. This setup not only secures access but also simplifies the management of authentication and authorization policies across your environment. Leveraging features like application autodiscovery and JWT authentication streamlines the process of securing applications like Grafana, ensuring that only authorized users can access sensitive dashboards and data.

Implementing these practices aligns with the principles of zero trust security, providing a robust framework to safeguard your Kubernetes clusters and the applications running within them.
