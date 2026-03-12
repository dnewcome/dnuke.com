---
title: "All code is legacy code"
date: 2022-03-22T07:51:37-08:00
url: https://newcome.wordpress.com/2022/03/22/all-code-is-legacy-code/
id: 2674
categories: Uncategorized
tags: 
---

# All code is legacy code

I was doing some one-on-one meetings with some folks on my dev team and my colleague showed me an informal document that he was keeping. Sprinkled throughout were references to legacy code and proposals to move to different technologies.

I wanted to dig into some specifics but I casually mentioned that all of our code is legacy code. Code is kind of like copyright. It’s legacy once it hits the disk (“fixed form of expression”). I can’t recall exactly where I picked this up but it’s a distillation of an opinion that I’ve formed during my career working with codebases at varying levels of maturity. I’ve seen cheeky references to legacy code as “any code that works”.

I’m part-way through reading an excellent book about legacy systems entitled “Kill it with fire” [https://www.amazon.com/Kill-Fire-Manage-Computer-Systems/dp/1718501188](https://www.amazon.com/Kill-Fire-Manage-Computer-Systems/dp/1718501188)

I will have to read back and see if I can trace it back to this book. Either way you should read it (Disclaimer: I have not finished it).

Responses to my comment in the one-on-one have been trickling in from the rest of the team. Everyone seems to have interpreted it a little differently but I think that each interpretation actually embodies a facet of what I’m trying to convey. The context of my utterance was a system that we needed to keep up-to-date so it makes sense to treat the system like a flowing stream. It’s going to have some dynamics all on its own, and to make sure we can guide it we need to manage it. (Software is performance? Software development is a generative system? Too much for this post). 

Managing the entire lifecycle of code from the start means treating new code as legacy. Sounds crazy but it makes you think about your dependencies, are they well maintained? Is the code using a build system that is different than the rest of the system? What about testing plans (not the unit tests themselves – the strategy for maintaining quality over time).

The thing I didn’t expect was that it triggered a revelation in one of the other Senior Engineers that the decisions and technologies are always up for discussion. A codebase at rest can be an archaeological dig at worst and a collection of Just-So stories at best. It’s encouraging that this is getting people to ask why. I think that’s pretty amazing.
