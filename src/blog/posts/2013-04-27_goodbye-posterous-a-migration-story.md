---
title: "Goodbye Posterous &#8211; a migration story"
date: 2013-04-27T19:54:24-08:00
---

# Goodbye Posterous &#8211; a migration story

![](https://i0.wp.com/upload.wikimedia.org/wikipedia/en/6/6c/Posterous_logo.png)
Many of you know (or should know, if you have anything still on Posterous!) that [Posterous is shutting its doors](http://techcrunch.com/2013/02/15/posterous-will-shut-down-on-april-30th-co-founder-garry-tan-launches-posthaven-to-save-your-sites/) following its acquisition by Twitter. I was one of the first Posterous users in 2008, and they even gave me many more blogs than were usually allowed on the service at the time. Heady days, those.

Anyway Posterous turned out not to be the ideal host for my blogs, and I continued with [WordPress](https://wordpress.com). However, I still maintained a few specialty blogs there ([Alewright](https://alewright.com), for one).

One by one I have been moving blogs to the open-source static blog software, [Octopress](http://octopress.org/), which I’ve been hosting on [Heroku](https://www.heroku.com/) instances. However, now that Posterous is shutting down, I need to move the last few off, so I’m writing up this post to help anyone else that wants to do the same. Sure you can use their export tool to get a tarball of your stuff, but if you are lazy like me, and just want to get stuff over to Octopress, look no further than [this ruby script](https://github.com/pepijndevos/jekyll/blob/patch-1/lib/jekyll/migrators/posterous.rb).

I’m on a Mac, but I’ve used [rvm](https://rvm.io/) to bump my ruby version up to 1.9.3. I installed the [posterous gem](https://github.com/posterous/posterous-gem) using:

```

$ gem install posterous

```
Log into Posterous, go to the [api page](https://posterous.com/api) and get an API key by clicking on “view token”.

You need to know then name of your blog, the username and password, and the API key. Then run:

```

$ ruby posterous-export.rb username password apikey

```
I had to [patch the Posterous gem](https://github.com/posterous/posterous-gem/issues/5) to get things working. Otherwise I got this error:

```

/Users/dan/.rvm/gems/ruby-1.9.3-p374/gems/ethon-0.5.12/lib/ethon/easy.rb:234:in `block in set_attributes': The option: username is invalid. (Ethon::Errors::InvalidOption)
Please try userpwd instead of username.

```
Running the script gets you a file layout on disk including images and HTML-formatted post files, ready for use by Jekyll/Octopress.

To get the new Octopress blog running, just [clone the repo](https://github.com/imathis/octopress) and copy the images/ and _posts directories under the octopress/source directory.

I’ll do another post probably about working with/customizing Octopress so I won’t go into configuring Octopress here. Presumably the API shuts down on April 30, so don’t wait too long!
