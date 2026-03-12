---
title: "The URI as a Data Lingua Franca for the Web"
date: 2010-11-20T17:48:15-05:00
url: https://newcome.wordpress.com/2010/11/20/the-uri-as-a-data-lingua-franca-for-the-web/
id: 1191
categories: Uncategorized
tags: 
---

# The URI as a Data Lingua Franca for the Web

I just read Tim Berners-Lee’s [piece in Scientific American](http://www.scientificamerican.com/article.cfm?id=long-live-the-web) about what makes the Web the powerful tool that it is and how certain forces threaten to jeopardize its power. One of the things that he mentions in the article is the increasing isolation of data on the Web. Whether we realize it or not, our data is stored in opaque “islands” on the Internet. Although data portability is a rising concern for many Web-savvy netizens, the problem is much further-reaching than just downloading a data extract with your social network contacts. Perhaps unintentionally, valuable data is being locked away in government agencies, research institutions and in industry.

At its heart, the Web isn’t just an application, nor is it a collection of applications. The Web is data and relationships between data. Programmers and application designers know that data often outlives its initial application, so why are we building data obsolescence into the Web?

The answer is mostly due to the legacy of relational databases and traditional data connection protocols. Before the Web, applications were often two-tier affairs where the server tier was simply an off-the-shelf RDBMS that held a custom user schema and data, while the client tier held the user interface and all of the business or domain logic. In this model, the data and schema were exposed via a vendor-specific protocol, but were queryable using an industry standard language — SQL.

On the Web, applications were initially deployed in three tiers — the data tier was still there just as it was before, but all of the heavy lifting was moved out of the client and into a Web application tier. Early Web browsers didn’t support many of the things that enable the rich client-side experiences that we see now in modern AJAX Web applications, so all of the data access was hidden fully behind a Web application layer. Later on in the evolution of modern Web applications, we began to see the rise of the Web API. These APIs were typically run in parallel to the main application and allowed many of the same actions to be performed, but were separate than the main application.

At the beginning of the year I wrote about [needing a data API for the Web](https://newcome.wordpress.com/2010/02/08/we-need-a-data-api-for-the-web/). Now I’m thinking that maybe we don’t need a specific API standard, we just need guidelines for data relations and discoverability on top of what we already have with REST. Semantic Web technologies showed just how far we could go with using just URIs as identifiers and for data relationships. What I’m proposing here is that we use some of the same ideas put forth by the Semantic Web folks, and apply a small subset of them along with a new HTTP verb for getting schema for a RESTful data URL.

I’m still thinking about what this would look like but here is a quick example. Say we have some billing data. Two of the data elements that we want to manipulate are invoices and line items. This is a well-worn pattern to anyone that has done any business programming. These entities have a parent-child (or master-detail) relationship.

True to RESTful principles, let’s represent the two entities with URIs like the following:

```

http://example.org/billing/invoice
http://example.org/billing/invoiceitem

```
In order to see the data relationships between these entities we could do something like this:

Request entity fields

```

HTTP 1.1 SCHEMA /billing/invoiceitem

```
Response

```

http://example.org/billing/invoiceitem#name
http://example.org/billing/invoiceitem#create_date
http://example.org/billing/invoiceitem#parent

```
Request individual relationship

```

HTTP 1.1 SCHEMA /billing/invoiceitem#parent

```
Response

```

http://example.org/billing/invoice#id

```
This is just an example of a possible data schema format in keeping with REST principles. My thesis here isn’t the creation of the protocol itself, it is that we should be coding our applications against something like this rather than an application-specific programming interface. The idea is that the applications as well as the APIs that consume the data would both be written against this slightly lower-level data interface. Consumers would be able to use the provided application-specific API for convenience but power users and other data consumers could always look one level deeper for more direct data access.

The basis of RESTful data interfaces is still the URI, as it is for RESTful application interfaces. The URI should always remain a first-class citizen on the Web, and we should strive to express data elements and schema in terms of URIs wherever possible.

This idea is pretty rough, and might be entirely the wrong way of thinking about the problem, but the evolution of my thinking about Web data is moving in this general direction.
