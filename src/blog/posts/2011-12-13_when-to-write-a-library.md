---
title: "When to write a library"
date: 2011-12-13T22:30:39-08:00
---

# When to write a library

I’ve been meaning to write this post for a while. There have been a lot of instances in my work where the debate comes up about when to start abstracting code. There inevitably comes a time where a bit of code gets copied and tweaked enough times that it screams out to be put into a common library. However it has been my experience that programmers are still reluctant to take on the task of creating a common code base. Actually I’ve also noticed that many times programmers think that “code reuse” means just copying some of the files out of a previous project when starting a new one.

Some of these quick and dirty techniques are expedient initially, but we need to move past them to make any real progress on the problems that we work on. In my experience, creating modular code allows the code to be reasoned about more easily.

However, there are some downsides to creating libraries. It takes a non-trivial amount of work to create and maintain a piece of shared code. Once a piece of code is used in many places, it becomes nearly impossible to test the code without dedicated tests that cover all intended use cases. This means that even if the code is already written as a de facto library, lots of supporting code needs to be written in order to make the library maintainable.

Existing client code needs to be re-factored to use the new library going forward. This step is not totally necessary, as many times older code bases can be maintained as legacy code bases separately and only upgraded if other changes are necessary later on.

So this leads us to the question, when does it make sense to write a library? I’d say that when the pain of not having the code centrally located becomes significant. In the past I was a purist and I would have created some library right away, but I think that it takes some time to even figure out what the API should be so I think it makes sense now to intentionally experience some pain of having maybe three or four different versions of the code before consolidating the code. 

Unfortunately, I think some languages make the unit of code deployment too large and cumbersome. In the .NET framework I’d argue that the Assembly is too cumbersome for many things. There are many times where I want a single interface to be independent and available separately but I would have to put it in its own assembly in order to reference it separately. It’s easy to fall into DLL hell with tens or even hundreds of assemblies. Each assembly carries the overhead of a separate build file or Visual Studio project file. I think there needs to be a lighter weight way of sharing code in .NET. 

This post rambled on a bit, but I’m getting started on a series of posts on software engineering, so I wanted to kick things off with some problems that I have faced in the past, of which this is one of the most difficult.
