---
title: "Jath &#8211; A JSON template language for XML processing"
date: 2010-04-19T23:44:54-05:00
---

# Jath &#8211; A JSON template language for XML processing

On Saturday, I released a project called [Jath](http://github.com/dnewcome/jath) that implements a technique for processing XML data that I have been playing with. The idea is to be able to write a concise declarative template in JSON that describes the desired Javascript object and apply the template to the source XML data.

Using a template like this:

```

[
 "//label",
 {
 id: "@id",
 added: "@added",
 address: {
 street: "address/street",
 city: "address/city"
 }
 }
]

```
we can transform XML

```

<labels>
 <label id='ep' added="2003-06-10">
 <name>Ezra Pound</name>
 <address>
 <street>45 Usura Place</street>
 <city>Hailey</city>
 <province>ID</province>
 </address>
 </label>
 <label id='tse' added="2003-06-20">
 ...
 </label>
...
</labels>

```
Into Javascript like this

```

[
 {
 id: "ep",
 added: "2003-06-10",
 address: {
 street: "45 Usura Place",
 city: "Hailey"
 }
 },
 {
 id:"tse",
 added: "2003-06-20",
 address: {
 street: "3 Prufrock Lane",
 city: "Stamford"
 }
 },
 ...
]

```
The current implementation now supports XML namespace prefixes in all browsers except Internet Explorer. Jath also offers full support for Mozilla, Chrome, Safari, and nearly full support for Opera.

More usage information is available on the Github project page [Jath](http://github.com/dnewcome/jath). More examples can be found by looking at the test cases in samples.html. All code is provided under the MIT open source license.
