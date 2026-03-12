---
title: "That pesky bug"
date: 2012-02-07T11:58:10-08:00
---

# That pesky bug

I want to talk for a minute about that annoying bug. That one that doesn’t crash the app but makes it do something annoying. That bug that for some reason, has some dependency on the way that the app was designed early on, so the simple fixes break something else in the app.

How did this happen? We were so careful when we designed this thing! We built things up and tested in small pieces. We continuously integrated everyone’s changes and refactored things as we went.

Well, unfortunately it is nearly impossible to optimize a program along all axes. Somewhere along the line, a decision was made, probably a correct one, that put us down this path. So now we have one axis of the program that has gotten tricky to deal with. Optimizing for this axis is going to wreak havoc on the rest of the program.

Begrudgingly, we revert the quick fix for this bug and push it down on the priority list. But hey bug man, your number is up on the next iteration!
