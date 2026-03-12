---
title: "Testing the Clojure way"
date: 2012-03-12T16:56:01-08:00
url: https://newcome.wordpress.com/2012/03/12/testing-the-clojure-way/
id: 1577
categories: Uncategorized
tags: 
---

# Testing the Clojure way

I’ve been through several iterations of testing fads already in my programming career. The bottom line regardless of any fads however, is that you need to test your code. Somehow, some way. Manual testing is bad, automated testing is good. 100% test coverage is impossible, and shouldn’t be a stated goal. Zero defects is silly, not all bugs are created equal and emphasis on design over testing should be preferred.

That’s a lot of philosophical rubric for one blog post, and possibly I’ll delve more into some of these things, but like most things in life, we have diminishing returns on tests, and code that is less well understood tends to be the buggiest in your codebase. It’s best to focus our efforts on where it matters, and this is what I want to talk about here.

So there is one thing that I like in my programs over all else – clarity of design. When you look at some code, there should not be more than one concern addressed by that code. In the normal course of development this can be adhered to, but there are many things that work to thwart this vision. In my mind the two biggest threats to this vision are logging and testing.

With logging we are always making the tradeoff of code readability and performance versus trace granularity when we want to figure out what things are doing at runtime. With testing, we are trading off extra design complexity for ease (even possibility) of testing.

I don’t want to rant too much here, but C# has been one of the messiest languages for me to test in my career. I suspect that Java is just the same, but I have done comparatively little work in that language so I’ll leave that for you to decide. The main problem is the mechanism of software composition. Both Java and C# have strong type systems that determine how code is organized into logical units. At runtime, these units are either assembled by inheritance or via composition. In either case, in order to conditionally change the way the code is set up at runtime requires a lot of up-front planning. The most frequently used pattern here is Dependency Injection.

I have nothing against this pattern actually, but let’s be honest with ourselves – when one of the fundamental operators, the ‘new’ operator, becomes a code smell you know the language has a serious problem that needs to be addressed. 

So, what does any of this have to do with testing?

If you have not been particularly rigorous in adhering to a dependency injection approach, it’s likely that your software will be very hard to unit test. Trying to isolate any one part of the system for a test becomes unlikely. And, since my favorite question to ask when testing anything is “what exactly are you testing?” we’ll probably have to do some refactoring before isolated testing is even possible.

In case it wasn’t obvious, the answer to my favorite question is not “the database”, or “the third party web service”. We know that code works, and if it doesn’t, it is because we didn’t pay attention to version numbers or server maintenance, or any number of other things that are not our code. Let me repeat that, these things are not our code (not what we are testing!).

Finally, I’m going to talk about Clojure. It turns out that, despite the title, this article is only peripherally related to actually testing Clojure code, but it has everything to do with the philosophy of Clojure and functional programming.

How do we do dependency injection in Clojure? Well we could explicitly pass in functions to our functions, (make use of higher order functions), or make extensive use of macros or even keep things limited to the built-in “map” function and the like. However all of these things, while not quite as bad as DI, are orthogonal goals to our design. The idea is to write the code in the clearest possible way without thinking about peripheral concerns like testing. Ideally, clear and correct code would also be the most testable code.

Ok so here is an example of what I’m talking about in Clojure. I’m going to take some code that was written to talk to an external Web service and stub out the call to the service. Ordinarily we’d have to make sure that the service was injected into the code. In C# that would look like this:

```

void ProcessExternalData( IService svc, DateTime check ) {
 if( DateTime.Now > check ) {
 svc.GetStuffSince( check );
 }
}

```
In the code snippet above, we use a service to grab some data that has occurred since some time that we specify. When we ask “what are we testing?” the answer should be, we are testing the checking logic here, not necessarily that the GetStuffSince service is doing the right thing. In our test we’d want to try:

```

ProcessExternalData( mockService, DateTime.Now );
ProcessExternalData( mockService, DateTime.Now.AddDays(-1) );
ProcessExternalData( mockService, DateTime.Now.AddDays(1) );

```
And we’d check our mock service at the end to make sure we’ve made the calls we thought we’d make.

The problem arises when the code is written like so:

```

void ProcessExternalData( DateTime check ) {
 if( DateTime.Now > check ) {
 IService svc = new Service();
 svc.GetStuffSince( check );
 }
}

```
I know that this is an oversimplification, but it illustrates the point that many times we don’t have an easy way of providing an alternative implementation of something. Now we have little choice but to call the real service or resort to really extreme measures like trying to provide an alternative dll that implements the service if it is an external reference, etc. Trying to replace something that is defined in the code under test is pretty much going to require modification to the code. It might be possible to use some conditional compilation tricks such as:

```

#if MOCKS
using Service = MockService;
#endif

```
This should redefined Service in the code under test allowing us to specify another implementation depending on some compiler definitions.

Ok so what if I told you that we could overload the C# using directive in the test to override what Service implementation we wanted to use? Here is what it would look like: (not valid C# code)

```

using( Service = MockService ) {
 ProcessExternalData( DateTime.Now );
} 

```
This would be effectively changing the C# method under test to look like this:

```

void ProcessExternalData( DateTime check ) {
 if( DateTime.Now > check ) {
 IService svc = new MockService();
 svc.GetStuffSince( check );
 }
}

```
In Clojure we can do this with a form called [“with-redefs”](http://clojuredocs.org/clojure_core/clojure.core/with-redefs). Previously we would have used Clojure dynamic bindings but as of Clojure 1.3, we would have had to pre-declare the function as a dynamic binding to make that work, which defeats the purpose that we are going for here.

In clojure this is the function under test:

```

(defn process-external-data [check] 
 (if (> (now) check) 
 (get-stuff-since)))

```
Here is how we would test it, providing an alternative implementation of the get-stuff-since function:

```

(deftest test-process-external-data
 (with-redefs [get-stuff-since stub-get-stuff-since] 
 (process-external-data))) 

```
We have effectively done exactly what I described in the hypothetical C# example – defined a scope in which any references to the inner service call has been replaced by something of our own choosing.

I’ve only started using this technique, so there may be plenty of pitfalls when doing this. It is kind of unsettling to think that any code you write might be overridden later from above without your knowing, but then that’s kind of the trade-off when going to a less static language. Also, I’m thinking that testing should be a little more black-box, and here we basically need the software equivalent of an x-ray machine to test the way something works. Something about that doesn’t seem right to me. It might come down to which is worse – knowledge of the internals of the function under test, or changing the design for enhanced testability. I have a suspicion that there is no clear answer here.

However, as always I’ll keep everyone apprised!
