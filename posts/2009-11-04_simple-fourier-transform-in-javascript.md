---
title: "Simple Fourier transform in Javascript"
date: 2009-11-04T11:33:12-05:00
url: https://newcome.wordpress.com/2009/11/04/simple-fourier-transform-in-javascript/
id: 497
categories: Uncategorized
tags: 
---

# Simple Fourier transform in Javascript

I’m gearing up to do some signal processing stuff, and I thought it would be good to brush up a little on some of the mathematical concepts. I’m very familiar with the uses of the various transforms including the Fourier. However, although I’ve used others’ implementations of the FFT algorithm, I’ve never attempted to write my own.  The code shown here is a naive implementation (ie non-FFT – we don’t do the ‘butterfly’ method of successive reduction of the input) of the Fourier transform.  This code is for illustrative purposes — you probably won’t want to use this in any real code, since it will be very slow compared to something that uses the FFT method.  Note that this is probably the simplest code that I’ve seen that does a Fourier transform. If you see anything even simpler than this around on the net, let me know.

```

function fourier( in_array ) {
 var len = in_array.length;
 var output = new Array();

 for( var k=0; k < len; k++ ) {
 var real = 0;
 var imag = 0;
 for( var n=0; n < len; n++ ) {
 real += in_array[n]*Math.cos(-2*Math.PI*k*n/len);
 imag += in_array[n]*Math.sin(-2*Math.PI*k*n/len);
 }
 output.push( [ real, imag ] )
 }
 return output;
}

```
