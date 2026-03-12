---
title: "Separating syntax and semantics"
date: 2009-12-17T14:56:20-05:00
url: https://newcome.wordpress.com/2009/12/17/separating-syntax-and-semantics/
id: 594
categories: Uncategorized
tags: 
---

# Separating syntax and semantics

I’ve been a fan of so-called `curly-brace’ languages for most of my programming career. I’ve gone from C to C++ to C# and Java. Somewhere along the way I fell in love with Javascript.  I’ve dabbled a bit with languages like Perl and certainly done a fair bit of Posix shell scripting, although I never really approached it with the same rigor as my efforts in their C-style brethren.

Learning Javascript gave me my first real glimpse at what programming in a dynamic language was all about. It was a whole different beast from my C-like language experience, but it was disguised as a curly-brace language. Well, by definition it *is* a curly-brace language, but it doesn’t act like your typical uptight old-school C-style language.

Once I made the progression to using Javascript more, I began to explore the new language features in C# that offered a more dynamic way of programming. I could do lambda functions using anonymous methods and I thought that life was pretty good — very `dynamic’, you could say.

However, the natives were growing restless, and there were rumors of some new and attractive languages in town, namely Ruby and Python.  I had written off both as non curly-brace languages when I first looked into them a while back, but somehow they kept creeping back into my peripheral vision.

Finally, I dug into Ruby.

At first I bristled at having to terminate my statement blocks with ‘end’. Very Visual Basic-like I thought. There was the possibility of using braces, but in Ruby using braces *means* something completely distinct from using ‘begin .. end’ to define a block.  It is differences like this that begin to show the chinks in your armor of understanding. At first you can brush it off, much in the way I brushed off the difference between explicit memory management in C vs. automatic garbage collection in C#. Or arrays as pointers in C vs. arrays as objects in Java. Doing OO programming in Javascript required me to gloss over things a little bit more, but since it was a curly-brace language, I still tried to think of the differences as more of a mechanical (syntactic) nature than fundamental. This manner of thinking came to a screeching halt with Ruby.

For whatever reason, the difference in syntax was enough to force me to think about the fundamental *meaning* behind what I was writing in code. More specifically, meaning in a sense that was abstract from the language itself, since the language was foreign but the underlying concepts were familiar.  Previously I would be tempted to map the concept one-to-one with C# or Java, but the difference in syntax forced me to think a little extra.

Ideally, the syntax should become transparent. I haven’t reached this point yet though, except maybe in C#. The problem is that my knowledge of C# is heavily entangled with my knowledge of the .NET platform, so in essence, the very definition of mixing syntax and semantics. One of the main goals I have with learning languages such as Ruby and Lisp is to break the cognitive habits that build up over time in dealing with a single class of language in most of your work.
