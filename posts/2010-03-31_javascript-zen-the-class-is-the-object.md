---
title: "Javascript zen: the class is the object"
date: 2010-03-31T10:23:48-05:00
url: https://newcome.wordpress.com/2010/03/31/javascript-zen-the-class-is-the-object/
id: 874
categories: Uncategorized
tags: 
---

# Javascript zen: the class is the object

I was reading Douglas Crockford’s book `Javascript: the Good Parts’ when I came across an example involving a parser that was seemingly unrelated to the section that it appeared in (Section 5.3, p51). I re-read the section and then looked at the example again, wondering how such an oversight could have occurred in this book, which had up until this point been impeccably organized.

I decided to look at the example in detail one last time before moving on when I was suddenly enlightened.

In the book, Crockford describes a situation in which he had vigorously defended his position that default fall-throughs on switch statements are useful, only to have someone report a bug in one of his projects the very next day involving just such a switch. In that moment he was enlightened and reversed his position.

In a similar way, I had been a proponent of using the `new’ operator with constructor functions for defining classes and instantiating objects (classical inheritance). However, my background has been in strongly-typed languages, so this is the way that I tend think about the subject. However, the more I use Javascript the more evident it is that you need to avoid trying to shoehorn other development methodologies into it and let it shine at what it does best: prototypal inheritance.

Here is the example from the book:

```

var block = function ( ) {

// Remember the current scope. Make a new scope that
// includes everything from the current one.

 var oldScope = scope;
 scope = Object.create(scope);

// Advance past the left curly brace.

 advance('{');

// Parse using the new scope.

 parse(scope);

// Advance past the right curly brace and discard the
// new scope, restoring the old one.

 advance('}');
 scope = oldScope;
};

```
