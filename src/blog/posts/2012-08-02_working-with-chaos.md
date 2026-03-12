---
title: "Working with chaos"
date: 2012-08-02T01:26:47-08:00
---

# Working with chaos

I was intrigued by Netflix’s recent open source release of the [Chaos Monkey](http://techblog.netflix.com/2012/07/chaos-monkey-released-into-wild.html) service. I hear stories of continuous deployment scenarios at companies like Amazon that are able to effectively detect and roll back bad code changes automatically, but a system that intentionally sabotages part of the infrastructure just seems outright crazy.

I’ve long been a proponent of fuzz testing and worst-case-scenario tests during development. These practices help catch bugs in error handling of things like file system corruption, bad input and network interruptions. However, this type of testing requires some level of discipline to actually write test harnesses that inject the proper kinds of faults into the system to produce the desired failure scenario. Sure, QA can do this kind of stuff too, but I think there is a gray area of test cases that developers tend not to think of (or even subconsciously avoid), and most QAs don’t have the insight into the code to come up with either.

Enter chaos.

Chaos Monkey probably doesn’t do anything that a good QA team couldn’t do to hell-test a software system. But, knowing that the Monkey is out there is likely to have an influence on the way developers think about their code.

During the recent power outages in India, I read an [article in the New York Times](http://www.nytimes.com/2012/08/01/world/asia/power-outages-hit-600-million-in-india.html?smid=tw-share) about the impact that the outage had. While certainly devastating to the country, the power grid there is expected to have many small failures, even daily. This has caused many to route around those failures using backup generators or other ways of mitigating the problem.

Contrast this to a nation like the United States. I’ve seen much more localized power outages affecting orders of magnitudes fewer people cause massive amounts of disruption. It’s hard to imagine what would happen if a third of the US population lost power.

Thinking about Chaos Monkey in this context, it starts to make a little more sense. Which is worse? Small, contained outages that have relatively small effects or a massive outage that impacts the entire system? When we’re working at Web scale there’s no such thing as 100% uptime. Could intentional failure injection improve uptime? Netflix thinks so. When debugging and testing, one of my favorite mantras is “make it fail”. Maybe this applies to robust production infrastructure as well.
