---
title: "Front-end trends"
date: 2018-01-15T11:48:57-08:00
url: https://newcome.wordpress.com/2018/01/15/front-end-trends/
id: 2653
categories: Uncategorized
tags: 
---

# Front-end trends

The last few years have seen an incredible acceleration in the JS and general front-end ecosystem. However, the more things change, the more that they stay the same. The general problem that the Web is solving is still the promise of write-once run most places in some compatible way and without pre-installation. The paradigm is so strong that even native app development is trying to get in on the action.

In the last few months I’ve been involved with a production React Native iOS app and a Chrome extension and a “regular” React JS app. Javascript is everywhere and the tooling has become so fluid that we end up with new tools and best practices between projects only months apart.

When I was working on the Yahoo homepage, the decision to use React had just been made. The Media organization did a full turn to embrace it. The Web framework being used was called Touchdown. The “old” touchdown used Jade templates believe it or not. This had been pretty cutting edge only a year or two ago. Since we had control over this framework we went full steam into converting everything to use React.

However, there were a few old-timers around still that would just open up debugging tools or run things through a proxy and point out all of the issues we were ignoring about page weight, multiple requests, slow rendering, web fonts, and a litany of other issues. This is the old school web. The browser makes requests. CSS comes down the wire. Things block. JS is parsed. Rendering happens. Repaints, reflows, DOM thrashing.

React was created to solve a problem. The problem was how to make rendering UI based on data mutations predictable and easy. That’s really it. It didn’t tackle any of these other issues of content delivery or page performance other than to make disposing and updating DOM very fast and efficient. Effectively re-render for (almost) free. There were some leaks in this abstraction that could be patched manually with things like ShouldComponentUpdate.

Already there are serious competitors to React like Vue and Marko. Web Components have been on the horizon for some time now. We will likely learn the lessons of react and move on.

The JS ecosystem can be likened to learning how to learn or designing a process to produce and artifact faster rather than producing the actual artifact. Babel is ubiquitous so we are transpiling our code everywhere. I wonder if JS is even going to remain. Once browsers support a more general virtual machine and we transpile our JS to that VM, nothing is stopping us from replacing JS wholesale in this ecosystem.

Which brings me back to my initial point. The more things change the more they stay the same. Web front end has nothing to do with JS specifically. It’s HTTP requests and assets. DOM and styling. Browser rendering engines.
