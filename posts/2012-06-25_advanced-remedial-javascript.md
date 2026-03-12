---
title: "Advanced remedial Javascript"
date: 2012-06-25T11:25:48-08:00
url: https://newcome.wordpress.com/2012/06/25/advanced-remedial-javascript/
id: 1655
categories: Uncategorized
tags: 
---

# Advanced remedial Javascript

I’ve been using bits of code written by Douglas Crockford for years now. As you may know, as author of “Javascript: The Good Parts” he is quite opinionated about the language. 

Crockford refers to some of these concepts as “remedial” Javascript. On one hand, yes, we are dealing with the most basic concepts of the language, but they can be a little tricky and easy to forget or misunderstand so I like to call them “advanced remedial” concepts.

I tend to have strong opinions about these things as well. There is one place where I have quite a conflicted opinion, and that is with the typeof operator.

I really like to use the native facilities of the language where possible, not just in Javascript, but in any language. It’s great to have a library of higher-level abstractions, but base language features like inheritance and type checking are things that I like to leave alone if possible. 

Fortunately, simple prototype chaining is enough to handle inheritance for the bulk of my work, but deficiencies inherent in the typeof operator are really difficult to work around.

I’ve been using a one of Crockford’s functions, typeOf, published as part of his Javascript recommendations. As useful as it is, I have a need to identity another type that isn’t covered by default here: the RegExp (regular expression) object.

The problem with RegExp is similar to the problem with Array checking – typeof identifies them both as “object”. I added support for this using the instanceof operator, which is able to identify a regular expression. Crockford prefers property checks for arrays, so I might be missing something here. Alternatively, we could check for the exec() function and assume that we aren’t checking for something that also happens to have a function called exec.

I’m sure this isn’t the last word on finding regular expressions, so I’ll publish this as a work in progress, although I’m using this in several of my own projects now.

```

function typeOf( value ) {
 var s = typeof value;
 if( s === 'object' ) {
 if( value ) {
 if (typeof value.length === 'number' &&
 !(value.propertyIsEnumerable('length')) &&
 typeof value.splice === 'function') {
 s = 'array';
 }
 else if ( value instanceof RegExp ) {
 s = 'regexp';
 }
 } else {
 s = 'null';
 }
 }
 return s;
}

```
It is possible to “fool” (if you want to call it that, in many cases it would probably be correct behavior anyway) this method by subclassing RegExp, but it seems unlikely that this would be an issue in practice.

I didn’t see any tests published with the original typeOf, so to make sure I didn’t break anything I wrote some tests that cover the nominal cases and negative cases.

```

/*
* Run test with qUnit
*/
test("test-typeof", function() {
	tst( [], 'array' );
	tst( {}, 'object' );
	tst( "", 'string' );
	tst( 1, 'number' );
	tst( function(){}, 'function' );
	tst( /x/, 'regexp' );

	function tst( obj, type ) {
		var types = [ 'string', 'array', 'object', 'number', 'function', 'regexp' ];
		types.forEach( function( item ) {
			if( item == type ) {
				equal( type, typeOf( obj ) );
			}
			else {
				notEqual( item, typeOf( obj ) );
			}
		} );
	}
});

```
I didn’t publish this separately on GitHub since it was so small so I’m publishing it here on my blog. I might try to publish a set of JS utilities including this one, but my feelings toward those types of personal util projects is mixed. Many times I see some open source project that makes extensive use of something like mikes-utils or something similar. As projects mature these are nearly always factored out anyway.

I’d like to embrace extreme composability, maybe mixing 10s or 100s of single methods together to make a dynamically configured library, but I haven’t seen any tools for making that happen reliably.
