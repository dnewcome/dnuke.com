---
title: "Distributed issue tracking"
date: 2010-05-29T14:44:30-05:00
---

# Distributed issue tracking

I was checking out one of [Zed Shaw’s](http://www.zedshaw.com/) latest projects, [MulletDB](http://mulletdb.com/index) when I realized that the project used [Fossil](http://fossil-scm.org), a source control system that I had never heard of before.

As I checked around the Fossil site, I realized that this is just what I needed for a lot of my projects. I want to keep the development notes and track issues right with the project itself. This means that you have to have some kind of bug tracker or wiki set up so that it can be run from the working folder, and the database must be checked into version control. This possibly means that in order to commit changes to the bug tracker you might have to stop the server, which would be just one more step in the check-in dance.

I’m sure that Fossil is a nice SCM, and having been developed by the creator of Sqlite, it probably is a very thoughtfully designed piece of software. However, I’ve become invested in git, and with Github being the SCM hosting provider of choice I’d really like to see something like this that uses the git repository format on the back end so that everything can be distributed and versioned using git. Even better would be if Github would update its own issue tracker when you pushed issues using git.

– Update: I just found [TicGit](http://wiki.github.com/schacon/ticgit/), which stores all of its data in a special branch of your existing git repository. [Bugs Everywhere](http://) is another interesting project, although I don’t think it uses git.
