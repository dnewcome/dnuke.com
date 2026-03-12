---
title: "The quest for modularity"
date: 2022-11-28T10:31:25-08:00
---

# The quest for modularity

I was reading some of [Avery Pennarun’s blog posts](https://tailscale.com/blog/modules-monoliths-and-microservices/) on system architecture and design. There was a set of bullet points that stood out to me that I will copy below:

The top-line goals of module systems are always the same:

- Isolate each bit of code from the other bits.

- Re-connect those bits only where explicitly intended (through a well-defined interface).

- Guarantee that bits you change will still be compatible with the right other bits.

- Upgrade, downgrade, and scale some bits without having to upgrade all the other bits simultaneously.

[This article](https://vlfig.me/posts/microservices) has some interesting heuristics as well:

State – If you don’t have state, just pure logic, you probably have a library, not a service. If you have state, but it doesn’t change with user requests what you have is configuration, either global or environment-specific. If changes to configuration are not time-sensitive, it can be a parameter to the deployment, which gets triggered when it changes. If they are time-sensitive you might need a configuration service that serves them continuously, rarely a bespoke one. If you do have global state that can change with, and across requests, you may have a service.

I have thought about this quite a bit over the years. My own heuristic revolves around units of deployment vs units of reuse. It’s kind of the same logic around static vs dynamic dependencies in C++. We make tradeoffs that might make sense initially (size vs complexity) but change as constraints change (more RAM/Disk, lower cost).

In the past I have favored library-driven development. I’ve come to learn that many times people are creating monolithic services (even if they are “micro”) that are really business logic libraries. When I architected the UberNote service tier, I started with a monolithic service, but the logic was all in a .NET assembly that was nicely organized into namespaces that would loosely be called “domain driven” today I think. If we needed to split things into multiple services, we could just use that library anywhere we needed to and the service would only call what it needed, or we could have split it into more than one dll to decouple the “deployment”.

I think that the most important part of a system design is the logical decomposition initially, and secondarily the topology (servers and pods, networks, etc). If the aspects of the logical design (domain?) are correct we should be able to arrange things in different topologies as we grow.

Some of the other things that commonly become issues are configuration, provisioning/defining environments, tenancy and maybe some others. Some aspects of the “12 factor app” are orthogonal here. I’m not talking about logging, etc.
