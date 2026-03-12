---
title: "Moving VirtualBox Machines from Linux to Windows"
date: 2009-02-28T17:22:02-05:00
url: https://newcome.wordpress.com/2009/02/28/moving-virtualbox-machines-from-linux-to-windows/
id: 164
categories: Uncategorized
tags: 
---

# Moving VirtualBox Machines from Linux to Windows

As I’ve noted previously here on the blog, I use VirtualBox for my Windows development machines.  I’m going to be trying Windows Vista out for a bit, since it shipped on my new laptop.  However I’m going to keep my same virtual machines for dev until I get things situated natively.  Moving the VMWare images went as expected, but I was surprised that I couldn’t just copy my VirtualBox images over easily.

There is a good article on using the VirtualBox tools to clone disk images [here](http://srackham.wordpress.com/cloning-and-copying-virtualbox-virtual-machines/) but unfortunately you cannot seem to move the actual machine configuration.  I really wanted to keep the same machine configs rather than create them anew.

The following is completely unsupported by VirtualBox, but it worked fine for me. YMMV as they say.

First, take a look at the main VirtualBox config file on your Linux machine.  The file is ~/.VirtualBox/VirtualBox.xml.  We need to get the unique IDs of the hard disk and the machine that we want to move.  We could get this information from the machine config itself, but it is easier to copy and paste from the global config, since the whole line can be copied into the new VirtualBox.xml file on the target Windows machine.

> <MediaRegistry>

<HardDisks>

<HardDisk uuid=”{96d326d8-05fb-4cfd-b369-38f36563f4fa}” location=”/mnt/ultrabay/VMs/virtualbox/VDI/server2003-1.vdi” format=”VDI” type=”Normal”/>

</HardDisks>

<MediaRegistry>

> <MachineRegistry>

** <MachineEntry uuid=”{fedffbeb-b64a-4b8a-a2a1-9e7b34a8afa9}” src=”/mnt/ultrabay/VMs/virtualbox/Machines/server2003/server2003.xml”/>**

</MachineRegistry>

Copy the bolded sections into the C:\Users\<username>\.VirtualBox\VirtualBox.xml file on the target Windows machine, and adjust the paths to match the new locations of the virtual machine xml definition file and the .vdi disk image files.

Now, in the configuration file for the virtual machine that is to be moved, we will have to modify several things to get the machine to load correctly.

Change the VirtualBox version:

> <VirtualBox xmlns=”[http://www.innotek.de/VirtualBox-settings&#8221](http://www.innotek.de/VirtualBox-settings&#8221); version=”1.5-linux”>

becomes

> <VirtualBox xmlns=”[http://www.innotek.de/VirtualBox-settings&#8221](http://www.innotek.de/VirtualBox-settings&#8221); version=”1.6-windows”>

Change paths for things like shared folders:

> <SharedFolder name=”temp” hostPath=”/tmp” writable=”true”/>

becomes

> <SharedFolder name=”temp” hostPath=”C:\temp” writable=”true”/>

There may be other places to change. In my case this was the only thing apart from disk image locations.

Remove any mounted cdrom** **images:

> <DVDDrive passthrough=”false”>

<!–<Image uuid=”{7aac8916-dfe3-4836-b1c0-b92212437142}”/>–>

</DVDDrive>

Here I just commented out my image, perhaps I will add it back once the machine is up and running.

Once this has been done, you should be able to start the VirtualBox GUI interface and the machine should be listed in the inventory, ready to run.
