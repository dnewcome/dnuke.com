---
title: "The future of Web development isn&#8217;t MVC, it&#8217;s MVM"
date: 2012-04-14T02:32:44-08:00
url: https://newcome.wordpress.com/2012/04/14/the-future-of-web-development-isnt-mvc-its-mvm/
id: 1614
categories: Uncategorized
tags: 
---

# The future of Web development isn&#8217;t MVC, it&#8217;s MVM

When Ruby on Rails hit the Web development world in 2005, it changed everything practically overnight by bringing a pattern rooted in Smalltalk to the Web. I’ve been playing with the recently-released [Meteor](http://www.meteor.com/) Web framework and I think that an important and equally momentous shift is taking place in the Web world.

### It started with Node.js

More recently, [Node.js](http://nodejs.org/) changed everything again with the idea that the Web could evolve beyond the model where every request/response pair was fully cached on the server before processing was complete. Unfortunately for all of the interesting new possibilities that Node offered it was pretty low-level if you were coming from a mature Web framework.

Node allowed you to write Web services that were difficult or impossible to write previously. Streaming services that made long-running connections and broadcast-style chat apps became trivial to write instead of requiring lots of tweaking and custom server configurations.

However the power that made writing the average chat application easy made doing a Rails-style application tedious. Frameworks like [Express](http://expressjs.com/) came on the scene letting you develop with a more Sinatra-style API, making doing RESTful applications fairly easy. However, I don’t think using Express on its own really harnessed the power of what Node was capable of. Sure, if you needed some server-push goodness it was trivial to drop in Socket.IO, but then you could have used a hybrid solution, using Node for just the server push parts.

### Classic MVC on Node – barking up the wrong tree

Those of us interested in building data driven single-page applications noticed that we were building complex object models in Javascript on the client. The classic MVC pattern just didn’t map well to doing this. Libraries like Backbone.js became a popular way of creating a client-side Javascript collection that mapped to a RESTful API on the server, creating a MVVM-style (Model-View-Viewmodel) development model.

At this stage the more observant of us might have noticed that if we were using Node.js on the server, we had the same language running everywhere and were doing a lot of work on the client just to model what we already had on the server in the same language with two impedance mismatches along the way.

Let me explain what I mean about impedance mismatches. When we write an data-centric application we start with some data. That data is going to be stored somehow, probably in a document store or relational database. On the server we have some query language for retrieving what we want. This is the first mismatch, which is commonly handled by an ORM (Object-relational mapper).

The second mismatch is the mapping of the individual data queries to an API. All of the CRUD calls get mapped onto URLs and HTTP verbs in some way that probably loosely resembles a REST API.

### Why Meteor is a game-changer

When I first looked at Meteor I was trying to figure out where the server-side controller code was running on one of the sample projects. When I looked at the server code I was surprised that there wasn’t really anything there except a pair of MongoDB collection definitions. Meteor provides an ORM layer that loosely mirrors the Mongo query API. The thing is, this full API is available directly on the client. When we want to query our data store, we can do it transparently from the client-side data models.

Simply put, Meteor does for data what Rails did for template based Web sites. Templating is still an important part of what Meteor provides, but those templates are bound transparently to data collections. Templates re-render implicitly when data changes. This stuff works out of the box by default with no extra configuration, just like that first magic moment when you saw rails do form-based CRUD on a data record with almost no custom code.

So, I’m thinking of what Meteor does as MVM (Model-View-Mapper). There is still a model in my mind, which is essentially a viewmodel since they are created largely to support the bound views. I’m thinking what would have been the controller in an MVC model has actually been replaced by some ORM code that supports what the views need to display the data.

I’m going to be refining my understanding of Meteor during the course of a new project I’m working on, so perhaps my mental model will change from what I’ve described here, so I encourage you to check out Meteor and let me know what you think in the comments.
