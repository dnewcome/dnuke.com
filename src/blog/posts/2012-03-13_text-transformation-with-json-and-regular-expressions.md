---
title: "Text transformation with JSON and regular expressions"
date: 2012-03-13T01:24:30-08:00
---

# Text transformation with JSON and regular expressions

Ever since I wrote the [Jath Javascript XML processing library](https://github.com/dnewcome/jath) I’ve been thinking about ways to declaratively transform various things to JSON.

Perhaps not-so-coincidentally, I’ve been talking about ways to [update the tools we use](https://newcome.wordpress.com/2012/03/06/functional-programming-and-the-death-of-the-unix-way/) to pass around data structures rather than text blobs lately.

Since I wrote that post, I’ve been toying with small stepping stones that would get us closer to realizing a more “functional” experience in the Linux shell without ripping everything out and starting over. A start is to have a way to get the output of common shell commands and parse it into something like JSON.

As I said at the top of this post, text transformations have been something I’ve been playing with in various forms for a while now, so I dug up a project that I started back when I was working on Jath that does essentially what Jath does but with regular expressions instead of XPath queries. The idea is to provide a template that transforms plain text to JSON using regexps as the selectors.

For those of you not familiar with Jath, it uses a template like this:

```

var template = [ "//status", { id: "@id", message: "message" } ];

```
To turn this:

```

<statuses userid="djn">
 <status id="1">
 <message>Hello</message>
 </status>
 <status id="3">
 <message>Goodbye</message>
 </status>
</statuses>

```
into JSON like this:

```

[ 
 { id: "1", message: "Hello" }, 
 { id: "3", message: "Goodbye" } 
]

```
Keeping that same idea in mind, let’s look at the output of a common Unix utility, ifconfig:

```

dan@X200:~/$ ifconfig
eth0 Link encap:Ethernet HWaddr 00:1f:16:15:2e:b1 
 UP BROADCAST MULTICAST MTU:1500 Metric:1
 RX packets:0 errors:0 dropped:0 overruns:0 frame:0
 TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
 collisions:0 txqueuelen:1000 
 RX bytes:0 (0.0 B) TX bytes:0 (0.0 B)
 Interrupt:20 Memory:f2600000-f2620000 

lo Link encap:Local Loopback 
 inet addr:127.0.0.1 Mask:255.0.0.0
 inet6 addr: ::1/128 Scope:Host
 UP LOOPBACK RUNNING MTU:16436 Metric:1
 RX packets:550973 errors:0 dropped:0 overruns:0 frame:0
 TX packets:550973 errors:0 dropped:0 overruns:0 carrier:0
 collisions:0 txqueuelen:0 
 RX bytes:70904676 (70.9 MB) TX bytes:70904676 (70.9 MB)

```
I’d like to turn this into something like the following:

```

[ 
 { "Link encap": "Ethernet", "RX packets": "0" }, 
 { "Link encap": "Local Loopback", "RX packets": "550973" } 
]

```
As a first approximation a template for the above transformation would look something like this:

```

[ "\n\n", {
 "RX packets": /RX packets:([^\s]*)/,
 "Link encap": /Link encap:([^\s]*)/ 
} ]

```
I have a little proof-of-concept code that works using the above template, but I’m thinking that the template format could be improved. It seems like a bit much to ask to produce such ugly regular expressions for the template selectors.

Also, maybe we’d want support for a hash object instead of an array. This is something that Jath can’t really do and I never thought about supporting it before. That is, the result collection might look like this:

```

{
 "eth0": { "Link encap": "Ethernet", "RX packets": "0" }, 
 "lo": { "Link encap": "Local Loopback", "RX packets": "550973" } 
}

```
Maybe a template format for a hash like this is some kind of glob-style expansion for the key name:

```

{ "/\b(.+?)\b[\S\s]*\n\n"/g: {
 "RX packets": /RX packets:([^\s]*)/,
 "Link encap": /Link encap:([^\s]*)/ 
} }

```
The regular expression for finding the keys is a little rough in this case. In order to make this work we are relying on a global regex that we can keep calling exec() on to find the next match until they are exhausted. We only want the capture group, so this would look something like the following:

```

while( var res = re.exec(input)[1] ) {
 push returnval( res );
}

```
This stuff is rough for the moment, but I think it could be an interesting way to process arbitrary textual command output in a declarative way by mostly re-using existing solutions like regular expressions.
