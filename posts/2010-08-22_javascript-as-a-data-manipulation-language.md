---
title: "Javascript as a data manipulation language"
date: 2010-08-22T18:24:43-05:00
url: https://newcome.wordpress.com/2010/08/22/javascript-as-a-data-manipulation-language/
id: 1073
categories: Uncategorized
tags: 
---

# Javascript as a data manipulation language

If you are like me you’ve been working with data in various forms for your whole programming career. Sometimes we have big datasets locked away in relational databases or complex content management systems. Other times we’re dealing with ad-hoc data from spreadsheets or web portals. Ironically it can be the larger data that are easier to work with since the tools for dealing with the data are right under your fingertips.

In the Unix tradition, where nearly everything is treated as line-oriented text files, we have a whole slew of tools like grep, awk and sed to cut through all of that plaintext data. The problem is that often times the data we want to deal with is relational or hierarchical, and in order to deal with it, line-oriented techniques become awkward. Languages such as Perl were designed around line-oriented text processing, so why not look to something that is fundamentally designed around a slightly higher-level data representation for these more complex tasks? I’m talking about Javascript.

JSON literals are becoming the de-facto standard for data on the web and elsewhere, and impose a pretty small overhead on top of what would be the raw delimited data that it represents (especially compared to XML). LISPers are probably laughing at this point since they have basically the same advantage with S-expressions, but unfortunately JSON has gotten quite a bit more mindshare now.

Previously, I would have used SQL for most data manipulation tasks, connecting to the spreadsheets or comma-delimited files using ODBC or used DTS to import the data. However, I’ve recently had to deal with a slew of small datasets from different sources, some of which are already JSON formatted. So I wondered how hard could it be to write a few simple data manipulation functions in Javascript?

For starters, we need to get everything together as Javascript objects. For JSON files all we need to do is read the file in and eval() it. I’m using Windows Scripting Host here, but the same techniques will work if you are using Rhino or Node.js. All you need is filesystem access.

```

var filename = WScript.Arguments.Item(0);
var fso = new ActiveXObject( "Scripting.FileSystemObject" );
var file = fso.OpenTextFile( filename, 1 );
var data = eval( "(" + file.ReadAll() + ")" );

```
The other data that I want to pull in is actually comma delimited. We can write some simple code to go through a file and produce an array of objects containing the rows in just a few lines of code:

```

function processDelimited( text, fields, delim ) {
	var ret = [];
	var linedelim = "\n";

	var lines = text.split( linedelim );
	for( var i=0; i < lines.length; i++ ) {
		var obj = {};
		var tokens = lines[i].split( delim );
		for( var j=0; j < tokens.length; j++ ) {
			obj[ fields[j] ] = tokens[ j ]; 
		}
		ret.push( obj );
	}
	return ret;
}

```
Note that this code doesn't allow for escaping delimiter characters or quotation marks around the data elements. I didn't need this functionality so I didn't implement it.

Once we have our data pulled in as tuples we can write functions to operate on it as needed. I needed to join datasets together on a key like a SQL equi-join so I wrote a bit of code to do it like this:

```

function innerJoin( obj1, obj2, func ) {
	var ret = [];
	for( var i=0; i < obj1.length; i++ ) {
		for( var j=0; j < obj2.length; j++ ) {
			if( func( obj1[i], obj2[j] ) ) {
				ret.push( merge( obj1[i], obj2[j] ) );	
			}
		}
	}
	return ret;
}	

```
I’ve omitted the code for merge() for the sake of clarity. All it does is copy the fields of one object to the second to create a composite tuple. Of course this code is a slow way to perform a join, but it doesn’t matter for small datasets. At this point we can see why Javascript makes a great language for doing data manipulation. The join condition is actually a function. In SQL we are limited to the operators given to us, but here we can do any kind of logic we want to. Here is an example usage where the join condition is a simple equi-join:

```

function( obj1, obj2 ) { 
 return obj1[ "field1" ] == obj2[ "field2" ];
}

```
This is equivalent to 

```

where obj1.field1 = obj2.field2 

```
in SQL.

There are some more hidden advantages to having your data represented as Javascript that I’ll cover later on, but I’ll give you a hint that all of our data is actually represented as code, so doing things like generating GUIDs or re-using certain bits of data become trivial.
