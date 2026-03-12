---
title: "Meteor, magic and n-tier applications"
date: 2012-06-11T14:56:50-08:00
url: https://newcome.wordpress.com/2012/06/11/meteor-magic-and-n-tier-applications/
id: 1635
categories: Uncategorized
tags: 
---

# Meteor, magic and n-tier applications

I’ve been shouting about how cool Meteor is recently, but as I’ve been using it I’m wondering about a few things. 

 As was pointed out by someone else in a blog post (which I can’t find at the moment), Meteor is essentially allowing us to go back to writing 2-tier applications like we did when client-server applications were de rigueur. For example, a line-of business application that ran on a workstation but connected directly to an Oracle database without any service layer in between.

The immediacy of this programming method was nice in the beginning, but once we had to deal with schemas and business logic, and mixing various versions of application APIs we learned that this is a pretty hairy maintenance issue brewing. The data lasts a long time in an organization, and new applications are generally built on the data/schema over time.

Contrary to the current conventional wisdom database administration is a real issue and not a trivial thing once you have a lot of complex data. Things like NoSQL really do nothing to bail you out here, the reasons for which are fodder for another entire post. Assuming that you believe me that data maintenance and migration is a tough problem and that throwing NoSQL at it probably isn’t going to fix what you want it to fix, what do we do here?

In the past, before we started sticking Web services in all over the place, the next logical step was to create stored procedures that ran in the RDBMS itself. Now we can expose an API over the data, which is consistent with its schema and allows us to abstract somewhat the actual table structure. Some of these things would be views on steroids, and in more complex scenarios we can do mapping to/from legacy schemas.

If you know me, you know that I’ve always had mixed feelings about running code in the database. Databases are complex enough when you consider indexing and various constraints that are defined on the data. Once you have code running there that does things like create temp tables or iterate through cursors (fetching data) you have potential performance problems, that are far more delicate than looking at a single query in a query analyzer. The database is also notoriously hard to distribute (this is actually one place where NoSQL can be a big win, but only if your app is conducive to it.

Ok so that brings us to what I really want to talk about – Meteor.js and things like Socket.IO and Now.js. All of these frameworks are JS frameworks designed to make server push and pubsub style apps easy to do. The difference with Meteor though is that it is designed to abstract the service layer away completely. The database looks like it is local to the client code, and so we are essentially writing what looks like a standalone app with an embedded database from the client’s perspective. 

 This has some huge advantages in terms of rapid development and deployment but by obscuring the layers of the application it makes reusing the database and server-side code very difficult.

When I first looked at Meteor, I thought of it like a realtime Rails. If Rails is any indication, eventually Meteor will be flexible enough to handle pluggable backends via npm modules, support APIs, etc. Only time will tell. For now I’m having a hard time deciding whether I’m going to double down on using it or not.
