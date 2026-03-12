---
title: "Using IronJS 0.2 on Ubuntu 10.10"
date: 2011-04-26T23:13:53-08:00
url: https://newcome.wordpress.com/2011/04/26/using-ironjs-0-2-on-ubuntu-10-10/
id: 1393
categories: Uncategorized
tags: 
---

# Using IronJS 0.2 on Ubuntu 10.10

The new 0.2 code drop for [IronJS](https://github.com/fholm/IronJS) has been available for a week or so now, and I just went through the process of installing the necessary tools for coding against it with Mono on Ubuntu so I thought I’d give it a quick writeup here.

For starters, IronJS requires Mono 2.10, which is the latest version available. Unfortunately, both Ubuntu 10.10 and 11.04 have an older version of Mono:

```

$ mono -V
Mono JIT compiler version 2.6.7 (Debian 2.6.7-3ubuntu1)
Copyright (C) 2002-2010 Novell, Inc and Contributors. www.mono-project.com

```
This version of Mono does include a .NET 4.0 profile, but it is missing some needed framework assemblies. 

I didn’t want to mess with my working Mono installation, so I opted to build from source and install in an alternate location rather than installing the available rpm packages using [alien](http://kitenet.net/~joey/code/alien/). Fortunately the source tree is easy to configure and build. Unfortunately it is massive and takes a long time. I lived dangerously and built it [directly from the git repository](http://www.mono-project.com/Compiling_Mono_From_Git), but you can [grab a tarball](http://www.mono-project.com/Compiling_Mono_From_Tarball) if you’d like.

Getting the code, configuring the source to install locally in my home directory, building and installing looked like this:

```

git clone git://github.com/mono/mono.git
cd mono
mkdir -p ~/usr/local
./configure prefix=~/usr/local
make
make install

```
We need some Microsoft FSharp libraries as well. We don’t need a full installation since we aren’t compiling IronJS, so I won’t go into that here. The important thing to note is that we need the framework 4.0 version of the library, which is included in the plain [.zip archive](http://www.microsoft.com/downloads/en/details.aspx?FamilyID=effc5bc4-c3df-4172-ad1c-bc62935861c5) available from Microsoft Research. Note that the .deb packages that are supplied on Codeplex don’t seem to have the 4.0 libraries. Ordinarily we’d install the FSharp libraries to the Global Assembly Cache, but the libraries that I got when I downloaded their package had been delay signed, so they can’t be installed as-is (although they should be installable by [disabling assembly verification](http://msdn.microsoft.com/en-us/library/t07a3dye(v=vs.80).aspx)).

The library that we are interested in is:

```

FSharp-2.0.0.0/v4.0/bin/FSharp.Core.dll

```
So now grab the [IronJS binaries](https://github.com/fholm/IronJS/downloads) for Mono, extract and copy FSharp.Core.dll to the folder. Now we have everything we need. To test things out we can write a tiny test program like the following:

```

using System;
using IronJS;

public class Program {
	public static void Main() {
		var ctx = new IronJS.Hosting.CSharp.Context();
		Console.WriteLine( ctx.Execute("1 + 1") );
	}
}

```
Build it like this:

```

~/usr/local/bin/gmcs test.cs -reference:IronJS.dll -reference:FSharp.Core.dll

```
If all is well we should end up with test.exe, which should obviously should print “2” to stdout.
