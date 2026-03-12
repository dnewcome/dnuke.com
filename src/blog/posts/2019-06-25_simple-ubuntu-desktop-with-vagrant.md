---
title: "Simple Ubuntu Desktop with Vagrant"
date: 2019-06-25T15:27:41-08:00
---

# Simple Ubuntu Desktop with Vagrant

I wanted to spin up a Linux development environment to hack on some code that needed epoll. I could have run everything in a Docker container, but I kinda wanted to be in that environment for total hackage.

I thought maybe I’d just do it in a Virtualbox instance. Then I didn’t want to install Ubuntu or anything. Then I realized that Vagrant is supposed to solve this problem. Installed Vagrant and used Ubuntu Trusty – [https://app.vagrantup.com/ubuntu](https://app.vagrantup.com/ubuntu)

$ brew cask install vagrant

$ vagrant init ubuntu/trusty64

$ vagrant up

Then I realized I wanted a minimal desktop.

So googling.

Yep, XFCE FTW. [https://stackoverflow.com/questions/18878117/using-vagrant-to-run-virtual-machines-with-desktop-environment](https://stackoverflow.com/questions/18878117/using-vagrant-to-run-virtual-machines-with-desktop-environment)

Then install chrome. It’s easiest to SSH into the instance and past this stuff in through the native shell.

$ wget -q -O – [https://dl-ssl.google.com/linux/linux_signing_key.pub](https://dl-ssl.google.com/linux/linux_signing_key.pub) | sudo apt-key add –

$ echo ‘deb [arch=amd64] [http://dl.google.com/linux/chrome/deb/](http://dl.google.com/linux/chrome/deb/) stable main’ | sudo tee /etc/apt/sources.list.d/google-chrome.list

$ sudo apt-get update

$ sudo apt-get install google-chrome-stable

In Virtualbox

$ startxfce4&
