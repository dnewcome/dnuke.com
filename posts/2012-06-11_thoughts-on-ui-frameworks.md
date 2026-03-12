---
title: "Thoughts on UI frameworks"
date: 2012-06-11T12:35:04-08:00
url: https://newcome.wordpress.com/2012/06/11/thoughts-on-ui-frameworks/
id: 1632
categories: Uncategorized
tags: 
---

# Thoughts on UI frameworks

I was playing around with [Node-qt](https://github.com/arturadib/node-qt) recently to see how difficult it would be to do a native-UI app using Javascript. I’m thinking of something along the lines of the [Leo outliner](http://webpages.charter.net/edreamleo/front.html) which was done with Python and [QT](http://qt.nokia.com/products/). I’m kind of interested in how using Javascript as a scripting language would look in something like Leo.

Once I started digging around in QT I realized that there were some controls that I’d need to extend, like the [QTreeWidget](http://doc.trolltech.com/4.0/qtreewidget.html), which weren’t exposed in the Node-QT API. I’d have to first extend the API for this widget and then dig in and write some C++ to create my custom version of it.

This got me thinking that while it is nice to have dynamic language bindings for a well-defined native library, I don’t think the paradigm works that well for all domains. If you need to parse XML, pretty much any task you can think of can be performed using the fixed API of something like [libxml2](http://www.xmlsoft.org/). You probably won’t find yourself wanting to extend the library to do anything specific, you’d do that in the client code. Same thing with libpcre or something like that. 

UI frameworks seem to be a whole different animal. You are lucky if you can get away with just using some standard buttons and input boxes, but for any nontrivial app, I’ve found that you are going to need probably one custom control in order to make the app UI seem polished.

Most (all?) UI frameworks allow the extension/composition/creation of its controls or widgets. Sometimes there is a control that is close enough to what you want that you can subclass it, but many times you end up drawing it yourself using some combination of a low-level drawing API (GDI+ anyone?) and image files.

Further, there is the issue of which UI framework to use. Cross platform development and native look-and-feel are at odds with one another, and some cross-platform frameworks (Swing comes to mind) just wrap the native UI elements for the platform. This is good for getting the app to look like a native app on a platform, but unfortunately it represents kind of an uncanny valley of look-and-feel. Yes, it uses native widgets, but something just seems a little bit off.

Taking things further, we might want to think about mobile devices. QT and [WXWidgets](http://www.wxwidgets.org/) are available on mobile devices also, and probably many others. Each mobile platform also has a native set of widgets. How do you decide which way to go with the UI?

Lately I’ve started just punting when it comes to deciding anything native. I’m usually doing most things as JS/HTML and then just loading it in a web widget, which most platforms have. However I’m seeing things like [QT’s QML](http://en.wikipedia.org/wiki/QML), which is a Javascript-based widget modeling language. This brings us around full-circle on Web apps vs native apps. For apps that don’t require any custom widgetry, I supposed you could just duplicate the UI for many simpler apps. But once you have some investment in custom controls, does it make sense to just use HTML and share it between platforms?

I’m not too sure about this yet. I think I’m going to abandon the idea of using any native UI toolkit for my outliner experiment.
