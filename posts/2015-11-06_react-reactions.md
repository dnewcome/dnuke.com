---
title: "React reactions"
date: 2015-11-06T13:46:16-08:00
url: https://newcome.wordpress.com/2015/11/06/react-reactions/
id: 2492
categories: Uncategorized
tags: 
---

# React reactions

One of my [past articles](https://newcome.wordpress.com/2012/04/14/the-future-of-web-development-isnt-mvc-its-mvm/) commenting on the future of Web development has gotten consistent traffic in the years since I wrote it, and now I feel the need to follow it up because I think I was way off about a few things.

Just to be clear up front, Reactjs is eating the Web when it comes to front-end development. I’m aware that Angular and Emberjs hold sway in many shops, but I think that the virtual DOM model that react is based on will eventually become a standard way of dealing with front-end Web development.

Most frameworks and methodologies in the past have centered around data binding or observers of some sort to implement some variant of the MVC stack. React really just implements views. The difference is that the views are much simpler than the average MVC view (in which case the view really has some complicated state-management code along with it that makes it more like a view+viewmodel to handle updates to its state).

React views still have state, but the view is re-rendered fully every time the state changes, rather than having some kind of JS functions for things like adding/removing items from a list. This fact makes the nuts and bolts of keeping a dynamic view up to date trivial. No sequence of add/remove/updates need to be tracked in order to manipulate the DOM into the state needed to accurately reflect the current application state.

This isn’t without its problems though, since many things in the DOM don’t like to be manhandled (iframes). Also, React basically has full control of your DOM. If you don’t want React to mess with something on the page, you are out of luck unless you want to put it outside of the React render tree.

Apart from views, the Reactjs model is a little more ambiguous. Facebook prescribes the Flux architecture, which essentially leaves everything up to you other than the enforcement of single-direction data flow.

I’m going to save Flux for another article, but just to give you a teaser I think that functional programming is finally winning. Neckbeard nerds have been blabbing about functional forever now (I love me some Clojure) but I think that when the tide turns (as it has) away from Ruby-style mixins to higher-order components we are going to see things really starting to shift.
