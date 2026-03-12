---
title: "Using the Mongrel2 web server with Mono"
date: 2011-06-05T19:33:48-08:00
---

# Using the Mongrel2 web server with Mono

I’ve been playing with evented web servers lately, and one of the projects that caught my attention was [Mongrel2](http://mongrel2.org/home). Actually I followed its progress via Hacker News and even made a small donation to the author during development. At the time I hadn’t envisioned myself ever actually using it. Later on I realized that its language-agnostic architecture would allow me to set it up in front of some existing .NET code.

What I didn’t fully realize until I played around with it was that Mongrel2 achieves its language agnosticism by way of a message passing architecture. The main Mongrel2 server runs the event loop (really a coroutine system implemented using [libtask](http://swtch.com/libtask/)) and everything else happens in handlers that communicate with the main process over [zeromq](http://www.zeromq.org/) connections. This architecture allows great flexibility in setting up a high-performance web server.

The configuration system is another area where Mongrel2 differs from most server software. It was written so that server management was loosely based on the Model-View-Controller pattern. The running server listens on a port that can receive control commands and return process statistics, and the configuration comes from a mysql database that is managed using a commandline tool.

I think I’ve said enough about the design for now, for much more detailed info check out the humorous and informative [manual](http://mongrel2.org/static/mongrel2-manual.html).

Building Mongrel2 on Ubuntu 10.10 required me to build zeromq from source since the Ubuntu packages were too old. So do the drill for both zeromq and then mongrel2:

```

./configure
make
sudo make install

```
In order to get .NET code to run in response to our HTTP requests, we’ll need a second process that handles the requests that the main Mongrel2 proecess forwards on. I used an open source handler called [m2net](https://github.com/AustinWise/m2net/blob/master/m2net/Connection.cs).

In the source there is a project called “m2net HandlerTest”. We’ll need to make some changes to suit our environment, so look in the Project.cs file and set the ip address that we’ll be running the server on. We’ll also want to have the client ID match what we put in the Mongrel server configuration for the handler.

```

 string vboxIp = "127.0.0.1";
 var conn = new Connection("34f9ceee-cd52-4b7f-b197-88bf2f0ec378", "tcp://" + vboxIp + ":9997", "tcp://" + vboxIp + ":9996");

```
Build the project using make. I had to tweak the makefile, your mileage may vary.

Here is what my Mongrel2 configuration file looked like. This file is boilerplate except for the section under ‘hosts’ for the /csharp route. The configuration should be pretty self-explanatory, but I will note that this configuration terminology mirrors what zeromq uses, and that the recv_ident is not specified becuase the handler will echo the send_ident when it handles the request. 

```

main = Server(
 uuid="f400bf85-4538-4f7a-8908-67e313d515c2",
 access_log="/logs/access.log",
 error_log="/logs/error.log",
 chroot="./",
 default_host="localhost",
 name="test",
 pid_file="/run/mongrel2.pid",
 port=6767,
 hosts = [
 Host(name="localhost", routes={
 '/tests/': Dir(base='tests/', index_file='index.html', default_ctype='text/plain'),
 '/csharp': Handler(send_spec='tcp://127.0.0.1:9997',
 send_ident='34f9ceee-cd52-4b7f-b197-88bf2f0ec378',
 recv_spec='tcp://127.0.0.1:9996', recv_ident='')
 })
 ]
)

servers = [main]

```
Start the handler process:

```

dan@X200:~/tmp/m2net/bin$ ./m2net.HandlerTest.exe 
WAITING FOR REQUEST

```
Start the mongrel process:

```

dan@X200:~/Downloads/mongrel2-1.6$ m2sh start -host localhost
[WARN] (errno: None) No option --db given, using "config.sqlite" as the default.
[INFO] (src/handler.c:327) MAX limits.handler_stack=102400
[INFO] (src/config/config.c:158) Loaded handler 1 with send_spec=tcp://127.0.0.1:9997 send_ident=34f9ceee-cd52-4b7f-b197-88bf2f0ec378 recv_spec=tcp://127.0.0.1:9996 recv_ident=
....
[INFO] (src/handler.c:281) Binding handler PUSH socket tcp://127.0.0.1:9997 with identity: 34f9ceee-cd52-4b7f-b197-88bf2f0ec378
[INFO] (src/handler.c:303) Binding listener SUB socket tcp://127.0.0.1:9996 subscribed to: 

```
I elided some less interesting log output to show mostly the handler messages. We can see that Mongrel has seen our configuration and that the sockets are bound to our running handler. Something to keep in mind is that if we start things up in a different order, things still work. Handlers can connect and disconnect at any time, and if no handler is available the request will be queued until a handler is available. I think a lot of this we get for free from zeromq message handling.

Now we’ll kick the tires by hitting the server with the following URL:

```

http://127.0.0.1:6767/csharp

```
If everything is working correctly it should spit back the headers like this:

```

Sender: 34f9ceee-cd52-4b7f-b197-88bf2f0ec378 Ident: 3 Path: /csharp Headers:
	PATH: /csharp
	x-forwarded-for: 127.0.0.1
	cache-control: max-age=0
	accept-language: en-US,en;q=0.8
	accept-encoding: gzip,deflate,sdch
	connection: keep-alive
	accept-charset: ISO-8859-1,utf-8;q=0.7,*;q=0.3
	accept: application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5
	user-agent: Mozilla/5.0 (X11; U; Linux x86_64; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.204 Safari/534.16
	host: 127.0.0.1:6767
	METHOD: GET
	VERSION: HTTP/1.1
	URI: /csharp
	PATTERN: /csharp

```
Now that we’ve seen things in action, I’m going to point out a few things that make this pretty awesome.

First, messages get queued if the handler isn’t connected. This seems like a bad thing since the client will hang until it times out, but if we design the architecture with a fail-fast mentality, we can design our handlers so that they can bail and restart very quickly. Not only that but we can have many handlers running at a time, so the probability of one not being available is smaller.

Second, we don’t specify the handlers in the Mongrel2 configuration. We specify how Mongrel should listen for handlers that attempt to connect. There is a huge difference here. It means that the actual HTTP server doesn’t know or care about the details of the handlers. The handlers can connect and disconnect at will and Mongrel doesn’t care. Scaling up might mean just running a few more handler processes, which dynamically connect to handle the load.

I suspect that the “MVC” server administration system has some interesting benefits too, but I haven’t explored that part of things yet. If I end up using this for a real project, I’ll write some more about it.
