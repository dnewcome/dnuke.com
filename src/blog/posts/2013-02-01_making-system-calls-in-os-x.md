---
title: "Making system calls in OS X"
date: 2013-02-01T01:33:30-08:00
---

# Making system calls in OS X

I’ve been hacking away on my new Mac ever since I got it last month, and I’m slowly getting all of the native stuff I used to do under Linux moved over to my new environment.

Some of the things I’ve gotten installed so far are homebrew (needed to install just about anything that isn’t distributed directly as a disk image or precompiled binary), Xcode command line tools (needed to build many homebrew packages), rvm (ruby version manager), git (via homebrew) and many other homebrew packages.

So anyway, I’ve been working on getting some low-latency HID (keyboard) code working under Windows and I’m eventually going to try to get it working on the Mac. I’m able to make system calls on Windows pretty easily by now, but I was wondering how it worked on Mac.

There is a big list of all the system calls for OS X [here](http://www.opensource.apple.com/source/xnu/xnu-1504.3.12/bsd/kern/syscalls.master). Notice that the integer ID for EXIT is 1. 

The following code snippet calls exit() via syscall() and returns an exit code of 7:

```

#include <stdio.h>
#include <sys/syscall.h>

int main( int argc, char** argv ) {

 /* system call 1 is EXIT */
 syscall(1, 7);
 
 /* we will never get here */
 printf("arg0: %s \n", argv[0] );
 return 0;
}

```
Compile with gcc and run like this:

./a.out ; echo $?

Here we output the return code to the console so that we can see it.
