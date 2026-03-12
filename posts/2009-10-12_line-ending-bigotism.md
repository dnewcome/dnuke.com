---
title: "Line-ending bigotism"
date: 2009-10-12T18:05:54-05:00
url: https://newcome.wordpress.com/2009/10/12/line-ending-bigotism/
id: 478
categories: Uncategorized
tags: 
---

# Line-ending bigotism

**UPDATE: I’ve added a post that addresses the cause of my issues [here](https://newcome.wordpress.com/2009/12/19/git-newline-handling-between-platforms/).**

I was adding a new file to one of my git repositories and was confronted with an error on trying to commit the file:

> C:\>git commit -m “adding README”

warning: LF will be replaced by CRLF in README

*

* You have some suspicious patch lines:

*

* In README

* unresolved merge conflict (line 17)

README:17:========

* unresolved merge conflict (line 19)

README:19:========

* unresolved merge conflict (line 34)

…..

Reading up a little bit on the way git handles line endings, I turned up this gem in the [man page](http://kernel.org/pub/software/scm/git/docs/git-config.html) of git-config:

> 
core.autocrlf If true, makes git convert CRLF at the end of lines in text files to LF when reading from the filesystem, and convert in reverse when writing to the filesystem. The variable can be set to *input*, in which case the conversion happens only while reading from the filesystem but files are written out with LF at the end of lines. Currently, which paths to consider “text” (i.e. be subjected to the autocrlf mechanism) is decided purely based on the contents.
 
 core.safecrlf 
If true, makes git check if converting CRLF as controlled by core.autocrlf is reversible. Git will verify if a command modifies a file in the work tree either directly or indirectly. For example, committing a file followed by checking out the same file should yield the original file in the work tree. If this is not the case for the current setting of core.autocrlf, git will reject the file. The variable can be set to “warn”, in which case git will only warn about an irreversible conversion but continue the operation.

CRLF conversion bears a slight chance of corrupting data. autocrlf=true will convert CRLF to LF during commit and LF to CRLF during checkout. A file that contains a mixture of LF and CRLF before the commit cannot be recreated by git. For text files this is the right thing to do: it corrects line endings such that we have only LF line endings in the repository. But for binary files that are accidentally classified as text the conversion can corrupt data.

If you recognize such corruption early you can easily fix it by setting the conversion type explicitly in .gitattributes. Right after committing you still have the original file in your work tree and this file is not yet corrupted. You can explicitly tell git that this file is binary and git will handle the file appropriately.

Unfortunately, the desired effect of cleaning up text files with mixed line endings and the undesired effect of corrupting binary files cannot be distinguished. In both cases CRLFs are removed in an irreversible way. For text files this is the right thing to do because CRLFs are line endings, while for binary files converting CRLFs corrupts data.

Note, this safety check does not mean that a checkout will generate a file identical to the original file for a different setting of core.autocrlf, but only for the current one. For example, a text file with LF would be accepted with core.autocrlf=input and could later be checked out with core.autocrlf=true, in which case the resulting file would contain CRLF, although the original file contained LF. However, in both work trees the line endings would be consistent, that is either all LF or all CRLF, but never mixed. A file with mixed line endings would be reported by the core.safecrlf mechanism.

Since when has it been the domain of a version control system to actually change a file’s contents when it is checked in or out?  I know that Linus is quite opinionated when it comes to the Right Way of handling line endings, but this is absurd.  I don’t want my version control system to touch that at all.  I’m a big boy, and I can figure out how to get my tools and editor to play nice with the appropriate line endings for my system. What I don’t need is the introduction of a possible source of confounding errors that typically take forever to track down.  Line endings can be akin to trying to figure out why a multi-line shell script isn’t running properly, when the problem is that there is some extra whitespace after one of the line continuation characters.  All hell would break loose if the version control system took it upon itself to adjust whitespace in your files!

I suppose that this is all a non-issue if you run things on Linux as Linus intends you to.
