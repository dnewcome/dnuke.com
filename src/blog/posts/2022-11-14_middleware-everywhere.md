---
title: "Middleware everywhere"
date: 2022-11-14T16:38:02-08:00
---

# Middleware everywhere

I’m a huge fan of composition via middleware. Some people call them plugins, as we did back when I was working on Ubernote. We had plugins for all sorts of things. The only thing you need is a stable API and a default way of invoking things.

This turns out to be important later when considering how to do things in the Node/Express ecosystem. Express doubled down on plugins and I think it worked out pretty well. React has something now called Hooks which I think of in a similar way. It’s a way of plugging behavior into the page render flow without relying on fixed page lifecycle methods. Page lifecycles are a pain. It’s one of my worst memories of ASP.NET (`viewstate`, etc) and initially React had a similar pain with things like `componentWillRender`.

My current role involves a large Ruby codebase. I’m not as familiar with that ecosystem yet and I was reading some code that used an HTTP library called [Faraday](https://lostisland.github.io/faraday/middleware/). Recently a co-worker was walking me through some code that used this library and I commented on having seen it and noted that it must be like `requests` or similar. 

Well, it is, but it has some pretty neat features like… plugins! So we can do things like OAuth token refreshes in the client middleware. Pretty cool. Middleware everywhere.
