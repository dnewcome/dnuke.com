---
title: "Refactoring, performance and programming languages"
date: 2011-03-28T19:23:30-08:00
url: https://newcome.wordpress.com/2011/03/28/refactoring-performance-and-programming-languages/
id: 1375
categories: Uncategorized
tags: 
---

# Refactoring, performance and programming languages

I read a [post on James Gosling’s blog](http://nighthacks.com/roller/jag/entry/refactoring_considered_harmful_sometimes) today where he detailed an example of refactoring a bit of code to improve its performance. On first sight I didn’t agree with this as refactoring (seems more like a “de-factoring”), but according to the strict definition it counts as refactoring.

Here is his example:

```

for(....) {
 ...
 if(b) A;
 else B;
 ....
}

```
He pulls the check for “b” outside of the loop as a performance optimization.

```

if(b)
 for(...) {
 ...
 A;
 ...
 } else
 for(...) {
 ...
 B;
 ...
 }

```
A more common case where refactoring may improve performance is avoiding a member lookup on an object. However, In cases like this usually the code gets easier to follow rather than more difficult. For example:

```

for( ... ) {
 if( foo.bar > 0 ) {
 doSomething();
 }
}

```
```

int mycount = foo.bar;
for( ... ) {
 if( mycount > 0 ) {
 doSomething();
 }
}

```
We introduce an extra line of code but having a descriptive variable name can actually make the code easier to understand, and it makes the rest of the code slightly more concise.

James does not argue that his refactoring is good in any way other than performance. In fact, in his post he describes the code explosion that can result from just several such performance refactorings.

I think that perhaps this could be thought of as a language problem. For any solution that is not overtly more complicated than it needs to be, the optimization should be handled in the compiler or runtime of the language. Since b doesn’t change inside of the loop, the compiler should be able to optimize it.

I’ll go further even by saying that using a different programming paradigm could solve this as well. In the case of functional programming, we might be able to write it as:

```

func func;
if(b) func = A;
else func = B;

for(....) {
 func()
}

```
Of course, now we have the overhead of a function call, but compilers are usually very aggressive about inlining this type of thing. Granted, the above is pseudocode, and we are talking about some hypothetical language, but I thought it was interesting to think about.

When writing code, the ideal is to express the program in an unambiguously correct form that is understandable as such by simple transformations. When code is written in a style that is idiomatic for the language, I think that performance (of this type at least) is mostly the domain of the language. Of course, in the real world, often the programming environment is full of leaky abstractions. I have more thoughts on how choice of language affects the balance of performance and readability/understandability so there should be a few more posts forthcoming from me in the next few weeks.
