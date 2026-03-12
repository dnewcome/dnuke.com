---
title: "Updated: Jath Javascript XML processor"
date: 2010-08-24T18:54:48-05:00
url: https://newcome.wordpress.com/2010/08/24/updated-jath-javascript-xml-processor/
id: 1087
categories: Uncategorized
tags: 
---

# Updated: Jath Javascript XML processor

I just pushed some updates to the Jath template-based XML processor. The new version adds support for including literal values in the templates and most importantly (for me, right now) support for processing files under Windows Script Host. I’m going to be using this to churn through tons of exported CRM config data soon, so I wanted to get this update out there.

To run under WSH nothing different is required, just include jath.js in the .wsf file and proceed as usual. Jath will detect the environment just as it detects Node.js and various browser versions.

A quick synopsis on using literals — a typical template might look like the following:

```

var template [ "//status", { id: "@id", message: ":literaldata" } ];

```
The only difference is that the value “literaldata” is prefixed by a semicolon, marking it as a literal rather than an XPath expression. The output would look something like the following:

```

[ 
	{ id: "1", message: "literaldata" }, 
	{ id: "3", message: "literaldata" } 
]

```
The The character can be changed by setting 

```

Jath.literalChar

```
to another character. Note that the value may be a single character only — no longer strings.
