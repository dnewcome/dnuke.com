---
title: "Transforming JSON to XML using Mustache"
date: 2010-08-18T19:51:34-05:00
---

# Transforming JSON to XML using Mustache

I had the need recently to take a deeply-nested JSON structure and transform it to a relatively flat XML file. Ideally I wanted the equivalent of XPath for JSON, where I could have flattened a nested structure like this:

```

[ 
{ name: form1, fields: [ ... ] }, 
{ name: form1, fields: [ ... ] }
]

```
using XPath to select the fields:

```

//fields

```
I had been using the following custom bit of code to apply a flat template to a Javascript array, which I could have applied to the nodeset from the XPath listed above.

```

function applyTemplate( data, template ) {
 for( var i=0; i < data.length; i++ ) {
 	var output = template;
	var item = data[i];
	for( field in item ) {
		var regex = new RegExp( "\\${" + field + "}", "g" );
		output = output.replace( regex, item[field] );
	}
	WScript.Echo( output );	
 }
}

```
This very simply applied the entire template to each item in the array, replacing ${} tags with corresponding fields on the JS objects. I had to do some manual work to cobble together the entire output that I wanted using this quick-and-dirty script. I was trying to avoid using a template language but now that I wanted to do nested repetitions I didn’t want to spend the time to write any more code.

I looked around for something that would let me do something similar to what I did in [Jath](https://newcome.wordpress.com/2010/04/19/jath-a-json-template-language-for-xml-processing/) to go from XML to JSON. I found an [interesting hack](http://stackoverflow.com/questions/1144423/jquery-selectors-for-plain-javascript-objects-instead-of-dom-elements) for making jQuery work against JS objects, but I really wanted something more declarative than functional in this case. 

I found [JsonPath](http://goessner.net/articles/JsonPath/), which only solved half of my problem — that is, the selection of source data. I would have had to use my hack script to do the rest of the job. The closest thing that I found in Javascript to solve the problem was [JsonT](http://goessner.net/articles/jsont/). JsonT looks interesting, but I wasn’t too crazy about having to write so many individual rules to do what I wanted. It felt like doing XSLT where you are applying a ton of small rules and it is hard to see at a glance what your output looks like.

I was afraid I’d end up using something like [StringTemplate](http://www.stringtemplate.org/) or one of the Ruby template engines that Rails uses. But, I found a Javascript implementation of [Mustache ](http://mustache.github.com/mustache.5.html)called [mustache.js](http://github.com/janl/mustache.js/).

I’m using JScript under Windows Script Host here, and mustache.js worked just fine in this environment. I was thinking that I’d have to provide my own lambda functions in order to get the data that I needed from the source JS object since it didn’t look like Mustache supported nested objects. For example, you can’t say:

```

{{#form.fields}}
 ....
{{/form.fields}}

```
You can, however reference a function, so my source data would have had to be a wrapper around my actual data. For example:

```

var data = {
 name: "form1",
 fields: function() { 
 /* iterate through source data */ 
 return fields;
 }
}

```
Then we could do:

```

{{#fields}}
 ....
{{/fields}}

```
without having to use dot notation. The real reason for this post, however, is to show how nested enumerable sections work. I realized that we could emulate the equivalent of XPath’s ‘/form/fields’ using the following:

```

{{#form}}{{#fields}}
 .....
{{/fields}}{{/form}}

```
My template now looks something like:

```

<Entities>
{{#form}}{{#fields}}
 <Entity><Name>{{name}}</Name><ID>{{id}}</ID></Entity>
{{/fields}}{{/form}}
</Entities>

```
Hopefully this helps someone out. There are a lot of JSON to XML and XML to JSON libraries out there, but most of them are pretty specific to one thing. For template-based XML to JSON using XPath queries check out my [Jath ](http://github.com/dnewcome/jath)project. For rule-based JSON to XML serialization [JsonT](http://goessner.net/articles/jsont/) is pretty interesting, and I have a project that is aimed at providing rule-based namespace support for XML serialization called [js-xml-serializer](http://github.com/dnewcome/js-xml-serializer) (I ran out of fun names).
