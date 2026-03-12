---
title: "Develop &amp; Test Palm Pre apps Under Safari Without the SDK"
date: 2009-06-11T02:10:46-05:00
---

# Develop &amp; Test Palm Pre apps Under Safari Without the SDK

Update: I’ve removed the download link, since this constitutes a redistribution of Palm’s code.  You can still play with this by downloading the system restore image from Palm and either putting the code in the right place on your hard drive where all of the hard-coded paths will resolve, or making the changes yourself in the Mojo code. (actually really easy, you just need to fix the absolute paths).  See the  [precentral](http://forums.precentral.net/web-os-development/185038-develop-pre-apps-safari-without-sdk.html) post for details on how to do this.

I was looking around under the recently leaked root image, and I grabbed the mojo javascript files.  A little tweaking and I was able to create and run a demo app using the framework using Safari instead of the SDK!

![mojo](../files/2009/06/mojo.png?w=181)

I’ll post a bit more on this later.

Update: some folks [over at PreCentral](http://forums.precentral.net/web-os-development/185038-develop-pre-apps-safari-without-sdk.html) have verified that this works under Google Chrome as well.

Update: palm built-in apps such as the calculator work.  Here are screenshots of the calculator running in various browsers:

![\1](/images/2009-06-11_develop-test-palm-pre-apps-under-safari-without-the-sdk_webos-calc-ff3-5.png)

![\1](/images/2009-06-11_develop-test-palm-pre-apps-under-safari-without-the-sdk_webos-calc-chrome2-0.png)

![\1](/images/2009-06-11_develop-test-palm-pre-apps-under-safari-without-the-sdk_webos-calc-safari4.png)
