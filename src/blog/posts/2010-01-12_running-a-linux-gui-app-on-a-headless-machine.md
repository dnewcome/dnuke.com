---
title: "Running a Linux GUI app on a headless machine"
date: 2010-01-12T18:47:05-05:00
---

# Running a Linux GUI app on a headless machine

We all know that several remote desktop solutions exist for Linux, the most popular being [VNC](http://en.wikipedia.org/wiki/Virtual_Network_Computing). Sometimes I don’t want a full desktop login though – I just want to run a single application. Linux is able to do this by design, but we do have to install a piece of software on the client machine if we aren’t running Linux.

My scenario is as follows: I have a [Dell SC40](http://www.dell.com/html/us/products/demos/pedge_sc420/pedge_sc420.html) server that hosts has some mp3s that I want to burn to CD. The server is headless — it has no monitor attached. My [laptop](http://shop.lenovo.com/us/notebooks/thinkpad/x-series/x200) does not have a CD burner, but the server does. The server is running the CentOS 5 GNU/Linux distrubution. The laptop is running 64-bit Windows Vista Ultimate. The CD burning software that I like to use under Linux is [k3b](http://k3b.plainblack.com/).

Ok, so k3b is installed on my CentOS distribution, and I can use [Putty](http://www.chiark.greenend.org.uk/~sgtatham/putty/) to connect to the server from my laptop using secure shell. What we ultimately hope to do is to log in using Putty and simply run k3b from the commandline and have the GUI show up on the laptop. In order for the GUI to show on the laptop we need a piece of software called an X server. Since we are on Windows, this is not included with the OS so we need something like [Xming](http://sourceforge.net/projects/xming/).

Install Xming and run it. When Xming is running you will see an ‘X’ icon in the system tray. The default settings will do fine for our purposes here. The only tricky part is configuring Putty. We need to enable X forwarding and set the display variable to localhost:0. You’ll have to drill down to get to the setting as shown below.

![\1](/images/2010-01-12_running-a-linux-gui-app-on-a-headless-machine_puttyconfig.png)

Now that Xming is listening on the laptop and we have logged in to the server using Putty with X forwarding enabled, we can start any GUI app at the commanline and the GUI will display on the laptop using Xming.

```

# k3b

```
The result looks like this:

![\1](/images/2010-01-12_running-a-linux-gui-app-on-a-headless-machine_k3bshot.png)

What is happening here is that the server machine is sending the [X11](http://en.wikipedia.org/wiki/X_Window_System) control commands back to the Xming software running on the laptop over a forwarded tcp port provided by Putty. It’s a little confusing unless you know how Putty and X11 work, but setting it up still isn’t too hard.

Keep in mind that any GUI application can be run this way. Another favorite usage of this technique is monitoring my server backups to [CrashPlan](http://b9.crashplan.com/landing/index.html), which offers a GUI for administering your offsite backups.
