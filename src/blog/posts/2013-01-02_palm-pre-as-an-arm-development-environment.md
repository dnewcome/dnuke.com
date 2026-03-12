---
title: "Palm Pre as an ARM development environment"
date: 2013-01-02T19:57:50-08:00
---

# Palm Pre as an ARM development environment

As I play around with my Raspberry PI, I keep having these flashbacks to the days when I first put my Palm Pre into developer mode. I logged into the phone as root and it was a Linux box!

That was a bit of a revelation to me then. I went ahead and installed GCC and friends and felt smug that I was walking around with a full ARM compiler toolchain in my pocket!

I never did much with that environment (besides use it as a phone of course) but along the way I saw some coding challenges that focused on using mobile devices as development platforms.

I dug my old Pre out of the drawer and plugged it in to pull it out of its deep sleep. I installed novacom and tried to remember the commands to get a terminal connected. My goal was to enable WiFi and just leave it plugged in and on my local network.

There are a few things needed to use the Pre as a general purpose ARM board.

[Install Novacom](http://rootzwiki.com/topic/29769-cant-download-novacom-any-mirrors/) to get a shell over USB:

```

c:\> novacom -t open tty://

```
Remount the file system read-write

```

mount -o rw,remount /

```
Install [dropbear sshd](http://www.webos-internals.org/wiki/Dropbear_Install). And enable WiFi on the phone. I just used the normal Palm UI for this part.

I already had the phone in developer mode and I already had the ipkg package manager installed. I won’t go into that here though, you’ll have to look around for information on getting up to the point where this post will help you.

Now, the Pre doesn’t have any GPIO ports or anything like that, so I’m not sure what to do with it besides maybe run a node.js service that I can ping from the Raspberry PI. Or maybe the Palm will work as a WiFi router attached to the PI’s USB port?
