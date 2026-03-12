---
title: "Recording webcam videos with VLC Media Player"
date: 2010-01-17T12:05:26-05:00
url: https://newcome.wordpress.com/2010/01/17/recording-webcam-videos-with-vlc-media-player/
id: 735
categories: Uncategorized
tags: 
---

# Recording webcam videos with VLC Media Player

![](images/2010-01-17_recording-webcam-videos-with-vlc-media-player_vlc-logo1.jpg)
I have been recording short videos using the webcam on my laptop using a trial version of some [video software](http://www.nchsoftware.com/capture/) that I found on the net. I had also been using the free [Yawcam](http://www.yawcam.com/) to snap stills, but I didn’t figure out how to get it to record video. It apparently can periodically save still frames or stream over HTTP, but what I wanted in the end was an .mpg file. I searched around the net to find an open source program that would record video from my webcam but I came up empty. [Cheese](http://www.jahshaka.org/) seems like a good option under Linux, but my laptop is running Windows right now, so that doesn’t help me. If anyone knows of something let me know in the comments. It’s probable that one of the open source [nonlinear](http://www.debugmode.com/wax/) [editing](http://www.jahshaka.org/) [programs](http://cinelerra.org/) is able to do this, but I don’t know how to do it.

I’ve used [VLC media player](http://www.videolan.org/vlc/index.html) to play videos on Windows and Linux for a long time, and in my search for webcam software found that it can supposedly record video from a live source, so I decided to give it a try. The tutorials that I found were mostly outdated, so it turned out to be pretty frustrating to get working, which is the primary motivation for writing this post. Hopefully others will be able to get this working on the current version of VLC (1.0.3 at the time of this writing) more easily than I was able to.

Just a warning, I haven’t gotten this to fully work the way that I wanted using the GUI yet, so the final solution presented here will be a command line invocation of VLC. It turns out that this is more convenient since there are a lot of tedious steps to go through that are completely automated when using the command line.

**Foreword on VLC**

Unlike many video programs on the Windows platform, VLC does not use any external codecs or filters. It is completely self-contained. This provided a major source of confusion for me initially, as I was looking around endlessly for the Xvid codec that I wanted to use only to find that it was never detected by VLC.

Even though VLC is self contained, its functional elements are arranged into what the VLC authors call modules. This is important to understand when trying to chain together the functions that we want on the command line. The most helpful synopsis for me was found [here](http://www.fr.videolan.org/doc/streaming-howto/en/ch03.html), and I’ll put the general form inline here for reference:

```

% vlc input_stream --sout "#module1{option1=parameter1{parameter-option1},option2=parameter2}:module2{option1=...,option2=...}:..."

```
The commandline shown above is for Linux systems, but the important thing to notice is that the first module is referenced using #module and subsequent  modules are referenced using :module. Also, options to modules are enclosed in curly braces {…} and may be nested. Nesting will be important when we try to split the stream so that we can both record it to disk and monitor it on the screen during recording.

I noticed some inconsistency in the documentation that I found concerning the argument formats that are supported on various platforms. For example –option param syntax is not supposed to work on Windows, but it appears to in most cases.  We will adhere to the Windows –option=param form however.

VLC is also very flexible and consequently is complicated when it comes to setting up all of the options required to create a seemingly simple mpeg stream. I never knew about different mpeg container formats for network broadcast vs local media (PS vs TS) before this, and it is debatable that it is that useful unless you are into video pretty heavily. You won’t need to look at this to do follow what we are going to do here, but it was an issue when I was trying to figure this out, so if you go off the beaten path there may be more to figure out than you think.

Some of the codecs are very strict about the options that they will take, and you won’t get detailed information about what went wrong unless you have enabled detailed logging. This is covered in the first part of this tutorial. One such gotcha that hit me was that mpeg-2 only supports certain frame rates. The VLC codec adheres to these restrictions rigorously, and if a valid frame rate is not specified you will get a cryptic error about the codec not being able to be opened. Similarly, if no frame rate is specified VLC will not default to something that works, so you have to figure out what went wrong on your own.

**Building the commandline**

Invoking VLC is as simple as running vlc.exe. However we would like to turn on some extended logging while we are trying to get our options set up correctly. Otherwise issues such as the encoder failing to open will not be easily solved since we won’t know exactly what is going wrong.

The very first thing we should try is to make sure that we can open the webcam with extended logging enabled. The webcam device on my laptop is the default device, so we can open it using dshow:// as shown in the command below. We turn on logging using the –extrainf option with the maximum level of verbosity specified using the -vvv flag. A small warning: mute the microphone on your computer before running the following since you might get a feedback loop that is pretty loud. We will fix this later by using the noaudio option to the display module.

```

c:> vlc.exe dshow:// --extrainf logger -vvv

```
If all goes well you should see a VLC window showing the output of your webcam. The only thing left now is to transcode the video stream into mpeg-2 and save it to a file (all while showing a preview window), which turns out to require some VLC module gymnastics.

*Transcoding*

The main task that we are trying to accomplish is actually transcoding the stream, which is the term for encoding the stream as mpeg to be saved to a file. The output of the webcam is in an uncompressed format, so we need to run it through a codec before we can save it to disk. The following command uses two different modules: transcode and standard. Transcode lets us create an mpeg stream and standard lets us package it into a container and save it to disk. This seems pretty straightforward, but there are some voodoo options here that I saw in the examples online but didn’t find very good explanations for. Setting audio-sync for example. Do we ever want un-synced audio? The important part that seems to be left out of many examples is the setting of the frame rate and the size. Failing to set the frame rate using the fps option caused the encoder to fail for me. Failing to set the width caused problems later when I tried to preview the video stream during recording.

```

c:> vlc.exe dshow:// --sout=#transcode{vcodec=mp2v,vb=1024,fps=30,width=320,acodec=mp2a,ab=128,scale=1,channels=2,deinterlace,audio-sync}:standard{access=file,mux=ps,dst="C:\Users\dan\Desktop\Output.mpg"} --extraintf=logger -vvv

```
*Monitoring the stream*

Using what we have so far will get us a stream on disk, but we can’t see what we are doing on the screen. Fortunately VLC has a module called display that will let us pipe the output to the screen. Unfortunately we can’t do that without also using the duplicate module to split the stream first. Using duplicate isn’t too complicated, but it took me a little while to find out how to use the nesting syntax that is needed to get it to work. The general form of the duplicate module is:

```

duplicate{dst=destination1,dst=destination2}

```
Where destination1 and destination2 are the module sections that we want to send the stream to.  The only confusing part is that we have to move our standard module declaration inside of the duplicate module definition like this:

```

duplicate{dst=standard{...}}

```
Once we have this form, we can add other destinations like this:

```

duplicate{dst=standard{...},dst=display{noaudio}}

```
We have added a second destination to show the stream on the screen. We have given the option noaudio in order to prevent a feedback loop since by default display will monitor the audio.

My final command looked like this:

```

c:> vlc.exe dshow:// --sout=#transcode{vcodec=mp2v,vb=1024,fps=30,width=320,acodec=mp2a,ab=128,scale=1,channels=2,deinterlace,audio-sync}:duplicate{dst=standard{access=file,mux=ps,dst="C:\Users\dan\Desktop\Output.mpg"},dst=display{noaudio}} --extraintf=logger -vvv

```
I put the command into a batch file, and now I can create an .mpg file by running the batch file. Some possible improvements could be to parameterize the file name and perhaps allow for setting the bitrate, but for now this suits my needs perfectly.
