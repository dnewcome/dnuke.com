---
title: "Observations about Javascript performance"
date: 2010-09-07T08:25:51-05:00
url: https://newcome.wordpress.com/2010/09/07/observations-about-javascript-performance/
id: 1120
categories: Uncategorized
tags: 
---

# Observations about Javascript performance

I just posted my [js1k](http://js1k.com/demo/685) entry, and while I was doing the final rain dance of getting things down to 1024 bytes and testing in all of the major browsers (with the notable exception of IE) I noticed a few things about performance in the different browsers.

**1) Javascript object allocation in Firefox is slower than the rest of the browsers.** My fractal rendering code uses my own little complex number class that is just a tiny object that has two numbers as members. Here is the code:

```

function Complex( re, im ) {
	this.re = re;
	this.im = im;
}

```
This looks like no big deal, and in Google Chrome, Opera, and Safari, it wasn’t. In Firefox, however, creating a new instance of this type was a big performance hit. Operations like complex multiplication create and return a new instance of the complex number type, so you can imagine that since we perform these operations 100s of thousands of times in the course of rendering a single image, this can be a major drag. Here is a sample of the calling code:

```

function ComplexMult( a, b ) {
	return new Complex( 
		( a.re * b.re ) - ( a.im * b.im ),
		( a.re * b.im ) + ( a.im * b.re )
	)
}

```
Performance is much better if we rewrite the code to reuse one of the arguments as the return value, but I couldn’t do this for every case, since sometimes I needed the unmodified argument later in the calling function. I’m curious to know if creating several temp instances would help. I haven’t had the time to experiment with it, but something like this could help:

```

function ComplexMult( a, b, ret ) {
 ret.re = ( a.re * b.re ) - ( a.im * b.im );
 ret.im = ( a.re * b.im ) + ( a.im * b.re );
 return ret;
}

```
This makes the calling code kind of ugly but maybe it would be worth the performance gain in Firefox.

**2) Reducing object member access really does make an impact if it happens enough times in a loop.** The color cycling code in my js1k submission accesses the image data and increments the color values. Here is what the code looked like before:

```

function cycle() {
	for( var i=0; i < imgd.data.length; i+=4 ) {
		imgd.data[ i ] = ( imgd.data[ i ] + colorstep ) % 256;
		imgd.data[ i+1 ] = ( imgd.data[ i+1 ] - colorstep ) % 256;
	}	
 ...

```
Removing all of the ‘.data’ lookups gave me a pretty nice speed boost when rendering the next color-cycled frame:

```

function cycle() {
 // save results of lookup in 'idd'
 var idd=imgd.data;
	for( var i=0; i < idd.length; i+=4 ) {
		idd[ i ] = ( idd[ i ] + 1) % 256;
		idd[ i+1 ] = ( idd[ i+1 ] - 1) % 256;
	}	
 ...
}

```
I’ll confess that I optimized this accidentally while trying to get my code down to 1024 bytes. ‘idd’ is quite a bit shorter than ‘imgd.data’!

**3) Use the canvas ImageData API when working with pixel data.** This should seem obvious, but when I was first rendering images, I was using the drawing API to render single-pixel rectangles using context.fillRect():

```

// slow
function drawPoint( x, y, context ) {
	context.strokeStyle = "black";
	context.strokeRect( x, y, 1, 1 );
}

```
I don’t have the profiler stats handy, but filling up an ImageData object and writing it to the canvas was much faster:

```

// fast
function drawPoint( x, y, imgdata ) {
	var index = ( x + y * 500 ) * 4;
	imgdata[ index ] = 0;
	imgdata[ index+1 ] = 0;
	imgdata[ index+2 ] = 0;
	imgdata[ index+3 ] = 255;
}

```
Sorry I don’t have the profiler traces, but I just wanted to put a few thoughts out there as I was thinking about this stuff. Hopefully this helps out any would-be Javascript demo writers.
