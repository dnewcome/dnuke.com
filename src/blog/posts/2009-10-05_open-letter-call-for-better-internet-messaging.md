---
title: "Open letter: call for better internet messaging"
date: 2009-10-05T01:00:00-05:00
---

# Open letter: call for better internet messaging

I have been frustrated by email more times than I can count, both as a user and as a developer.  And I know I’m not the [only one](http://lamsonproject.org/).

As a developer, I’m always running into issues like character encoding standards and multipart mime formatting issues.  Anyone who has ever written any sort of service that processes email can attest to the fact that you never know what kind of malformed garbage you might get masquerading as valid email.  Add strange and obsolete encoding standards for the actual message body (quoted-printable anybody?) and you’ve got a certain recipe for disaster.  And the format of the messages themselves is just the beginning.  A simple text-based protocol made sense in the early days of the internet, but now there is too much black magic required to fully conform to all of the ways that email has been extended over the years.

As a user, I have tons of data locked up in email that is hard to search and manipulate.  Each email provider has its own interface, and even though standards like POP and IMAP give you access from other clients, there are inconsistencies in which protocols are implemented by which providers and all too often, things like folders won’t be available.

New services like Google Wave are great, but I think that the simple needs have taken a back seat to flashy realtime indulgences.  Don’t get me wrong – I have been using Wave since early in the beta program, and I’m extremely excited and impressed by what they have accomplished, but really what I need is better email, not better instant messaging.  I have plenty of ways of needling everyone with status, presence and other ephemeral communication.  Twitter has been purposed for lightweight commenting and messaging on blogs and user forums, but lets take it just a little bit further and allow ourselves to decentralize it and use it like email.

Why can’t we have a simple, decentralized way of sending messages on the net?  I’m envisioning something that has a simple and universal REST interface for retrieving and storing messages. Let’s just admit that HTTP has been far and away the protocol of choice on the net and just embrace it fully for messaging.

Here is the deal: anyone can use whatever fancy-pants client that they want with this email standard, just the same way that anyone can use the web browser of their choice for browsing the web.  At the same time, there is a standard web-friendly way of indexing, sending, and receiving messages.  The key phrase here is ‘web friendly’. I don’t want to rely on the email server for searches and folders and whatever kind of additional functionality I may desire. We can layer this functionality on top of the basic service if we want to.  Using HTTP opens the door for authentication mechanisms such as OpenID and would even allow us to delegate permissions and tasks using OAuth.  I could see Atom becoming the universal messaging format for the web. Google is already using it in all of their [GData APIs](http://code.google.com/apis/gdata/) (YouTube, Calendar API, Contacts API, and so on) and even Microsoft, who tried to publish their own [competing standard](http://dev.live.com/livedata/web3s.htm) at first, ended up [going with it](http://dev.live.com/blogs/devlive/archive/2008/02/27/213.aspx).
