---
title: "On dependency management"
date: 2012-07-02T15:42:25-08:00
---

# On dependency management

Like many (all?) developers, I have a list of thoughts and gripes about managing and developing libraries while working on a coding project. The experience that prompted me to finally start writing this post was trying to get the Selenium WebDriver Java libraries installed and ready to use on my system.

I think I could have downloaded a giant tarball of everything, but I really wanted to just use Maven or some automatic dependency management tool. Initially I was using Clojure, but I realized that the Clojure wrapper library didn’t fully support some things I needed, so I figured I’d dive down and just do the thing in Java. Why do I mention this? Well, I suppose the Clojure guys have things pretty well under control, as grabbing the dependencies from Clojars using Lein seemed to work just fine. Lein uses Maven under the hood, so I figured I’d be good to go.

Figuring out how a Maven POM file is supposed to go is its own level of pain when all you want to do is have your dependencies and classpath set up for you. I still didn’t really figure out how this was supposed to work as I went on to try Ivy, which is a tool that lets you use Maven repositories from Ant build scripts, which I’m more familiar with.

Installing Ivy went pretty well, but when I got it to pull down the dependencies I realized that Selenium relies on a version of Jetty that was hosted by JBoss, who apparently no longer hosts the Jetty project. So now the dependency resolution process is broken. I’m not sure how to re-point this dependency since the process is kind of opaque, but I figure that I can get Ivy to resolve this locally from my Maven cache if I add it manually. Once added, Ivy still won’t pick it up since Ivy uses its own private cache. After a little more research I figured out that you need to install the dependency in the Ivy local repository rather than the cache. At this point I’m wondering why Ivy needs its own cache separate from the .m2 Maven folder. 

Rather than answer this question, I pretty much threw out the idea of using Java at all for this task. It’s just too much hassle.

This experience got me thinking about package managers and dependency resolution. There are some inherent difficulties in getting this stuff right, but I’m wondering if a fully pedantic approach as is taken by Maven is really appropriate.

### Strict vs. loose

I think at the very lowest level, a dependency management system should be able to pull down a library and its dependencies directly with a single command. Node’s NPM does this right as well as Rubygems etc. It’s not clear to me whether Maven can do this at all, or if it can it might need some kind of special boilerplate POM file in order to do it. The idea is, when working on a project, sometimes there comes a time when “hey we need to add a logging framework now”. We aren’t trying to maintain some kind of solid build or backward compatibility. We don’t need ironclad versioning at the top level. However, I do expect to get a working library with all of its exact dependencies included. In many cases a common library will include dozens of other libraries. If any one of these libraries is not available from the package management system, the toplevel dependency request will fail.

I feel like this is too much to ask of any system that relies on third parties publishing code. The lowest common denominator is a tarball release from a vendor that has a working binary version of the library. The dependency management tool should be able to deal with this case, or any case that would be supported by the language/environment. Also, If I’m relying on a particular version of something, I want to have my own local repository set up possibly. This is almost always possible, but varies greatly in difficulty between different dependency management tools.

### Progressive enhancement

On the subject of local repositories, I think that most environments make code modularity much too difficult in practice. Java and C# tend to encourage an up-front proliferation of libraries and namespaces. If pulling code out into libraries was easier, it wouldn’t be necessary to make this up-front decision so quickly.

My feeling is that NuGet is a step in the right direction, although I think they are way off base with some things. The ability to set up a plain old folder as a repository is gold. The bootstrapper thing is kind of silly as you’d expect that the tool shouldn’t get so huge that it needs a bootstrapper and that if you wanted to update your version, the normal tool could handle that just fine. I tried to get NuGet working under Mono, and it doesn’t work. It boggles my mind that NuGet needs to use something so cutting-edge that the latest Mono drop can’t run it.

### Wish list

Anything can be a package

Repositories can be just folders

Repositories don’t have to be just folders

Projects can be defined inline

Dependencies can be redirected simply

I actually thing that git could provide a really awesome back end for a dependency management tool and could satisfy many of the above wishes very easily.

Hopefully I’ll dig into this a little bit more soon.
