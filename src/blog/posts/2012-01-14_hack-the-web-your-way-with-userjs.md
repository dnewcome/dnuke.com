---
title: "Hack the Web your way with userjs"
date: 2012-01-14T15:32:18-08:00
---

# Hack the Web your way with userjs

Few people realize how much their experiences on the web can be tweaked. Sure some savvy users can change the default font size and maybe block ads with an extension. However, the fact that the front-end code of any Web site or application is executed right in the browser makes it possible to intercept and tweak just about anything on the page, and even add functionality. This idea has been around for a long time, and many of you will remember using GreaseMonkey scripts. However browsers like Opera and Firefox have this ability natively now and it is really simple to get started with. Chrome can do the same thing, but you’ll have to install the script as an extension using the Chrome extensions mechanism.

I read the Hacker News site several times a day. Recently I’ve been getting annoyed with skimming over stories that I don’t care about each time I check the site. I figured that a good way around this was to treat the front page like an email inbox, and use the “one touch” principle to either read it or kill it. Or both.

So I fired up my favorite Web agent (Opera) and started fiddling around with the page. I started by writing some code to highlight a particular story, and then I wrote some code that let me move the selection up and down on the page. Once I had that working, I implemented code to remove the selection from the page entirely.

That was a good start, but what I really wanted was for the removals to be persistent – for them to be remembered for the next time I checked the site. To do this, I used HTML5 local storage to store the IDs of the stories that I didn’t want to see anymore. The next time the page loads, the code checks each story on the front page and removes it if it exists in the local store.

I’m still tweaking this script, but it has already saved me a ton of time and made my experience with the site tremendously better, so I thought I’d write it up now rather than later. If you are using Opera all you have to do is drop the code into your UserJS folder, which can be set in the user options dialog in the browser.

I’m going to expand this into a series of articles probably, creating a case study on tweaking the user experience of common web pages.

I’m posting the code here as it exists currently. If I end up hacking in support for more browsers I’ll put it on GitHub eventually.

```

// ==UserScript==
// @match news.ycombinator.com 
// ==/UserScript==

/***
 * User script for navigating Hacker News. Moving up and down
 * between stories uses vim key bindings j,k. Kill a story
 * and never see it again using x. Killed stories are tracked in 
 * HTML5 LocalStorage, so clearing it will bring back all stories.
 * Open c,enter browses to comments/link respectively.
 *
 * TODO: precache selected stories?
 * TODO: open stuff async in iframes?
 * TODO: remember highlighted position?
 * this makes it easier when browsing to read an article and then
 * hit the browser back button to return to HN
 * TODO: killfile - kill stories via regex, eg, no SOPA, etc.
 * TODO: abstract DOM traversals a bit more, move to functions
 *
 * other scripts that do this:
 * http://news.ycombinator.com/item?id=277099
 * http://www.hnsearch.com/search#request/submissions&q=hacker+bookmarklet&start=0
 * 
 * BUG: can't remove articles that have been voted up. Also affects
 * stories that are 'system' and can't be voted on.
 * BUG: browsing to articles that have been upvoted results in 
 * viewing the submitter's profile rather than the intended action
 * BUG: Voting a story up and then trying to browse to another story
 * results in trying to vote for the same story again.
 */

/**
 * Main 
 *
 * Set up key handler and run the kill process for stories that 
 * have been killed previously. Take care of highlighting the 
 * and setting the current row to the first visible story
 */
document.addEventListener( 'keypress', onKeydown, false ); 

// the row that is in focus for operations
var currentrow;

killstories();
currentrow = findFirstRow();
highlight( currentrow );

/**
 * remove items from the page when first loaded. We assume 30 items
 * per page. Look up the story id and see if it exists in the local
 * storage data.
 */
function killstories() {
	// start at the top
	currentrow = findFirstRow();

	for( var i=0; i<30; i++ ) {
		var killrow = currentrow;
		moveDown();
		var id = killrow.getElementsByTagName( 'a' )[0].id;
		var item = localStorage.getItem( id );
		if( item ) {
			console.log( 'removing ' + id );
			removeRow( killrow );			
		}
	}
}

/**
 * Dumb item traversal functions that just jump up or down
 * 3 <tr>s at a time, highlighting the proper element
 */
function moveDown() {
	unhighlight( currentrow );
	currentrow = currentrow.nextSibling.nextSibling.nextSibling;
	highlight( currentrow );
}
function moveUp() {
	unhighlight( currentrow );
	currentrow = currentrow.previousSibling.previousSibling.previousSibling;
	highlight( currentrow );
}

/**
 * Abstract the act of highlighting and unhighlighting
 * a DOM element somewhat
 */
function highlight( el ) {
	el.style.backgroundColor = 'white';
}
function unhighlight( el ) {
	el.style.backgroundColor = null;
}

/**
 * Clear list of killed pages so that all stories show again
 * This is not used anywhere yet. TODO: put a button on the page
 */
function resetList() {
	localStorage.clear();
}

/**
 * return the <tr> element that represents the top of
 * the stories list
 */
function findFirstRow() {
	var tables = document.getElementsByTagName( 'table' );
	return tables[2].firstChild.firstChild;
}

/**
 * Handler for key commands, currently j,k,x
 */
function onKeydown( evt ) {
	// TODO: in opera the keycodes are funny
	console.log( evt.keyCode );
	
	// j - move down
	if( evt.keyCode == 106 ) {
		// TODO: logic for detecting end of page doesn't work 
		if( currentrow.nextSibling.nextSibling.nextSibling != null ) {
			moveDown();
		}
	}
	
	// k - move up
	else if( evt.keyCode == 107 ) {
		// check if we are at the top
		if( currentrow.previousSibling != null ) {
			moveUp();
		}
	}

	// x - kill story
	else if( evt.keyCode == 120) {
		kill();
	}

	// enter - browse to story 
	else if( evt.keyCode == 13 ) {
		browse();
	}

	// 'c' - read comments 
	else if( evt.keyCode == 99 ) {
		comments();
	}
}

/**
 * Used by 'x' command to kill a story
 */
function kill() {
	var id = currentrow.getElementsByTagName( 'a' )[0].id;
	// using 'true' here - this is arbitrary, all
	// we check is existence of the key in the store
	localStorage.setItem( id, 'true' );

	// move current row position down before deleting anything 
	if( currentrow.nextSibling != null ) {
		moveDown();
	}
	// TODO: use removeRow() to keep things DRY
	currentrow.parentNode.removeChild( currentrow.previousSibling );
	currentrow.parentNode.removeChild( currentrow.previousSibling );
	currentrow.parentNode.removeChild( currentrow.previousSibling );
}

/**
 * Used by 'enter' command to browse to a story 
 */
function browse() {
	// big hairy dom traversal - we have to go specifically to third 
	// child rather than just pulling all anchor elements since if a 
	// story is voted up, the link count will be off.
	var link = currentrow.children[2].getElementsByTagName( 'a' )[0].href;
	window.location = link;
}

/**
 * Used by 'c' command to browse to comments 
 */
function comments() {
	// the comments are in the 'subtext' line, which immediately follows
	// the main subject line and consists
	// of 3 links always (I think, if you flag a story, the link is replaced
	// by an 'unflag' option, so the number of links is consistent.)
	// the third link goes to the comments for the story.
	var link = currentrow.nextSibling.getElementsByTagName( 'a' )[2].href;
	window.location = link;
}

/**
 * row removal method used by killstories(). 
 * TODO: merge the method used by 'x' command to keep it DRY
 */
function removeRow( el ) {
	el.parentNode.removeChild( el.nextSibling.nextSibling );
	el.parentNode.removeChild( el.nextSibling );
	el.parentNode.removeChild( el );
}

```
