---
title: "Inner sourcing to open sourcing"
date: 2013-03-19T12:25:34-08:00
url: https://newcome.wordpress.com/2013/03/19/inner-sourcing-to-open-sourcing/
id: 2195
categories: Uncategorized
tags: 
---

# Inner sourcing to open sourcing

![](images/2013-03-19_inner-sourcing-to-open-sourcing_200px-Free_Software_and_Open_Source_Software_Composite_Logo.svg.png)
Ahmet Alp Balkan wrote an interesting piece on what you should open source at your company recently. I like his assertion that anything you’d likely need at another job should be open sourced. Some other influential programmers have [asserted more aggressive stances](http://tom.preston-werner.com/2011/11/22/open-source-everything.html) on this, but I think Ahmet’s idea is a good start. You should [check his article](http://ahmetalpbalkan.com/blog/what-should-you-open-source-in-your-company/) out now if you haven’t seen it already.

Many of my experiences with open sourcing code that isn’t purely a personal project have followed a trajectory of internal release and eventual open sourcing. I think even trying to decide whether or not some code is critical to your particular business is jumping the gun. I really took to (Github founder) Tom Preston-Werner’s [readme-driven development](http://tom.preston-werner.com/2010/08/23/readme-driven-development.html) treatise for these releases. If something was a concrete enough idea to put together a concise readme document, the project should be pulled out into something for internal release, even if it was only used on the current project initially.

I called this “inner sourcing” the project. I’ve since seen some [other references](http://opensourcedelivers.com/2012/08/29/inner-sourcing-adopting-open-source-development-processes-in-corporate-it/) to inner sourcing code so it seems I’m not the only one that thinks this way.

The process generally involved creating a module within the parent project, creating the readme and sending out an internal email to the company announcing the project. In the beginning it felt kind of silly to send out these announcement emails but eventually everyone started to get the idea of announcing these little internal projects.

When I was working for a small consulting company back on the East Coast, I created a small DSL ([domain-specific language](http://en.wikipedia.org/wiki/Domain-specific_language)) for writing queries against Microsoft CRM called [CrmQuery](https://github.com/dnewcome/crmQuery). When I came up with the idea I wrapped up the project in a separate repository and created a more general build system to build for several of the runtimes in use with our various clients at the time. I wrote the readme as if I were putting it out to the world and no one had any other internal context of our environment. I think that this is an important thought exercise and improves the quality of the project even if it never makes it outside of the company.

CrmQuery ultimately saved us tons of time and got used on every CRM project we did after I released it. When I put it on GitHub later I got some more feedback on the project that improved it even more. I get people commenting on my projects and filing issues through GitHub all the time. This certainly is much more helpful than having the code just sitting in your private repository.

Ultimately I ended up getting some other consulting clients from people finding out about CrmQuery and a CRM test double service I wrote called [FakeCRM](https://github.com/dnewcome/FakeCRM). There isn’t much better of an endorsement of open source than that!
