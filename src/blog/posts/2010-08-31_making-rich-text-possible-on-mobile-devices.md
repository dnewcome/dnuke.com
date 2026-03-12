---
title: "Making rich text possible on mobile devices"
date: 2010-08-31T19:40:43-05:00
---

# Making rich text possible on mobile devices

*This post is an overview of the techniques used in a rich text editor for mobile devices that I’m working on called [Richie](http://github.com/dnewcome/richie). I’m focusing on the iPhone first, followed by the iPad and other devices.*

As mobile devices evolve and increase in popularity I think we’ll be doing more of the things that we do on our laptops on mobile devices like tablets and mobile phones. Content generation activities like blogging and using rich internet applications will only become more common, and many of these things rely on browser-based rich text editors, which generally don’t work on mobile devices.

I’m not sure why there haven’t been attempts at porting current editors such as TinyMCE over to work with mobile platforms. The authors of these editors seem to be obstinately waiting for Apple and other manufacturers to support designmode so that their editors will work as currently implemented. It is possible that I didn’t search long enough, or perhaps the demand is lower than I think. Also, for all I know right now the whole problem may be harder than it looks from here (I haven’t thought about things like copy/paste yet).

However, in general many of the basic DOM techniques that these editors use for manipulating rich text elements (e.g. inserting lists, bold tags) will still work without designmode, but there are two significant challenges that must be solved first: manipulating the insertion point and capturing user input. Browsers that support designmode or contenteditable solve these issues for us, but lacking them, we can still make things work.

**Tracking the insertion point**

There are two basic ways that I have experimented with for managing the insertion point. The first was using an [HTML DOM range](https://developer.mozilla.org/en/dom:range). The second, which is used in the current implementation of Richie, uses a simple <span> element as the cursor. The main advantage of using a range is that it doesn’t interfere with the editor text, but the disadvantage is that unlike a DOM element, we can’t easily get its coordinates in order to display a visible cursor and is more difficult to keep positioned in the right place. Using a DOM element has the additional advantage of being visible if we want to use it as the cursor in the UI.

The html for the cursor would look like this for most mobile devices, or if we don’t need to capture keystrokes using a floating text box (as we will see later):

```

<span id="cursor">|</span>

```
For the iPhone, I used an empty span and used the native text input’s cursor as the cursor UI:

```

<span id="cursor"></span>

```
**Managing user input**

Traditional HTML rich text editors such as TinyMCE use key handlers for things like shortcut keys, but we take things a step further and use key handlers for every user input. Printable text characters are inserted into the DOM by the handler as textNode elements using HTML DOM methods:

```

function handleKey( evt ) {
 ...
 // other key handlers
 ...

 // if no other handlers apply, insert character at insertion point
 var text = String.fromCharCode( evt.charCode );
 var textNode = document.createTextNode( text );
 cursor.parentNode.insertBefore( textNode, cursor );

 repositionInputBox();
}

```
On a desktop browser, the key handlers would work at this point and our job would be complete. On a mobile device like the iPhone, the keyboard would still be hidden and we wouldn’t even be able to type. All we really need to do is add a text input control and focus it.

```

<input id="keyboardinput" type="text"/>

```
This will work, but in addition to confusing the user by having two places where text is being entered, the focus of the screen will center around the text input, which may not coincide with where the rich text editor is inserting text. To solve this I absolutely positioned the text box directly over the insertion point — in fact, from a UI perspective it *is* the insertion point.

```

#keyboardinput {
 position: absolute;
 background: none;
 border: none;
 width: 1px;
 ...
}

```
Every time a character is inserted or we otherwise alter the position of the insertion point, we need to reposition the input box over the cursor position with a little fudge factor to line it up perfectly:

```

function repositionInputBox() {
	keyboardinput.style.top = cursor.offsetTop - 2 + "px";
	keyboardinput.style.left = cursor.offsetLeft - 6 + "px";
}

```
I’m not an expert on Mobile Safari, so there are several bugs in this initial implementation of Richie related mostly to repositioning the cursor when deleting characters. Also, the approach I’m taking here may break down as I try to tackle things like copy/paste — I’m not sure how that is going to work yet. Please do drop me a comment if you have a chance to look at the code.
