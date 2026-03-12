---
title: "Zero an old hard disk using dd"
date: 2010-01-14T20:51:41-05:00
---

# Zero an old hard disk using dd

Any time I get rid of a hard disk, I always overwrite the whole drive with zeroes. I know that this is not a secure practice if you are going to be selling the drive, but since the drive is going to the computer recycling center and the data isn’t a matter of national security, a quick wipe should be sufficient. If you want to resell the drive I’d recommend something like [DBAN](http://www.dban.org/) which will overwrite your data properly so that it cannot be retrieved. Practically though, zeroing a drive is enough to keep most people from retrieving the data. A drive that is on the heap with hundreds or thousands of other drives isn’t likely to be scrubbed for data anyway. I could be wrong on this, and anyone in the drive recycling business can chime in and enlighten me, but most of it probably gets [shredded for scrap](http://www.youtube.com/watch?v=UIRXh2oiqtA) right?.

I use a cheap USB IDE/SATA hard drive converter to plug the old drive into my computer and then boot the computer with the [Knoppix](http://www.knoppix.net/) GNU/Linux distribution. Once I’m logged in, I use the following command to overwrite the whole drive with zeroes:

```

dd if=/dev/zero of=/dev/<drive> bs=1M

```
Replace <drive> with the device that represents the disk to be zeroed. Using the `dmesg’ command is helpful in determining the device name of a removable USB drive.

To check the progress we can open up another terminal window and do this:

```

$ while ( true ); do { kill -s USR1 <pid>; sleep 5; } done

```
Replace <pid> with the process ID of the dd process that is running in the other terminal window. This will cause the running `dd’ command to report its progress every 5 seconds to the terminal that it is running in.

This technique could be extended to use /dev/urandom to write random data to the drive also, but generating random data slows things down significantly on my machine and I don’t want too many more excuses standing in the way of getting rid of stuff that is taking up space in my office!
