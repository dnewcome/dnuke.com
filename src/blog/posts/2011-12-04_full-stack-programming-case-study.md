---
title: "Full-stack programming case study"
date: 2011-12-04T22:51:04-08:00
---

# Full-stack programming case study

There has been a lot of talk about “full-stack” programmers in the tech press recently. Along with the concept of “devops” this is an important distinction to make between pure coders and people who are capable of systems thinking. Generally speaking, in addition to a deep understanding of their core programming skills, they understand other parts of the IT stack like hardware, networking and operations.

I’m going to recount a story from a previous job I had where I was a programmer. We had a network team that was proficient in maintaining the existing network, but as the data center grew, things started to get unmanageable. The team argued about how to extend the network from the current single-subnet design to a multi-subnet network implemented with vlan-capable switches. 

After many meetings and delays the network team had finally procured new equipment and thrown the stuff into the racks in the data center. However, no real thought had been given to how the migration would take place. Everyone was afraid to unplug anything and the data center couldn’t be down for more than a few hours, so any cut over would have to be prepared well in advance.

The network team wasn’t making any progress on the problem, so the CTO came to me to figure out if there was some solution to the migration problem. I’ve designed some pretty big networks in the past and I’ve dealt with some seriously big datacenter iron, so I figured that this network wouldn’t be too complex.

Since I had done some low level network programming in the past, I knew how multiple subnets could be subsumed in a larger subnet, and that asymmetrical routes could be created even though it is not a best practice to do so. The solution that I came up with would allow each machine on the network to be moved one at a time by setting up some asymmetric routes ahead of time. Once the routes were in place, machines could be moved without any of the other clients on the network noticing that they were actually on a new network. This allowed the network team to spread the migration out over several days without any outage at all. Once all machines were moved, the temporary routes were removed and everything was in order with networking best practices.

I found a diagram that I created for this project and redacted the IP addresses so that you can see the full solution. 

![\1](/images/2011-12-04_full-stack-programming-case-study_asym-network-redacted.png)
