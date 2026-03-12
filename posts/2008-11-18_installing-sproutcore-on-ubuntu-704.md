---
title: "Installing Sproutcore on Ubuntu 7.04"
date: 2008-11-18T22:11:02-05:00
url: https://newcome.wordpress.com/2008/11/18/installing-sproutcore-on-ubuntu-704/
id: 74
categories: Uncategorized
tags: 
---

# Installing Sproutcore on Ubuntu 7.04

I know, I know, 7.04 is old now, but I still haven’t upgraded my laptop.

I tried the standard

$ sudo gem install sproutcore

but I had issues with nokogiri:

Install required dependency nokogiri? [Yn]  Y

Select which gem to install for your platform (i486-linux)

1. nokogiri 1.0.6 (ruby)

2. nokogiri 1.0.6 (x86-mswin32-60)

3. nokogiri 1.0.5 (x86-mswin32-60)

4. nokogiri 1.0.5 (ruby)

5. Skip this gem

6. Cancel installation

> 1

Building native extensions.  This could take a while...

ERROR:  While executing gem ... (Gem::Installer::ExtensionBuildError)

ERROR: Failed to build gem native extension.

rake RUBYARCHDIR=/var/lib/gems/1.8/gems/nokogiri-1.0.6/lib RUBYLIBDIR=/var/lib/gems/1.8/gems/nokogiri-1.0.6/lib extension

(in /var/lib/gems/1.8/gems/nokogiri-1.0.6)

rake aborted!

Don't know how to build task 'extension'

I found some references to using `upgrade –system’ to upgrade the gem software components, but this didn’t work for me.  Instead the following worked:

$ sudo gem update --system

This upgraded my gem installation, but it still needed [this patch](http://www.nickpeters.net/2007/12/31/fix-for-uninitialized-constant-gemgemrunner-nameerror/) in order to run.

After all this the Sproutcore installation went smoothly.
