---
title: "Building mesh abstractions"
date: 2012-03-27T22:58:42-08:00
---

# Building mesh abstractions

I’ve had a concept rattling around in my head for a while but I haven’t quite found the right way to describe it yet. The closest that I’ve come is the concept of a mesh as a metaphor.

Abstractions are a tricky thing in that they are never perfect. In some cases we try to make them a completely airtight layer over what we are trying to simplify. In the worst case we have some gaping holes that just don’t map well into our desired solution space. In other cases we just concentrate on some small area of the problem that is the most painful.

### Frameworks and Libraries

The first extreme we generally call frameworks. They are some constructed worldview of the problem space that is given in order to try to fit everything into its place according to that view. Web frameworks, for example, have some abstractions around the request/response model, probably parsing HTTP headers for us and providing ways to set response codes. The problem with frameworks, especially ones that try to do everything, is that if you need to do something that the author didn’t think of, we have to hack some kind of workaround. In the best case, if the framework is particularly well designed, we might have a plugin or module system that we can use to extend things to do what we need. In the worst case, there may be a bunch of sealed-off code standing in the way of getting what you want (usually only the case with proprietary precompiled code). Either way, you have to dig in and learn how to mold your code to the framework designer’s worldview.

On the latter extreme we have libraries that provide some focused functionality that we can pull in to solve a particular problem. If the library doesn’t do what we want, we can pick a different one or hack/write our own. This second case is mercifully becoming more standard as the call for better software composability is going out wider in the developer community. Sites like [microjs](http://microjs.com/) make it easy to find small libraries that work together.

### Another way?

As a result of a recent project that I’ve been working on, namely the [Donatello HTML/CSS drawing API](https://github.com/dnewcome/Donatello), I’ve begun to think of some abstractions as more of a mesh rather than a framework or library. A mesh abstraction is intentionally and uniformly leaky, like a wire screen. Like a framework, there are plenty of guide wires to use when you need them, but you know that you can easily look down through the mesh – it has substance, but it is transparent and porous.

One of my goals for Donatello was to make it easy to leverage the power of CSS and HTML for drawing graphics in the browser. CSS is powerful as a graphics language, but I felt like it took too much effort to get the results I was looking for. I wanted to augment the power of CSS without obscuring it. Another goal was to leverage existing tools for things like animations and event handling. I didn’t want to address these tangential concerns that are better served by other existing tools.

Taking cues from jQuery and Raphael, I conceptualized a lightweight layer that handled the creation of drawing primitives rendered using CSS-styled HTML elements. Like jQuery and Raphael, you have full access to the underlying DOM elements at any time, and Donatello will get out of your way. However, like the wires in the mesh, the library provides SVG-like drawing attributes such as “fill” and “stroke” that map down to the appropriate CSS elements. Using the same API, any CSS property may also be directly applied. I’ve begun thinking of this as going down through the holes in the mesh. You get a more direct way of approaching a problem without completely going underneath the abstraction, which would be getting the underlying node and directly setting the property.

This may seem like a subtle difference but I think it’s important. The mesh augments the use of the underlying technology and at the same time offers consistency with the abstraction. Like a designer’s template, the mesh serves as a guide without forcing you to abandon it completely if something doesn’t quite fit between the lines.
