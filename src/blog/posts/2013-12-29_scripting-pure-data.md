---
title: "Scripting Pure Data"
date: 2013-12-29T09:56:15-08:00
---

# Scripting Pure Data

Graphical programming languages like PD are great for high level tweaking and live modding of programs, but they all seem to suffer from the problem where things get tedious when building some simple low-level constructs like loops or building data structures.

Pure Data has always been extensible by creating your own externals in C, but there is another step in between building subpatches and building first-class externals and that is scripting using a dynamic language like Lua or Python.

**Lua vs Python**

There are two main scripting languages in use with PD. I’m sure there are others, but they aren’t very common. I was actually looking initially for a way to script PD using Javascript and I didn’t find anything. I’m considering building something that embeds V8 into PD in the future. Or maybe even… gasp… [the .NET framework](https://newcome.wordpress.com/2010/05/08/node-net-node-js-implemented-in-javascript-on-the-net-runtime/). The choice between Lua and Python came down to the ease with which the language embedding was implemented and how smoothly I was able to get things working, rather than my own choice of language (I was rooting for Python since I already know it pretty well).

**Python**

The first thing I did was try to install Thomas Grill’s famous [pyext](http://puredata.info/Members/thomas/py/). The prebuilt binary for OSX was crashing for me and I couldn’t figure out why. I got the sources and built my own binary but I was still getting crashes as soon as I loaded the library in PD. I later realized that this was something with my installed version of Python. I had a later version of Python installed using [homebrew](http://brew.sh/). I’m not sure if maybe I had a 64bit version installed. The only 64bit version of PD for OSX right now is highly experimental and doesn’t include things like GEM. So I’m running a 32bit version. All externals need to be 32bit as well. So I’m wondering if that was part of the problem.

Anyway, once I reverted back to Python 2.7.2 that shipped with OSX pyext worked fine. I still have some crashes with some of the demo patches though.

Installing pyext involves dropping py.pd_darwin under ~/Library/Pd. Then I was able to open the demo patches from the source tree. Note that many of the patches require the library to be loaded already, which can be done using the -lib py startup flag or by simply instantiating the [py] object in any open patch. When it loads you should see some text printed to the PD console window.

Instantiation looks something like [pyext <script> <object> <args>]. As we’ll see this is a little more cumbersome than Lua.

**Lua**

Having never had experience with Lua, I was hesitant to try this out but I’m glad I did. Actually the only reason I did was that I couldn’t get Python to work right away. Lua is interesting in that it has only one built-in data type: the table. Fortunately tables can represent just about any other data type like arrays and maps. The code for generating PD objects is very concise, even more so than some of the Python examples, which is somewhat hard to believe. Also there are easy provisions for registering names directly to PD so that objects built using Lua can be instantiated without any sort of extra syntax, which is pretty awesome. Loading a single Lua source file can register any number of externals that can be instantiated as if they were normal PD abstractions. Read that line again and rejoice.

Installing Lua isn’t necessary, as it is already part of PD-extended. Simply instantiate [pdlua]. We can open a file then with a load message sent to [pdlua].

Going forward I’m going to be using Lua, mostly for its ease of registering names in PD and nice clean instantiation of abstractions built it in. I’ll cover some programming issues I encounter in later posts.
