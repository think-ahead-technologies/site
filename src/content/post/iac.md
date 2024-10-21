---
publishDate: 2024-10-07T00:00:00Z
title: "Infrastructure as Code: what and why?"
excerpt: Infrastructure as Code is a powerful concept that has grown in popularity in recent years. We explore how it works, the benefits it brings over more manual alternatives, and some of the wider implications of the technology.
image: /iac-pixabay-pexels.jpg
draft: false
tags:
    - infrastructure-as-code
    - cloud
    - coding
    - english
---

## What is Infrastructure as Code?

In our article on the [Teleport demo environment](teleport-demo-env.md) we reference Infrastructure as Code — but what is it? Why is it interesting, why should I care, and how does it even work?

The general idea of IaC is to write down your infrastructure needs and configurations in code form. This can then be stored in version control, retrieved and referenced when needed, and — crucially — doesn't require much (or, if configured right, any) human input to deploy.

What does deployment mean for IaC? This varies depending on the tool and domain, but broadly fits into two categories. First there's **imperative** IaC — e.g. Ansible, Puppet — where your code specifies a series of actions to be executed one after another. With **declarative** IaC like Terraform or CloudFormation, though, your code simply describes what you _want_ and the tool figures out how to make it reality.

It may sound like the latter approach is superior, or at least simpler to write, but in practice they're used in **different contexts**. Declarative code is great when dealing with resources that can be created or destroyed at will, while the imperative style fits better with contexts like setting up a machine, where the means of interaction with the target — e.g. `bash` commands — lends itself to sequential commands.

And of course, the two can be combined. **Continuous Integration and Continuous Deployment (CI/CD)** tools like GitHub Actions or CircleCI, while arguably not 'really' IaC as they do much more than provision infrastructure, can run sequential commands to set up and execute declarative tools like Terraform. This can then make infrastructure deployment an entirely human-free process.

You can also achieve similarly complete automation while doubling down on the declarative approach. **GitOps** tools can watch both your code and your infrastructure and ensure that they match at all times. But this is a topic for another article!

## Why should I care?

Infrastructure as Code is a powerful tool, which can benefit your business in a range of ways from efficiency and reliability to scalability and security. Let's explore a few.

#### Never trust a human

Firstly, again, IaC removes the need for **human intervention**. This has various knock-on benefits, but perhaps the most immediate one is the avoidance of **human error**. Say you have to provision your company's software on custom servers using a public cloud provider like AWS. This is doable through "ClickOps", with an engineer clicking through the cloud console to create some servers, then SSH-ing into the machines to set them up.

Of course, this all takes time — though maybe you've budgeted for that time, and you're happy to spend it. We'll talk about this more below. But while working, what if you **mis-click?** You could create the wrong size of server, leading to slowdown of your critical software, or (in the other direction) waste money. You could put the server in the wrong region, subnet, security group, VPC — making it inaccessible to things that need it or _too_ accessible to things that shouldn't have access. Or any number of other scenarios, ranging from "inconvenient" to "let's have some serious conversations about budget" to "we've just been sued out of existence".

Let's suppose your engineers are brilliant, though, and never make mistakes. Even so, their memory isn't perfect. Say you made a change to your system which now needs to be reverted: the use case is no longer relevant, the regulation changed, or maybe there's a subtle issue you're trying to trace. With IaC, it's trivial to check your commit history to see exactly what was changed, and when - with commit messages, blame tags and more to help you understand and remember how and why it all fits together. Sure, if you run everything manually you can keep notes, but these risk getting unwieldy, out-of-date, lost or any number of other unhelpful fates. Clear, structured code commits can help immeasurably.

A hidden extra downside to the time requirement and chance of human error is that if you have to **deploy manually**, you **won't do it as often**. _Why should I recreate that server when it's already up and running?_ _I'll deploy that new code change next week, I already spent an hour deploying the last version yesterday._ _I don't want to fix that issue now, it's Friday afternoon and I'd prefer to have slightly broken code over the weekend than to risk completely breaking everything on a Friday evening._ Or, in the worst case: _I know everything's broken, but it'll just have to wait because the guy who knows how to deploy it is off sick._

Ever heard the phrase "<a target="_blank" href="https://www.youtube.com/watch?v=5UT8RkSmN4k">**Have you tried turning it off and on again?**</a> Well, it's a cliché for a reason: there are countless ways software can get out of an optimal state, and simply resetting it can often be the most reliable and efficient way to get it back on track.

#### The benefits of speed

Automation doesn't simply provide reliability; it also provides speed. When compared with humans poking around with manual configuration, or even writing manual bash scripts to automate things in ad-hoc ways, tools like Terraform can speed up two things. First, IaC can allow **fast definition** of what you need: by keeping the tool that you're using consistent, and referencing the (often extensive) documentation on it, it can be trivial to define a new server or to link some new database into your broader networked system.

More importantly, though, IaC permits **fast deployment** of your code. This means you don't need to wait (as much) to get something into a state where it can be used — whether by testers to provide feedback, by end-users to make them happy, by demonstrators who tweaked a feature half an hour before the showcase, or any number of others. Even a failed deployment can provide prompt indicators, letting you know there's an issue (and, ideally what's wrong) without delay, allowing you to get fixing things fast.

What's more, rapid deployments can have a variety of knock-on positive effects. Research into high-performing teams has produced <a target="_blank" target="https://www.thoughtworks.com/radar/techniques/four-key-metrics">**Four Key Metrics**</a> that indicate when teams' productivity is likely to be high. One of these is Deployment Frequency, while another is Mean time to Restore after a failure. The first is directly related to the amount of effort (and, to a lesser extent, time) involved in a deployment, as discussed above, while the second is likely to be heavily influenced by many of the factors we've discussed. If you're interested, we recommend looking more into the Four Key Metrics.

##### Speed up, speed down

There's yet another benefit of having a codebase that's clearly defined with automated deployment: it **scalability**. In a manual world, deploying more resources can easily require going through the full process of setting up each new machine. Similarly, scaling down involves selecting machines to destroy.

In order for IaC to help with scaling, you can **define configurations** — like virtual machine or cloud function specs — which then allow you to give very simple instructions to say you want more (or fewer) resources. Automated processes can then take over, often without even needing to do any additional deployment steps. Even better, these simple instructions can _themselves_ be automated, configured to monitor the current load and create or destroy resources as appropriate, with no further human interaction. That can allow for huge spikes in traffic — say, when you release a new product — with no impact on cost the rest of the time.

#### Security with visibility

There are more benefits of IaC, but the last one we have time for here is in security. This is a little less clear-cut, but basically comes down to: the **more people have privileges** to deploy your code or change your infrastructure, the more ways an **attacker can gain** those privileges. Your developers might simply be careless, committing credentials to a public repository or letting a non-work person use their laptop briefly. Or the attacker might be proactive, using phishing emails to get credentials or install back-doors into your developers' machines. There are always things one can do to mitigate these risks, but in this perpetual arms race such attacks are always possible.

So how does IaC reduce this risk? (Notice that I say _reduce_, not _eliminate_.) IaC supports CI/CD, mentioned above; in a well-orchestrated system with CI/CD, deployment — or simply access — to your **production** system should be **strictly limited**. Deployments should be made to lower environments before getting to production (a process which would multiply any manual effort/risk required, but is easy to do with IaC); if developers want to access databases and such for testing purposes this should be only on those 'development' environments. Then the only entity which normally has any power to affect production should be your CI system, running your IaC.

But, I hear you ask, what's to stop an attacker from simply hijacking a development machine, making a **malicious change** and pushing that **to production** _through_ these automated processes? The answer is: an attacker could absolutely do that, but then every step of the process would naturally be logged. The original commit would detail the exact change they made, helping you fix it, and would probably also be tagged with the account of the compromised developer so they can take measures — like changing passwords — to prevent future attacks. You would know exactly when the attack was carried out, and might even get notifications about the deployment.

A more severe scenario would be an **attacker gaining access** directly (e.g. through SSH) to the machine running your CI pipelines. They could then make changes with impunity, without creating such a paper trail. This would be very bad, but can be mitigated by preventing anyone — even your own admins — from accessing your CI machines. This can be done with 'hardened' images, and by using ephemeral runners so any problems can be resolved by simply terminating the deployment machine rather than debugging manually.

Without IaC, neither of these problems could arise. But remember: that's because the **alternative** is that every, or at least some, devs would have access to deploy to any and all your environments. So these risks would still apply, but with human actors who are less predictable, less traceable and more lazy than any automated processes.

#### IaC's paradigm shift

Infrastructure as Code is a powerful concept. It takes a huge amount of the risk, effort, time and variability out of deployment (and tracking) of infrastructure. We've discussed a few of the benefits, but what's almost more exciting is the range of **innovation made possible** by the approach. We've touched on Continuous Deployment and its relevance to the Four Key Metrics, plus tools like GitOps that enable vast amounts of adaptive scaling with minimal human effort. Central to these is Kubernetes, a deployment system which is sweeping the world and which makes heavy use of IaC in several of its core elements.

With Infrastructure as Code, the possibilities are endless.
