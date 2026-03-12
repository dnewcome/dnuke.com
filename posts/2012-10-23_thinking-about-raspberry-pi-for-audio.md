---
title: "Thinking about Raspberry PI for audio"
date: 2012-10-23T00:14:01-08:00
url: https://newcome.wordpress.com/2012/10/23/thinking-about-raspberry-pi-for-audio/
id: 1711
categories: Uncategorized
tags: 
---

# Thinking about Raspberry PI for audio

I’ve been busy with some audio projects recently but haven’t had much time for writing. Hopefully that changes soon, but in the meantime I’ve had some thoughts on future projects that I wanted to jot down. Usually I take my notes on this stuff in private, but I figured why not try riffing on this stuff on the blog?

I’ve been thinking of trying to grab a [Raspberry PI](http://www.raspberrypi.org/) single-board computer soon, and naturally I was thinking about using it to run [Pure Data](http://puredata.info/) or something like that. However, I realized that it only has an audio output and no audio input. Seems like an unfortunate oversight, but as I understand it, getting the board to the current price point was quite a feat of engineering akin to shaving weight from a race car so I’m sure it was a necessary sacrifice.

This means that it could be a pretty cool little synthesizer maybe, but using it to process audio like a guitar pedal wouldn’t work right out of the box. I’ve seen [some people](http://www.raspberrypi.org/phpBB3/viewtopic.php?f=66&t=19155) trying to use little USB audio devices with the PI but I’m not sure if anyone has gotten low-latency audio working. There have been some [documented issues](https://github.com/raspberrypi/firmware/issues/19) with USB dropping data that may have affected some prior attempts at getting this to work, but hopefully those have been cleared up by now.

I looked around on Amazon for likely candidates for USB audio cards and found [this](http://www.amazon.com/Syba-SD-CM-UAUD-Adapter-C-Media-Chipset/dp/B001MSS6CS/ref=zg_bs_11973521_1). There are a bunch of these floating around but there is a pretty interesting [comparison review](http://www.amazon.com/review/R37Q7W5SRVY3QM/ref=cm_cr_dp_title?ie=UTF8&ASIN=B001MSS6CS&nodeID=541966&store=pc) that makes this one sound like a pretty good bet, albeit at a slightly higher price.

So if the PI and a little USB audio adapter coupled with a realitime Linux kernel could make a low-latency audio effects processor, that would be really awesome. It wouldn’t be as flashy as something like the OpenStomp pedal with its embedded DSP, but then everything is pretty much moving “native” anyway (is it proper to call it native when the entire system is as small as the PI and embedded anyway?) so this might be an interesting way of building something similar to the [Korg Oasys](http://en.wikipedia.org/wiki/Korg_OASYS) but scaled down and on the cheap. For those who aren’t familiar with the Oasys, it was a keyboard manufactured by Korg that was essentially a Linux box running special Korg synthesis software and high quality audio interfaces. The differentiating factor is that the DSP was being done natively instead of on dedicated DSP chips with the Oasys.

So back to the Raspberry PI. There is an ethernet interface on this thing, and again, using USB you could outfit it with a wifi adapter to make it wireless. This could be a platform for running a distributed mesh of Pure Data patches with individual audio outputs.

I’m not sure how the PI handles booting and such. I’d imagine that I’d have to get a display connected to it at some point. Or maybe everything can be done using SSH [over its ethernet port](http://www.penguintutor.com/linux/raspberrypi-headless)? I don’t know much about the board yet so I’m just spinning off scenarios here.

As an aside, the new [Arduino Due](http://www.tgdaily.com/hardware-brief/67008-32-bit-arduino-due-has-the-power-to-fly-literally) sports a 32 bit ARM core running at 84Mhz. That should be fast enough to do some real signal processing natively, unlike the 8 bit Arduinos. Still, compared to using the PI the Arduino would be really roughing it with respect to doing any sophisticated audio work.
