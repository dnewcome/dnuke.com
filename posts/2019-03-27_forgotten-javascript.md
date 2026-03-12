---
title: "Forgotten Javascript"
date: 2019-03-27T00:58:07-08:00
url: https://newcome.wordpress.com/2019/03/27/forgotten-javascript/
id: 2461
categories: Uncategorized
tags: 
---

# Forgotten Javascript

Every once in a while I get reminded of some dark corner of Javascript even though I’m developing with it every day. I give a lot of JS coding interviews and every once in a while something comes up that I hadn’t anticipated in the questions that I usually ask.

Recently someone tried to solve one of my coding problems using `arguments.callee`. I hadn’t thought about this variable in a while, and I realized why once I [looked it up on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/arguments/callee?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FFunctions_and_function_scope%2Farguments%2Fcallee).

The short answer is that it doesn’t work in [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FFunctions_and_function_scope%2FStrict_mode), which of course everyone is using right?

The long answer is that you are effectively looking at the call stack, which in most languages is sketchy due to compiler optimizations (function inlining, etc). In C# I have seen some code that relied on applying the attribute `[MethodImplAttribute(MethodImplOptions.NoInlining)]` to the function to keep the compiler from inlining it.

This got me thinking about today’s highly-optimized Javascript runtimes. Surely they can do inlining when generating target code right? It turns out that yes, they can, and even better, in the case of V8 we can trace how the optimizations are applied.

I took the example I found [here](https://ariya.io/2013/04/automatic-inlining-in-javascript-engines) and ran it myself to verify that my version of V8 installed via homebrew on OSX was performing the same optimizations.
