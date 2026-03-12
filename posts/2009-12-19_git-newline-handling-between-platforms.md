---
title: "Git newline handling between platforms"
date: 2009-12-19T14:58:18-05:00
url: https://newcome.wordpress.com/2009/12/19/git-newline-handling-between-platforms/
id: 602
categories: Uncategorized
tags: 
---

# Git newline handling between platforms

Previously, I had [written/complained](https://newcome.wordpress.com/2009/10/12/line-ending-bigotism/) about the way that the [Git version control system](http://git-scm.com/) handled newline characters. I wanted to update that with some new information here. The cause of my frustration back then was that I hadn’t created my working copy correctly. I had been under the assumption that since each Git repository is a standalone repository that I could just copy the whole thing around my network using a simple file copy. You can do it that way, but there is a catch: if there are files in the working directory, ie, there are files `checked out’, you will have issues copying files between systems. Note that having files checked out on a `central’ repository, ie one that you want to `push’ changes to, can also cause lots of problems. In general, although Git is a distributed system, and each repository is technically a `peer’, in practice certain repositories should not have their own working directories.

I had been using [Mercurial](http://mercurial.selenic.com/) in a quick and dirty way, where I would make a copy of the whole repository quickly using a simple file copy before working on a project. Now that I’m using Git, I simply settled into that old (bad) habit of copying stuff around and ran into the newline issue when trying to commit files that had been checked out on a Linux system, copied along with the repository to a Windows box, and modified.

The correct way of handling the situation is to make sure that all changes are committed to the remote repository, and then create the local repository using `git clone’. When using Git on Windows via the [msysgit](http://code.google.com/p/msysgit/) port, you can use [UNC paths](http://compnetworking.about.com/od/windowsnetworking/g/unc-name.htm). Thus, there is not really much of an excuse to rely on file copy when you can do:

C:\>git clone //myserver/repos/foo.git

Note that all backslashes are written as forward slashes according to [Posix](http://en.wikipedia.org/wiki/POSIX) convention rather than Windows.

I still don’t like the fact that Git insists on translating newline conventions when working between platforms, but I’ve read that Git places a high priority on data consistency and safeguarding against corruption, so I guess I’ll just be reassured that a lot of people that are smarter than me are looking out on this one.

For more information about how Git handles newlines, [this page](http://help.github.com/dealing-with-lineendings/) on [GitHub](http://help.github.com/dealing-with-lineendings/) is a good start.
