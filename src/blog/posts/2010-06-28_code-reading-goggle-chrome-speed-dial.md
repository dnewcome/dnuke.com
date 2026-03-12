---
title: "Code reading: Google Chrome Speed Dial"
date: 2010-06-28T17:24:41-05:00
---

# Code reading: Google Chrome Speed Dial

I’m thinking about starting a new series of posts where I write a few interesting details about some source code that I’ve read recently. From time to time I come across something unexpected or noteworthy, and in any case I put it in my [notes](http://www.ubernote.com) — so why not post it up here?

On a lark, I did a ‘view source’ on the Google Chrome Speed Dial page that comes up when you first start up the browser. I figured that it was a web app, but I didn’t realize that they had so much custom code in there. For those of you who don’t use Chrome, the speed dial page is a (shameless) rip-off of the Opera speed dial page and looks something like the following:

![\1](/images/2010-06-28_code-reading-goggle-chrome-speed-dial_chrome-speeddial.png)

I’m not going to go into a ton of detail here, but there were two interesting things that I noticed within a minute of looking over the code. The first thing was that they had their own template engine that claims to have been inspired by “JSTemplate”, which I can only assume means the venerable [Trimpath](http://code.google.com/p/trimpath/wiki/JavaScriptTemplates) template engine.

```

/**
 * @fileoverview This is a simple template engine inspired by JsTemplates
 * optimized for i18n.
 *
 * It currently supports two handlers:
 *
 * * i18n-content which sets the textContent of the element
 *
 * <span i18n-content="myContent"></span>
 * i18nTemplate.process(element, {'myContent': 'Content'});
 *
 * * i18n-values is a list of attribute-value or property-value pairs.
 * Properties are prefixed with a '.' and can contain nested properties.
 *
 * <span i18n-values="title:myTitle;.style.fontSize:fontSize"></span>
 * i18nTemplate.process(element, {
 * 'myTitle': 'Title',
 * 'fontSize': '13px'
 * });
 */

```
The second curious bit was a tiny html whitelist that walked the dom client-side and got rid of anything but a select few elements and attributes. Most whitelists are done server-side for obvious reasons (security) but it really illustrates how simple it can be if you have access to the html DOM.

The list of allowed tags is specified as an array:

```

var allowedTags = ['A', 'B', 'STRONG'];

```
They walk the DOM using a simple recursive function:

```

 function walk(n, f) {
 f(n);
 for (var i = 0; i < n.childNodes.length; i++) {
 walk(n.childNodes[i], f);
 }
 }

```
Which is called like this:

```

walk(df, function(node) {
 switch (node.nodeType) {
 case Node.ELEMENT_NODE:
 assertElement(node);
 var attrs = node.attributes;
 for (var i = 0; i < attrs.length; i++) {
 assertAttribute(attrs[i], node);
 }
 break;
 
 case Node.COMMENT_NODE:
 case Node.DOCUMENT_FRAGMENT_NODE:
 case Node.TEXT_NODE:
 break;
 
 default:
 throw Error('Node type ' + node.nodeType + ' is not supported');
 }
 };

```
There is some supporting code such as the ‘assertElement()’ and ‘assertAttribute()’ functions, which I won’t repeat here, but overall it’s very simple.

They go on to implement their own drag-and-drop functionality that looks a lot like jQuery, but isn’t. Actually there are a few jQuery-looking constructs here but I don’t see any evidence of jQuery itself. Maybe Google doesn’t want to use it now that it is [shipping with .NET](http://weblogs.asp.net/scottgu/archive/2008/09/28/jquery-and-microsoft.aspx)?

As a bonus, I’ll note that the thumbnails are generated in a manual way from a chunk of HTML in the page. The template looks like this:

```

 <div id="most-visited"> 
 <a class="thumbnail-container filler" tabindex="1" id="t0"> 
 <div class="edit-mode-border"> 
 <div class="edit-bar"> 
 <div class="pin"></div> 
 <div class="spacer"></div> 
 <div class="remove"></div> 
 </div> 
 <span class="thumbnail-wrapper"> 
 <span class="thumbnail"></span> 
 </span> 
 </div> 
 <div class="title"> 
 <div></div> 
 </div> 
 </a> 
 </div> 

```
And the code looks like this:

```

 <script> 
 (function() {
 var el = $('most-visited');
 if (shownSections & Section.LIST) {
 el.className += ' list';
 } else if (!(shownSections & Section.THUMB)) {
 el.className += ' collapsed';
 }
 
 for (var i = 1; i < 8; i++) {
 el.appendChild(el.firstElementChild.cloneNode(true)).id = 't' + i;
 }
 
 applyMostVisitedRects();
 })();
 </script> 

```
As you can see from the line

```

 el.appendChild(el.firstElementChild.cloneNode(true)).id = 't' + i;

```
this is a pretty bare-metal approach to generating the page content. More power to them, but then, they have the luxury of knowing that they are only running in the Chrome browser environment.
