---
publishDate: 2024-10-11T00:00:00Z
title: "Creating our Teleport demonstration environment"
excerpt:
    With our partner Teleport, our goal is to provide a comprehensive service to our customers. This means both being knowledgeable about the product itself that we are selling, and also being able to apply it to client systems in ways that are simple both for us and for those we work with.

    To fulfil these goals we have set up a demo environment, with open-source code, which you can view on GitHub. We've built it with a few key priorities in mind.
image: https://goteleport.com/blog/_next/image/?url=%2Fblog%2Fstatic%2Fog-image.png&w=1080&q=80
tags:
    - teleport
    - security
    - coding
    - architecture
    - english
---

## The situation

With our partner Teleport, our goal is to provide a comprehensive service to our customers. This means both being knowledgeable about the product itself that we are selling, and also being able to apply it to client systems in ways that are simple both for us and for those we work with.

To fulfil these goals we have set up a demo environment, with open-source code, which you can <a href="https://github.com/think-ahead-technologies/teleport-demo" target="_blank">view on GitHub</a>. We've built it with a few key priorities in mind.

## Priority 1: easy to access

The most important thing about a demonstration environment is that it can be _used_ as such. There are a few aspects to this, but the main ones are that the code should **contain all that's needed**, be **easy to run** and intuitively **compartmentalised** to make it **easy to talk through**.

The most basic way to achieve this is to implement **everything as-code** - from the different cloud resources, implemented in Terraform, through the small bash scripts needed to set these up, to the deployment pipelines we can trigger at will. This allows anyone -- a first-timer looking at the code, someone who's half implemented their own stack but wants to check, or even ourselves when returning to the demo after a period on other work -- can find objective answers to practical questions. What order should the steps be deployed? Check the relevant GitHub Actions config. Where is a given resource referenced? Check the Terraform. How do we set up a new Teleport resource machine? Check its userdata script.

A related and powerful goal is that the demo should be **easy to get up and running**. We don't perform demonstrations all the time, so may forget small technical details - plus we may not have the time or Internet connection to perform detailed manual processes even if they're clear. As such, it's massively helpful to be able to deploy -- and destroy -- our environments with the click of a single button. In this case, we've chosen a Continuous Integration (CI) tool that's commonly used, visible directly from our repository so there's no extra logins or links to think about, and easily configurable with code: namely, <a target="_blank" href="https://github.com/features/actions">GitHub Actions</a>.

Of course, even when everything is automated, it's important to know what to run, and what to be aware of. This is where our <a target="_blank" href="https://github.com/think-ahead-technologies/teleport-demo/tree/main/README.md">README</a> comes in.

With these decisions made, the next best way to to make our code accessible is to **structure** it clearly. This is a more subjective goal, of course, which we've approached by splitting things out by <a target="_blank" href="https://infrastructure-as-code.com/posts/defining-stacks.html">stacks</a>. These are collections of infrastructure files/resources which are deployed together. We've grouped them in two levels: first by the broad type of deployment, then by the stage of that deployment. Each folder within our repository can be deployed either as a <a target="_blank" href="https://www.hashicorp.com/products/terraform">Terraform</a> project or a <a target="_blank" href="https://fluxcd.io/">Flux</a> configuration set, with intentionally limited variables being shared between the stages.

This division style is done with a view to making each deployment unit relatively **self-contained**, in terms of logic as well as code. It should be easy to look at a folder of code files and understand why it exists, when it should be deployed and what it would need -- essential for a demo system. It should also be possible to take that code and use it in a new context with minimal alterations, a priority worth exploring in more depth.

## Priority 2: easy to adapt

A demo system serves two purposes. First, it has to deploy the relevant software -- in this case, Teleport -- in a meaningful way that can be easily understood and replicated. Secondly, it should **act as a template**, providing code that works in a demo environment but could easily be made to work for a real end-user.

In the case of Teleport, we've assumed there are **two major aspects** of a deployment that are relevant: **which (public) cloud** is used, and whether the code is deployed on **Kubernetes or 'raw' instances**.

The choice of **public cloud** is heavily client-dependent: most companies will have one or more preferred vendors which they already use. Our intention is to add more clouds to the codebase, but our initial setup uses two. Given Teleport's focus on security and control of one's infrastructure, we have chosen local European provider <a target="_blank" href="https://www.scaleway.com/">Scaleway</a> for most of our resources. However, as some aspects of Scaleway's databases aren't trivially compatible with Teleport, and as our own Think Ahead organisation is set up within <a target="_blank" href="https://azure.microsoft.com/">Microsoft Azure</a>, we've integrated the database and access features with that.

As for the deployment type: both Kubernetes and instances are provided by just about any cloud provider, with fairly similar Terraform resources in each provider - but between the two paradigms the deployment process varies dramatically. We've thus implemented both, in full and in parallel. **On instances**, it's easy to see the precise configuration required to get Teleport working. We expect our clients to more often rely **on Kubernetes** because of its ease of scaling and its deployment automation, but the code required for this is undeniably more complex.

## Challenges

Of course, no coding project proceeds flawlessly, and our demo has had its challenges. Given our broad control of the goals and deployment processes these were gnerally smaller than in many other projects, but it's always worth taking stock!

The main sticking points came from the difference between our demo and the business contexts in which Teleport is normally deployed. Specifically, **Teleport expects long-lived systems**, with persistent databases and Kubernetes clusters, while our demo will be used intermittently and we have no need for its resources when we aren't using it - so we destroy it completely between times. As such, a few extra steps are needed to recreate database structures from scratch. Similarly, the Teleport auth system generates credentials when set up which can then be retrieved by proxies down the line - but on Kubernetes we have usually been setting both up simultaneously, leading to some slightly complicated dependencies!

Unrelated to the Teleport product, the implementation of **Kubernetes on Terraform** was harder than anticipated. Beyond the cluster itself, a few Kubernetes resources needed to be deployed by Terraform directly, notably those related to secrets and credentials. However, the Terraform Kubernetes provider currently has a limitation where the CustomResourceDefinition of any resource must be present during `terraform plan`. This required us to split our Kubernetes resources into several stacks, as secrets have to be deployed after their secret provider, which in turn can only be deployed once the cluster itself is up and running.

Overall, though, these challenges provided good opportunities to get to know the Teleport product in ever more detail, and we're pleased with the demo codebase we've produced. Have a look around!

What do you think? Are there priorities we've missed, or are you keen to try Teleport yourself? [**Book a free consultation**](https://outlook.office365.com/book/ThinkAheadTechnologies@think-ahead.tech/) to discuss whether it's the right tool for you, or any related questions you may have about your infrastructure!
