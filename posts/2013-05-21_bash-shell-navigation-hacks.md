---
title: "BASH  shell navigation hacks"
date: 2013-05-21T13:35:49-08:00
url: https://newcome.wordpress.com/2013/05/21/bash-shell-navigation-hacks/
id: 2305
categories: Uncategorized
tags: 
---

# BASH  shell navigation hacks

I love the shell for the most part. Modern systems ship with the fantastic (for the most part) BASH shell, which includes tab completion, sophisticated line editing modes and many nice usability features (try using a shell without history or line editing support and see what a difference this makes).

There are still some places where the shell falls down in my opinion though ([ahem](https://newcome.wordpress.com/2012/03/06/functional-programming-and-the-death-of-the-unix-way/)), but it mostly has to do with just getting around the filesystem. I started writing some tools like g (go), url (open urls), and r (recent). I had an ugly tool for Windows that I called shelper (shell helper?) that I used to set up environment variables for Visual Studio and the C++ compiler (cl.exe) among other things.

These tools occupy an uncanny valley between simple configuration and actual applications/utilities. I’m never sure if these things belong in my dotfiles or if I should maintain them as projects. One also gets the distinct feeling of reinventing the wheel or just plain ignorance that you are just reimplementing something that already exists in your shell but you just don’t know what to even search in the docs.

Then the floodgates opened. I saw the [j (jump?)](http://charlesleifer.com/blog/-j-for-switching-directories---improving-the-cd-command-/) command for fast directory switching. Which led me to [fasd](https://github.com/clvv/fasd) and then [z.](https://github.com/rupa/z)

I’m not sure what the granddaddy of all these commands is (pushd/popd maybe?) but they all have some similarities.

Going back to my own set of hacks, I don’t know if it’s better to just keep using my own stuff or try to convert to, say, fasd.

Recently I’ve been writing some blog posts with Jekyll, so I have directories of long files that have dates prepended to them. It’s tedious to do built-in BASH completion on these files, and I never got [tab cycling](http://superuser.com/questions/59175/is-there-a-way-to-make-bash-more-tab-friendly) to work in BASH for some reason (and I’m not convinced that this is really what I want anyway). So I thought why not reference files by number? I’m sure that one of these fasd clones will do this, but I have no idea which one.

So of course, I wrote a shell script to do it anyway. I give you *lsn*:

```

# lsn lets you select a file by number on the shell

if [[ $# == 1 ]]
then
	# print the file with number n
	ls | sed -n $1p
else
	# list files with numbers starting at 1
	ls | cat -n
fi

```
That lets me do something like this:

```

$ ./lsn
 1	2012-07-21-nanopad-teardown.markdown
 2	2012-07-30-iph-midi-looper.markdown
 3	2013-02-08-unboxing-the-keith-mcmillen-softstep.markdown
 4	2013-05-21-gridlok-drum-sampler-for-ipad-review.markdown
 5	lsn
$ vi `./lsn 4`

```
It’s questionable whether the backtick notation is more painful than copying the filename or muddling through tab completion though. Of course I could have a command called *vin*, or maybe have *lsn* take a the command as an argument. 

Although this all seems incredibly lame, it serves to concretely describe a small bit of friction I encounter, to enumerate some others’ solutions (that I seem to forget or be unable to find again) and because I’ll probably misplace *lsn* at some point in the future or forget it even exists and this is the only way I’ll find it again (unless it gets bigger and I put it on github). One hack at a time (one hack in front of the other?). Or something.
