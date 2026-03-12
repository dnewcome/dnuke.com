---
title: "Working with Jekyll static blog generator on Mac"
date: 2013-02-06T19:37:54-08:00
---

# Working with Jekyll static blog generator on Mac

A while ago I started moving a bunch of my WordPress and Posterous blogs to Octopress. Octopress is a static website generator that uses Jekyll under the hood. On Linux this was pretty easy to get working, but on Mac I had to figure out a bunch of things related to ruby and rake on the Mac.

I had a few of these blogs that I cloned down from Heroku using Git. Well actually I couldn’t just point myself directly at Heroku to get this working, I had to grab the Heroku tools for mac and install them, and then use those tools to upload my ssh public key before I could do anything.

Once Heroku had my public key I could clone my repos back to the Mac. I had an older 1.8.7 version of ruby on the mac, so I tried installing ruby from homebrew. This was a mistake, as other tools like bundler and rake kept trying to use the older version of ruby still.

The core problem I was having was that my version of ruby was wrong. This wasn’t that obvious, as this is the error that I was getting when trying to do rake generate:

```

retnex:octopress dan$ rake generate 

## Generating Site with Jekyll directory source/stylesheets/ create source/stylesheets/screen.css Configuration from /Users/dan/Desktop/sandbox/mine/octopress/_config.yml /Users/dan/Desktop/sandbox/mine/octopress/plugins/category_generator.rb:109: warning: regexp has invalid interval /Users/dan/Desktop/sandbox/mine/octopress/plugins/category_generator.rb:109: warning: regexp has `}' without escape /Users/dan/Desktop/sandbox/mine/octopress/plugins/category_generator.rb:174: warning: regexp has invalid interval /Users/dan/Desktop/sandbox/mine/octopress/plugins/category_generator.rb:174: warning: regexp has `}' without escape /Library/Ruby/Gems/1.8/gems/jekyll-0.12.0/bin/../lib/jekyll/site.rb:78:in `require': /Users/dan/Desktop/sandbox/mine/octopress/plugins/image_tag.rb:27: undefined (?...) sequence: /(?\S.*\s+)?(?(?:https?:\/\/|\/|\S+\/)\S+)(?:\s+(?\d+))?(?:\s+(?\d+))?(?

```
Installing from brew builds ruby from source apparently, and took kind of a long time. And didn’t work in the end.

Installing rvm also built ruby from source. Which took a while. And downloaded another version of gcc:

```

==> Downloading http://r.research.att.com/tools/gcc-42-5666.3-darwin11.pkg

```
I have no idea why rvm needs its own version of gcc. I have xcode installed and I have Apple’s commandline compiler tools, which includes gcc. So for all I know I have 3 versions of gcc here now. My vague understanding of xcode/commandline tools is that the commandline tools basically just let you avoid calling xcrun before invoking gcc.

So getting this set up on Mac wasn’t quite as bad as setting it up on Windows, but Linux is still way easier for this kind of thing.

You also need bundler and rake, which I installed as a gems, once I had rvm set up.

Here is a synopsis of useful commands to get started:

```

$ bundle install
$ rake generate
$ rake new_post['My post title']
$ rake preview

```
