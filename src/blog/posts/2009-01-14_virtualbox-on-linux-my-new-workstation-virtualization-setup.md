---
title: "VirtualBox on Linux: my new workstation virtualization setup"
date: 2009-01-14T13:11:55-05:00
---

# VirtualBox on Linux: my new workstation virtualization setup

I just thought that I would make a quick note on a new virtualization solution that I have been using on Linux (and why I switched from VMware server). [](http://www.virtualbox.org/)

[VirtualBox](http://www.virtualbox.org/) was created by a company called Innotek.  Sun eventually [bought the company](http://gigaom.com/2008/02/13/sun-buys-maker-of-virtualbox-virtualization-software/) and continued development of VirtualBox as a compliment to its own xVM virtualization solution.

Let me preface the following by saying that I have been a longtime user of VMware on both Windows and Linux platforms since the VMware GSX Server 3.x days.  Most of my VMs were for setting up testing or build environments.  Following the 1.0 beta release of the free VMware server product I switched completely to it from GSX Server.

Fast forward to a little over a year ago, when I wanted to consolidate all of my working environments onto my laptop, on which I run Ubuntu Linux.  I still needed a Windows environment for doing .NET development work, so I moved my development environment that was formerly on a dedicated machine over to a VMware instance on my laptop.  Following this move, I found myself spending sizable chunks of development time fully inside of a Windows VM running on VMware server for Linux, during which time I really started to notice that the VM was not nearly as responsive as the VMs I had running elsewhere on Windows Server hosts.

By running some (relatively unscientific) benchmarks I realized that CPU and memory speed seemed fine, but disk IO was abysmal.  I figured that I would be able to fix the problem by using a raw device for the VM disk, or by setting noatime on the filesystem that the .vmdk disk was on.  However, I found that no matter what I did, I couldn’t get the IO speeds up to where VMware Server for Windows was.   I could not get the responsiveness of my VMware virtual machines to be good enough to work in Visual Studio without wanting to cry every time I went to add a new library reference to the project that I was working on.

Following the frustration of not getting the performance that I was after using VMware and having committed to using virtualization for development work, I started looking around for other solutions.  I installed Xen, but I was turned off by the fact that I had to use a different kernel to use it.  My other options were KVM, qemu, and VirtualBox.  I had looked at all of these in passing before but I hadn’t evaluated them with the intent of actually deploying them as part of my workflow.  VirtualBox had just been bought by Sun and it seemed to have picked up a lot of steam, so I gave it the first shot.  I had installed an old version of VirtualBox previously and had already installed Windows under it, so in fairness I really didn’t give the others much of a chance.  I may revisit the others in time.

VirtualBox turns out to be less stable than VMware which is perhaps not surprising, given the maturity of VMware.   I have experienced some occasional crashes while performing network IO using Windows filesharing or Samba.  However, it did rings around VMware in terms of disk IO, which I think had an impact on my productivity.  I may dig up my numbers on this stuff if I have some time later, just to show some verification.  I may have sacrificed some CPU efficiency, but the user experience is definitely improved compared to my VMware VMs.

This post definitely went longer than I had anticipated.  Hopefully this helps someone out that is looking for a snappy VM environment under Linux.
