---
title: "Data persistence, normalization and cardinality"
date: 2012-07-07T11:15:34-08:00
---

# Data persistence, normalization and cardinality

I’m not a big fan of object-relational mappers and tricky data access schemes. I’m also a fan of good data normalization in relational database systems. I’m somewhat new to key-value and document stores, but I have done projects using things like Amazon’s new DynamoDB.

I’m doing some work on a side project that involves [counting user votes](https://github.com/dnewcome/news.js). I decided to use MySql as the persistence mechanism for this project simply because it is the de-facto open source relational database. I’m not trying to innovate here with the database, so it makes sense to use something really familiar.

However, I’m realizing that even with a simple project like News.js, there are major tradeoffs to make when it comes to the database layer. Tradeoffs that affect the design of the database schema.

Consider a typical Digg or Reddit news site where users can upvote or downvote an article. The votes could be considered a kind of metadata, and the article itself could be treated as a sort of document. There are essentially two ways to store this metadata – inline as a field on the document, or as a second “vote” entity that points back to the document.

Consider the following:

```

create table document (
	id integer not null auto_increment primary key,
	title varchar(1000), 
	body longtext,
	votes integer
);

```
This is a bare minimum schema for a document that can track user votes. Every time a user votes on a story we just increment the vote count. However, there are some problems with this schema both from a functionality standpoint and a performance standpoint. From a functionality standpoint, we don’t know who voted, so we can’t prevent someone from voting more than once. From a performance standpoint, if we have a lot of people trying to vote at once, we can have a lot of contention to write to the document table.

Let’s come up with a simple vote abstraction in the form of a linked database table. Here is a first attempt:

```

create table vote (
 id integer not null auto_increment primary key, 
 fk_user_id int not null, 
 fk_document_id int not null,
 
 foreign key (fk_user_id) references user(id),
 foreign key (fk_document_id) references document(id)
);

```
Now we know who voted because we have a field that tracks the user id of the voter. However, we still need to maintain the vote count on the document table unless we do a join to aggregate the individual votes. Also if we want to keep a user from voting more than once we have to constrain the user-vote cardinality ourselves in the code. The database schema is not expressive enough to articulate this constraint, and in addition we had to decide how to structure the data ourselves.

### Decoupling data from schema

Databases have some physical storage format on disk or in memory. Indexes help us get that data quickly when we issue queries against that data. However, the indexes are kind of a grey area with relational databases. They are not strictly part of the schema although in many cases they are necessary for the data to be accessed at all in a deployment scenario with a lot of data. In many cases the size of a table is a consideration in the overall schema design.

Should sorting be the responsibility of the database? Sorts are one of the most expensive operations in a database, often requiring whole tables to be scanned or their indexes pulled into the database’s memory footprint. In order to save on sorting I have sometimes created index tables that are pre-sorted on disk in order to facilitate different sort orders. Using a clustered index, we can have immediate access to sorted data since the data is pre-sorted on disk. However, this is a huge denormalization step in the database.

What if we could have a better front-end into our data? Some way to scale out horizontally and create usage-optimized windows into the data? Can we extend the concept of database indexes to “index servers” that are backed by the core persistence engine?

### Semantic schemas

Traditional database schemas define key-based relationships between data. These links are used in queries mostly via SQL join statements although they also play a big part in performance. Already there are some relationships that are tedious to define in a database. Many-to-many relationships require a tertiary table that stores only the mapping between the two entity tables in the database. In a functional sense, a map is a rather elegant way of defining a relationship. On the other hand, having another table clogging up the database is a drag. Perhaps these are orthogonal concerns. What if the database was defined in a more functional way from the ground up? The idea of maps and sets is a very common one in the functional programming world, and essentially what we have in a relational database is sets of tuples that map to one another.

### Map reduce vs. count()

I always cringe a little bit when I see a database procedure that uses a lot of functions like max and group by. SQL is a very powerful set language, but this power comes at great computational expense. Sorting and counting in a traditional database is expensive. However, in a distributed database, this turns out to be a relatively cheap operation since it is easily parallelizable. In a typical RDBMS we don’t have this ability to parallelize the workload, and we are relegated to grouping and counting.

It seems to me that we shouldn’t have to make decisions about our data based on the retrieval mechanism. This is the whole idea of SQL – that is to enable us to tell the datastore “what” we want and let it determine “how”. In practice however, we have to think about the “how” up front when we design our schema!
