---
title: "Hacking on local Ruby gems"
date: 2013-02-07T00:25:00-08:00
---

# Hacking on local Ruby gems

I’m playing around with [some ideas](https://github.com/dnewcome/shellstep) posed by a friend of mine lately in Ruby. I’ve done some Rails hacking in the past but I don’t usually get far off the beaten path in Ruby. Well, except for that time that I hacked up a version of Mongrel to try to make it a streaming HTTP server before node.js was released. That was pretty awesome.

Anyway in order to get this stuff working I had to patch the ruby readline gem (rb-readline). Initially I just did this in my own gem installation path (~/.rvm/gems/…) but later on I wanted to just pull that library into my project until I can figure out a way to get it working without patching.

Initially I tried just copying the gem locally to my project and “require”-ing the code directly. It seems like this should work but I was always getting file load errors like this:

```

/Users/dan/.rvm/rubies/ruby-1.9.3-p374/lib/ruby/site_ruby/1.9.1/rubygems/custom_require.rb:36:in `require': cannot load such file -- rb-readline (LoadError)
	from /Users/dan/.rvm/rubies/ruby-1.9.3-p374/lib/ruby/site_ruby/1.9.1/rubygems/custom_require.rb:36:in `require'

```
So the next thing I tried was using a Gemfile to specify the local location:

```

gem "rb-readline", :path => "./rb-readline-0.4.2"

```
This resulted in errors that the source could not be found:

```

Could not find gem 'rb-readline (>= 0) ruby' in source at ./rb-readline-0.4.2.
Source does not contain any versions of 'rb-readline (>= 0) ruby'

```
After looking around a bit I finally read the [Gemfile man page](http://gembundler.com/man/gemfile.5.html):

```

Similar to the semantics of the :git option, the :path option requires that the directory in question either contains a .gemspec for the gem, or that you specify an explicit version that bundler should use.

```
So my final gemfile looked like this:

```

gem "rb-readline", "0.4.2", :path => "./rb-readline-0.4.2"

```
Now bundle install worked. But I was still not able require the code because I forgot the following in my code:

```

require "rubygems"
require "bundler/setup"

```
Done!
