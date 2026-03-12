---
title: "React Native"
date: 2017-05-15T14:13:11-08:00
url: https://newcome.wordpress.com/2017/05/15/react-native/
id: 2539
categories: Uncategorized
tags: 
---

# React Native

I’ve started a major [React Native](https://facebook.github.io/react-native/) app recently after doing a bunch of “regular” react stuff. I had pretty early access to React Native when it first came out, but really didn’t check back in on it until I started using it in earnest recently. It turns out I had some preconceptions about it that aren’t really accurate and I thought it would be interesting to talk a little bit about that here.

**Write once, run anywhere**

We’ve heard this one before. The first for me was Java applets, but some form of this narrative seems to pop up in different forms over and over. The Web is pretty close to this but it’s more like “write once run most places sort of”, which is honestly a little bit better than “write once crash and do nothing in 10% of target environments”.

How does this relate to React Native? Well, in the back of my mind I thought of the project this way. Write React components and use them on mobile and the Web. Well, it doesn’t take long to realize that there are no divs in React Native. In fact apart from the same jsx syntax, the components are all different. What about CSS? That’s there sort of, with slightly different attribute names. Oh and layout is centered (no pun intended) around flexbox.

**Components and Composition**

Ok, this one I actually had right. The basic ideas around composing an interface translate pretty well, just without much ability to share components between Web and native.

**Navigation**

Getting from screen to screen is totally different using [React Native’s own navigation components](https://facebook.github.io/react-native/docs/navigation.html). This makes sense since the target is different, but again, it’s a major difference between a Web app done in React and a React Native app. Apparently react-router now supports React Native as well but from my cursory looks it’s not clear how standard app navigation transitions work in that context.

That’s it for now. I’ve been super busy lately but more React Native stuff to come.
