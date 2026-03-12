---
title: "We need a data API for the web"
date: 2010-02-08T16:32:08-05:00
url: https://newcome.wordpress.com/2010/02/08/we-need-a-data-api-for-the-web/
id: 822
categories: Uncategorized
tags: 
---

# We need a data API for the web

HTML won for human-readable data.

We can point our browsers in any direction we please and we can expect to get something that is at least partially decipherable as human-readable content.

The same is not true for data yet.

What is the equivalent for data? It is not XML, since there are no semantics without XML schema. So is it XML with XML schema? The closest thing is Atom or RSS. What about RDF? I think it is languishing due to its complexity.

Also, things like Atom and RDF would just be the data format, not a protocol or full API. SOAP would be the closest thing that we have, but again it is too complicated – we would need a verbose WSDL to understand how to call the SOAP API.

We need something that:

- Is simple

- Degrades gracefully

- Is general

Does it need to be able to transfer something complex like genome data? I don’t think so. Most of what gets shuttled around is remarkably similar in structure. How different is an email from a tweet or a blog post? Even if we did need to transfer something like genome data, Google showed through the development of GData that with extensions to an open standard (Atom) many different types of APIs can be created despite the simplicity of the base protocol.

RSS proved that a relatively simple data format could be incredibly useful if it was universally supported. I think that a simple data format along with a simple HTTP-based API could be just as useful.

The age of mashups is just the beginning of the composable web. Current mashups are mostly aggregators. If the cloud keeps going as it has, most web applications themselves will be composed of smaller services entirely.

Cloud services at the storage and operating system level are just the beginning. Self-contained environments such as Google App Engine and Microsoft Azure are just the beginning.
