---
title: "Javascript minimization"
date: 2010-09-07T07:33:00-05:00
---

# Javascript minimization

I recently had to cram nearly 3k of Javascript code down into 1024 bytes for submission to the [js1k ](http://js1k.com/home)competition. Initially I didn’t think that I’d get there, but I did. Once I stripped out all comments and log statements I still had over 2k of code. Here are a few things that helped me out:

**1) Run your code through Douglas Crockford’s [JSMin](http://www.crockford.com/javascript/jsmin.html) first and see how far you have to go.** JSMin is not particularly aggressive, but it is fairly strict and shouldn’t break your code. I kept this tool at the ready to run as I progressed to see how my changes affected the output size. The first run got me to about 1.5k, so I knew I was getting into the ballpark of feasibility. I still had nearly half a kilobyte to go though.

**2) Inline functions that are only called once.** Getting rid of the word ‘function’ and the associated braces saves 10 characters, and at the call site we save another 3 at least, assuming a single-character function name. Worst-case scenario is having several arguments, in which case we pay the tax twice since the argument list is potentially copied twice in the code, once at the call site and once in the function definition.

**3) Remove unused branches.** This seems obvious, but in many cases I’m reusing code that I have written for other projects, and it isn’t always evident that there is unused code in the form of an ‘else’ statement that is never reached. For a 1k compo, it is worth it to comment out variables and statements to make sure they have the effect that you think they do. I didn’t even have to run the code in most cases. Just thinking about getting rid of a line was enough to get me to think through whether it was necessary.

**4) Shorten variable names and member accessors.** Library functions like document.getElementById can be shortened considerably by creating a new alias like ‘gid’ for example. User-defined functions and variable names can be shortened to single characters.

**5) Create global variables.** Sometimes this means just getting rid of the ‘var’ keyword when you know that your names won’t conflict or just reusing a variable name. In larger programs this is a recipe for disaster, but in a smaller program it isn’t so bad. Also, there is the case where we look something up in each function, a DOM element perhaps, and it makes sense to move it to the top of the code and make it a global with a short name.

**6) Remove local variables.** This is an obvious one. Local variables are typically introduced for readability’s sake, so jockeying several expressions into a larger, more complex expression can save a lot of space.

Wrapping things up, I’ll mention that extremely aggressive minimization is kind of like running a source-to-source optimizing compiler against your code. Once you have run out of tricks like removing all whitespace and shortening and aliasing variable names, the only real way to make gains is to write less code to accomplish the task, which means assuming the role of the compiler’s optimizer, looking for shortcuts and ways to avoid including redundant instructions in the output.
