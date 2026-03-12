---
title: "Running programs as Linux daemons using Upstart"
date: 2012-02-26T14:43:33-08:00
url: https://newcome.wordpress.com/2012/02/26/running-programs-as-linux-daemons-using-upstart/
id: 1569
categories: Uncategorized
tags: 
---

# Running programs as Linux daemons using Upstart

In the Windows world, any long-running background process on a machine is handled as a Windows Service. This is a well-known programming interface that allows the system to coordinate startup and shutdown procedures and allows an administrator to use the service management tools to control and log details of the process.

In Linux, from the very beginning there was the idea of a daemon, which is conceptually the same as what Windows calls a service. However, a daemon doesn’t really have any one definite meaning. For the most part, when a process “daemonizes” on its own, that means that it forks and dissociates itself from the controlling terminal [[1]](http://en.wikipedia.org/wiki/Daemon_(computing)). However most of the time we aren’t directly calling a process like this when we boot a system or want to manage a process. Which brings us to using tools like init or upstart.

The classic way of starting daemons on a Unix is using init. Init is the first process that is started after booting the kernel [[2]](http://en.wikipedia.org/wiki/Init). Init is responsible for starting all of the rest of the processes that need to be started when the system boots. The scripts and system that support the use of init are typically referred to as a “system v” init system (sysv). BSD Unix and some Linux distributions (slackware) use a simpler init system that is referred to as BSD init.

So why am I explaining all of this stuff? Despite their structural differences, all init based systems fundamentally are shell scripts that are scheduled or controlled in different ways. In order to hook a new program in as a system daemon we need to write some wrapper scripts around the program and tell init about it. That’s really all. However, managing processes is kind of tricky and for the most part you have to be very careful when writing these scripts. Ubuntu and later Redhat versions have started using an alternative system called Upstart as a result of the difficulty in getting init scripts right.

Using upstart, we only need to worry about a single configuration file, which by convention lives in /etc/init and is named service.conf, where service is the name of the service that the file describes. The format of a conf file is mostly declarative, with hooks for inserting arbitrary shell code. For the most part it is much easier to get a service mostly correct quickly by just copying and modifying one of the existing config files.

My experience is that Upstart is way easier, so if it’s at all possible to use Upstart as your init, it will make things much easier. I used the following template script for my new daemon [[3]](https://help.ubuntu.com/community/UbuntuBootupHowto):

```

# myservice - myservice job file

description "my service description"
author "Me <myself@i.com>"

# Stanzas
#
# Stanzas control when and how a process is started and stopped
# See a list of stanzas here: http://upstart.ubuntu.com/wiki/Stanzas#respawn

# When to start the service
start on runlevel [2345]

# When to stop the service
stop on runlevel [016]

# Automatically restart process if crashed
respawn

# Essentially lets upstart know the process will detach itself to the background
expect fork

# Run before process
pre-start script
 [ -d /var/run/myservice ] || mkdir -p /var/run/myservice
 echo "Put bash code here"
end script

# Start the process
exec myprocess

```
In my case, the process I was running was not already a daemon, meaning that it didn’t fork into the background when run – it blocks indefinitely. So the very first thing I had to do was to remove the line:

```

expect fork

```
I didn’t use a pid (process identifier) file to control the service so the pre-start script wasn’t necessary. If I have issues with startup/shutdown I might use a PID file in the future. Even without the PID file, Upstart can detect that the process is already running and can kill the running process without having an explicit pid file.

One other thing that got me initially was that the “exec” line is an [Upstart stanza](http://upstart.ubuntu.com/wiki/Stanzas) in this case, and not the exec command. In fact, in order to run more than one line you need a stanza that uses script/end script:

```

script
 . /etc/default/hal
 exec /usr/sbin/hald --daemon=no $DAEMON_OPTS
end script

```
You seem to get a lot for free with Upstart. I’ll update things here if I find any drawbacks to keeping it this simple, but for now things are working well.
