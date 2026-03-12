---
title: "Human-writable RDF"
date: 2011-06-22T16:23:12-08:00
url: https://newcome.wordpress.com/2011/06/22/human-writable-rdf/
id: 1433
categories: Uncategorized
tags: 
---

# Human-writable RDF

I’ve done a little bit with [RDF](http://www.w3.org/TeamSubmission/turtle/) in some past projects where I used RDF entailment to do some logic for me. Once I had the data in the right format, I wrote some rules and let one of the off-the-shelf reasoners do a lot of the work for me.

The trouble was, as simple as the abstract graph representation is, the actual serialization formats are tricky to work with by hand and even trickier to work with in places where you don’t have access to a fully-featured RDF parser (javascript for example.)

I wrote a Javascript tool for manipulating a [Turtle](http://www.w3.org/TeamSubmission/turtle/)-like RDF serialization format a while back when I had the need for doing programmatic transformations on RDF data in the browser. The tool and the format are both called Jstle (jostle). You can check that project out [on github](https://github.com/dnewcome/jstle) if you are interested.

While Jstle is a nice format to do data-munging with, it is still not fun to write. Turtle is much better to write by hand at the expense of being more complex to parse. However, Turtle is not the most supported RDF format, and for many things I’ve found myself needing to whip up some [RDF/XML](http://www.w3.org/TR/rdf-syntax-grammar/) files. Tools abound that can convert between formats, but the generated output is very verbose in many cases, fully expanding all URIs to their canonical representations. Once in such a format, they are difficult to work with by hand.

Recently I’ve found myself needing to do some RDF again, and I went back through my notes to figure out the details of RDF/XML. There are many ways of expressing the same graph in XML, and there are a few tricks to keep things simple to deal with by hand.

Consider the following RDF graph expressed in the canonical NTriples form:

```

<http://www.example.com/a> <http://www.example.com/b> <http://www.example.com/c> .
<http://www.example.com/a> <http://www.example.com/b> <http://www.example.com/d> .
<http://www.example.com/a> <http://www.example.com/e> <http://www.example.com/f> .
<http://www.example.com/a> <http://www.example.com/e> <http://www.example.com/g> .

```
Each edge of the graph is explicitly defined in full using fully-qualified URIs. Working with this format is a pain by hand, since we have a lot of redundancy in the markup that we can’t abbreviate.

Now consider the following graph expressed in RDF/XML:

```

<rdf:RDF 
 xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
 xmlns="http://www.example.com/">
 <rdf:Description rdf:about="http://www.example.com/a">
 <b rdf:resource="http://www.example.com/c"/>
 <b rdf:resource="http://www.example.com/d"/>
 <e rdf:resource="http://www.example.com/f"/>
 <e rdf:resource="http://www.example.com/g"/>
 </rdf:Description>
</rdf:RDF>

```
Here we’ve managed to avoid repeating that every assertion is being made with ‘a’ as the subject. However we still have a lot of repetition here. We were able to shorten the predicate statements by virtue of their referencing a default xml namespace declared at the top of the document.

There is one more step we can take here to avoid having to repeat the base URIs in the rdf:resource attributes. That is to set the xml base URI. This mechanism is closely related to using rdf:ID, but does not use the HTML fragment mechanism by default (which is confusing in itself and may be the subject of a later discussion). Using xml:base we can express the same graph as follows:

```

<rdf:RDF
 xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
 xmlns="http://www.example.com/"
 xml:base="http://www.example.com">
 <rdf:Description rdf:about="a">
 <b rdf:resource="c"/>
 <b rdf:resource="d"/>
 <e rdf:resource="f"/>
 <e rdf:resource="g"/>
 </rdf:Description>
</rdf:RDF>

```
Still we have the verbose xml markup, but at least we don’t have to worry about the base URIs anymore. I’ll surely remember more details and tricks as I go along.
