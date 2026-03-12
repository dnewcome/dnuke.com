---
title: "Embedding IronJS"
date: 2010-05-25T10:55:09-05:00
url: https://newcome.wordpress.com/2010/05/25/embedding-ironjs/
id: 941
categories: Uncategorized
tags: 
---

# Embedding IronJS

**Update**: This post covers an obsolete version of IronJS. For details on embedding the new stuff I have a [new article here](https://newcome.wordpress.com/2011/03/13/embedding-ironjs-part-ii/).

I’m looking at alternatives to [JScript](http://msdn.microsoft.com/en-us/library/hbxc2t98(VS.85).aspx) for my latest project, [Node.net](http://github.com/dnewcome/Node.net). I cut the initial code using JScript because the level of integration with the .NET framework made it possible to keep the design very simple and let me write the entire thing in Javascript. Some commenters pointed out that [v8](http://code.google.com/p/v8/) provides [some ECMAScript5 things](http://wiki.github.com/ry/node/ecma-5mozilla-features-implemented-in-v8) whose usage is encouraged in Node.js programs. So in order to write a conforming implementation, I’d really need to embed the v8 Javascript engine or trust that an alternative Javascript engine keep up with the v8 implementation of the emerging standards.

So, I made a [first cut ](http://github.com/dnewcome/Node.net/blob/master/v8/TcpServer.cc)at implementing the tcp server by writing a .net assembly in managed c++ that embedded the v8 engine. I got this working, but it feels kind of unnatural since we require a lot of wrapping managed handles up into opaque containers for storage by v8 to be used as callbacks. Writing managed c++ isn’t a big deal, and even calling out to unmanaged c and c++ code isn’t that bad, but here we have the case where the unmanaged v8 engine has to call back into native .net code, which requires some trickery that is new to me, so I’m not sure yet how robust it will be. Also, I really want to avoid just re-inventing what the Node.js guys have done. Eventually the existing Node.js server will probably run on Windows. I’m more interested in having a simple and hackable implementation of the fantastic Node.js API available for managed runtimes. A similar approach could be used to create a Node server for the Java runtime.

However, I’m also looking into using another fully-managed .NET Javascript implementation. The two contenders seem to be [Jint](http://jint.codeplex.com/) and [IronJS](http://github.com/fholm/IronJS). Jint has been around for a while and IronJS is new on the scene. IronJS looks like it will have a significant performance advantage over Jint, and being based on the [Dynamic Language Runtime](http://dlr.codeplex.com/), its performance should improve with improvements to the underlying runtime.

With apologies to the creators of Jint, I’m going to bet on IronJS for the moment, as I don’t have time to try both of them out. Community buzz is good for IronJS, and it aims to follow in the tradition of other successful DLR languages like [IronPython](http://ironpython.net/). I was kind of surprised at how early-stage the IronJS code was given the level of buzz about it. Apart from the Github repository the only website seems to be the [author’s blog](http://ugh.cc/), on which I couldn’t find any general info about the project. However, despite the lack of documentation, the code is very clean and I was able to figure most things out on my own. So, I’m going to post up a few lines of code here since there doesn’t seem to be an embedder’s guide for IronJS like there is [for v8](http://code.google.com/apis/v8/embed.html).

I grabbed the IronJS code from Github:

```

> git clone http://github.com/fholm/IronJS.git

```
The bleeding-edge stuff didn’t build for me, so I reverted to the 0.1 branch:

```

> git checkout 0.1

```
Once we are on the correct branch the code should build with msbuild or Visual Studio.

I looked around for a [repl](http://en.wikipedia.org/wiki/Read-eval-print_loop), but the closest thing that is included is a console application called IronJS.Console that runs a few simple tests from a file and writes the output to standard output (This actually means we should be able to write a repl in Javascript and use this project to run it). Taking this as a sample, we can see what is required to load a Javascript file, evaluate it, and run it.

```

var context = Context.Create();
var astBuilder = new Compiler.AstGenerator();
var etGenerator = new Compiler.EtGenerator();
var astNodes = astBuilder.Build( "Testing.js", Encoding.UTF8 );
Action<Scope> compiled = etGenerator.Build( astNodes, context );

```
There are a few more details exposed here than we’d probably like such as having to create the abstract syntax tree as a separate step, but it is interesting to have access to the syntax tree prior to code generation. Presumably we’d be able to manipulate the code programmatically before generating the final code, which could allow some interesting metaprogramming possibilities.

You may recognize [Action<T>](http://msdn.microsoft.com/en-us/library/018hxwa8.aspx) as the built-in .NET delegate that can represent any method that takes a single argument of the given parameterized type and returns null. I changed the original variable declaration from using `var’ in order to show more explicitly what we end up with after compilation. Just like any other delegate, we can invoke it just like a .NET function. However we need to create a scope for the code to run in first. The scope provides the global variables that we’d like to make available to the executing Javascript code.

Creating the global scope looks like this:

```

var globals = Scope.CreateGlobal(context);

```
We have enough code now to run arbitrary Javascript code, but we don’t have any way to communicate between the Javascript code and the host environment. For the sake of this example, lets say that we’d like to be able to execute the following code, which will be provided in the file `Testing.js’:

```

print("foo");
print( y );

```
In order to provide a print() function so that we can print to the console we can do something like this:

```

Func<object, object> print = ( obj ) => { Console.WriteLine( JsTypeConverter.ToString( obj ) ); return null; };
globals.Global( "print", print );

```
So all we needed to do to provide a print() function to the Javascript scope was to bind a delegate to a function name using Scope.Global(). Variables can be added in a similar fashion, but value types don’t seem to be supported directly, so in order to supply an integer variable, we just box it to an object before registering it using Scope.Global().

```

object y = 0;
globals.Global( "y", y );

```
Now that we’ve built the scope with the global variables and functions we need, the delegate can be invoked with the scope as its parameter.

```

compiled( globals );

```
One of the critical things that I need in Node.net is the ability to reach into the Javascript context and get references to objects and functions that are defined in the script file. In IronJS this is accomplished using Scope.Pull(). So in our example, if `Testing.js’ defined

```

var x = 2

```
We could access this as:

```

globals.Pull( "x" );

```
That’s it for now. Happy hacking.
