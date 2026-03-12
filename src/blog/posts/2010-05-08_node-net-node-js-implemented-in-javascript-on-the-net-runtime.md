---
title: "Node.net &#8211; Node.js implemented in Javascript on the .NET runtime"
date: 2010-05-08T08:34:55-05:00
---

# Node.net &#8211; Node.js implemented in Javascript on the .NET runtime

**– Update:**

This has gotten more attention after I posted this and I haven’t gotten around to doing another post. I started working on a v8 port of this after the initial JScript version just to see if it was feasible after I got some comments suggesting using v8 instead of JScript. There is currently a really rough version of the Tcp server done using v8 under v8\ along with my other hackings trying to figure out v8 embedding. I pushed the code up as soon as I had something working the other day, and c++ isn’t my first language so it is pretty rough. However I solved many of the tricky bits such as storing managed handles so that they can be accessed later from js.

I’ve been using [Node.js](http://nodejs.org/) recently and I’m loving it. I’ve dabbled in server-side Javascript on and off over the last two years or so with Rhino and later with writing my own hack servers using JScript on the .NET framework, and Node is hands-down the best way to run Javascript on the server to come along so far.

I got the idea last weekend that it should be possible to use the Microsoft [JScript language](http://msdn.microsoft.com/en-us/library/72bd815a(v=VS.100).aspx) to implement an event-driven server in .NET similar to Node.js. Before anyone gets too uppity about Node.net not being a full implementation of Node.js, let me say that this was a weekend hack that ended up working out, so I extended it just enough so that it should make sense to someone who is familiar with Node.js.

**Goals**

- Same theory of operation as Node.js (single threaded eventing front-end, non-blocking IO back-end)

- API compatibility with Node.js

- Written entirely in Javascript (JScript.NET)

- Runs on the .NET runtime

**What is implemented**

- Enough of the `http’ module to implement a basic server that handles post data and sends back response

- Enough of the `net’ module to implement a TCP server that echoes requests to stdout

- Enough of the `stream’ api to support the above

- require()

- sys.puts()

**Limitations**

- HTTP requests are cached by .NET even though the stream is read async. This was a limitation of using HttpListener in .NET. The TCP server is fully streaming however.

- Writes are implemented as blocking calls currently. I didn’t have time to implement write queues to enforce write ordering.

**Download**

A binary distribution is available [here](http://www.box.net/shared/bh905h17cp). Grab the source from [here](http://github.com/dnewcome/Node.net).

**Usage**

On Windows:

If you have the .NET 2.0 framework installed (likely if you are on a Windows box), just run the build script. If you’d rather build against a different framework version, you can alter the path to jsc.exe.

```

C:\> node.exe server.js

```
On Linux, under Mono:

```

C:\> mono node.exe server.js

```
In order to run under Mono, you’ll need Microsoft’s version of Microsoft.JScript.dll, which is included in the .NET framework. I can’t provide it here since it is not redistributable individually.

**Examples**

Running an HTTP server that prints post data to the console and replies with an `All finished’ message when the request completes:

```

var sys = require( 'sys' ), http = require( 'http' );
http.createServer( function( request, response ) {
	request.addListener( 'data', function( data ) {
		sys.puts( data );
	});
	request.addListener( 'end', function() {
		response.write( '<html><body><p>All finished!<p></body></html>' );
		response.end();
	});
}).listen( 9981, 'localhost' );

```
To test it out, try something like this:

```

C:\>curl http://localhost:9981 -d "hello"
<html><body><p>All finished!<p></body></html>

```
Running a TCP server that listens on port 9982 and writes data sent to the console:

```

var sys = require( 'sys' ), net = require( 'net' );
net.createServer( function( stream ) {
	stream.addListener( 'data', function( data ) {
		sys.puts( data );
	});
}).listen( 9982, 'localhost' );

```
To test out the TCP server try sending it some data using telnet:

```

C:\>telnet localhost 9982

```
Although I’m aiming to expose everything as an API that is compatible with Node.js, you can access the .NET framework from within the Javascript that runs under Node.net.

For example, the TCP server shown above could have used Console.WriteLine() in order to write its output to the console:

```

var net = require( 'net' );
net.createServer( function( stream ) {
	stream.addListener( 'data', function( data ) {
		System.Console.WriteLine( data );
	});
}).listen( 9982, 'localhost' );

```
The preceding samples are exactly the same as the code you would have written to accomplish the tasks in Node.js (with the exception of Console.WriteLine() of course ).

**Building from source**

Get the source from github here.

On Windows:

```

C:\> build.bat

```
On Linux

Mono’s mjs compiler doesn’t compile Node.net. Let me know if you get it to work.

**Future work**

Non-blocking writes is the biggest unimplemented piece of the architecture. After having gotten the locking semantics figured out for the main dispatch loop to avoid races (I think it is correct — if you are a threading guru I invite you to double-check my work), I didn’t feel like tackling writes. The current HTTP implementation isn’t streaming, and should be rewritten to use the `net’ module instead. This would entail writing an HTTP parser, which I wasn’t prepared to spend time doing. Also, most of the Node.js API remains unimplemented. I haven’t looked at the source code for Node.js much, but I’m wondering if some of its Javascript code could  be ported to work with Node.net.
