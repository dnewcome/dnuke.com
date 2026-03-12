---
title: "Micro thing-uses"
date: 2019-03-26T14:38:18-08:00
---

# Micro thing-uses

Hello friends. I’m still writing code every day, believe it or not. I’m back in startup land. Away from big tech land mostly. Seeing both sides of the coin has been helping me have some insights I didn’t have before on the open-source adoption of technologies that trickle down from big organizations.

In the past I have mostly held the position that Your’e Not Gonna Need It with most things involving scale or performance, or (insert x thingy). Big companies need to deal with multiple facets of scale that you don’t need when your entire engineering department fits at one desk pod.

However, there are some success stories around the adoption of some technologies and some failures. I’m not sure yet if I can draw conclusions yet on what tips the scales one way or another. I think the elephant in the room right now is microservices. Leading up to microservices was containerization.

What are the technologies? Docker. Kubernetes. Lambda. Graphql. Apollo.

These don’t seem like they have that much in common but they are all attempts at granularization of the solution space in some way.

The monolithic app has been derided since I started in the software industry. My entire career we have been splitting things into libraries, creating dependencies and fighting the ugly monolith. He’s an easy enemy. A strawman. Kill the monolith!

Companies like Microsoft, Google and Facebook have been  known to keep all their code in one big repository. A monolith? Not necessarily but in some cases yes. Death to the monolith, long live the monrepo?

The distinction between units of code reuse and units of deployment is still something that confuses the issue. Remember n-tier apps? Of course we will handle x in the n tier. In reality there was one server with all the tiers on it. Was the database a tier? How many cycles of splitting and joining database schemas did the app go through?

It was an imperfect abstraction at best. What is a tier?

Now I ask, “what is a service”? What makes a service “micro”?

This post is not for answering questions but for asking them.

When we wrote .NET remoting objects, were those microservices? Why was DCOM so hated? Were they microservices? Remember registries for COM components – service locators in Java? Is this the old new thing, microservices?

Two ideas in computer science that have endured like viruses are functional programming and the UNIX philosophy. Why are these good ideas? Maybe they are bad ideas but somehow they keep popping up like bad pennies. Functional means never having to remember that you said you were sorry. UNIX means dance to your own drum beat, but only one.

Are UNIX commands proto-microservices? Is Bash the proto-orchestration framework? We are giving way too much credit to the shell here. It was UNIX pipes that was the stroke of genius. Does UNIX have side effects? Does it ever. However it’s interesting that there are some general patterns that hold. Standard I/O, return codes, and file handles cover almost everything. Pipes are special files. Sockets can be as well. So two basic subsystems cover almost everything in UNIX.

This brings us back to making some generalizations about service models. Why didn’t CORBA deliver on its promises? .NET remoting? I’m going to put out a strawman here and say – state and side effects.

Sounds like a familiar refrain. Functional programming vilifies these two things as its raison dêtre. What if, rather than fighting state and side effects, we use these as the very definition of a service? Monads are designed to encapsulate state. Could the same be said of a microservice? What about side effects? Any time in a system that there is a state boundary, is that a microservice? What about a specific side effect?

I was going to philosophize on containers and connectivity here too, but I think I’ll save it for next time.
