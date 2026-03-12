---
title: "Installing KDE 4.2 on Ubuntu 8.10"
date: 2009-02-19T17:08:27-05:00
---

# Installing KDE 4.2 on Ubuntu 8.10

The KDE team [announced the general availability of KDE 4.2](http://www.kde.org/announcements/4.2/index.php) on Tuesday.  The folks at Kubuntu were kind enough to have been hosting apt repositories of the beta releases all along, and they have followed by offering a [binary release distribution as well](http://www.kubuntu.org/news/kde-4.2).

**To install KDE from the Kubuntu repository**

Open sources.list in a text editor:

```

$ sudo vi /etc/apt/sources.list

```
Add the following line to sources.list to add the new repository

```

$ deb http://ppa.launchpad.net/kubuntu-experimental/ubuntu intrepid main

```
Update the apt repository cache

```

$ sudo apt-get update

```
Then it is just a matter of running apt-get to install everything

```

$ sudo apt-get install kde

```
I got hung up on the last step, since I didn’t know that simply installing `kde’ would pick up version 4.2 once the new repo had been added to sources.list.
