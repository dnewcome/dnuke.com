---
title: "Microsoft takes a page from the book of Emacs"
date: 2008-11-02T13:46:49-05:00
---

# Microsoft takes a page from the book of Emacs

I recently downloaded the Microsoft [Oslo SDK](http://code.msdn.microsoft.com/oslo) in order to check out where MS is heading in the world of domain specific languages.  Before I really even dug into the M compiler or any of the other actual bits of the Oslo technology, I saw something in the installation called Intellipad.  I fired it up and was presented with a simple editor like notepad, but looking like it was actually from this decade rather than stuck in the early nineties.

The main differences from notepad seem to be that the open documents were in `buffers’ ala Emacs, and you could split the view up horizontally or vertically.  I never really use the split functionality in any of the other editors that I have, so this wasn’t really that interesting to me.  The question I still had in my mind was, why on earth would Microsoft ship a simple text editor in an SDK that is purportedly for developing domain specific languages?  Fortunately there is a small document in the SDK installation that gives you an overview.  It turns out that the reason for its apparent simplicity is that it is intended to be easily extensible.  Imagine that, a MS tool that is designed to be hackable.

I haven’t tried to extend it yet, but it looks like there are several ways to get it done.  You can write a module using any .net language and plug it in, or you can actually script it in python.  I’ll be sure to post something once I’ve gotten a chance to do some hacking on this.

![\1](/images/2008-11-02_microsoft-takes-a-page-from-the-book-of-emacs_intellipad.png)
