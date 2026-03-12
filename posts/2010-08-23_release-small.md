---
title: "Release small"
date: 2010-08-23T12:11:07-05:00
url: https://newcome.wordpress.com/2010/08/23/release-small/
id: 1082
categories: Uncategorized
tags: 
---

# Release small

I just read a [post](http://tom.preston-werner.com/2010/08/23/readme-driven-development.html) by Tom Preston-Werner entitled ‘Readme-Driven Development’. This reminds me of some thoughts that I wanted to blog about. 

I’ve had a few projects that I thought would be pretty simple to do but turned out to be a little more complicated than expected. Rather than hunker down and churn through the whole hairy problem in one swipe I started to compartmentalize some tricky parts. I realize that this is no different than just doing good modular software design, but the difference is that I [released the code](http://github.com/dnewcome/js-xml-serializer) on its own and documented its API separately from the main project. The module is very small but it represents a major design decision and wrapping it up with its own readme helped to solidify the design of the overall project in my head.

Thinking a bit further, this seems like it would have advantages when proposing alternate solutions or evangelizing a certain technique used within a project in a team environment also.

Thoughts?
