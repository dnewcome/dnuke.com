---
title: "Fluent interfaces: Iterating on CRMQuery"
date: 2010-11-12T15:15:23-05:00
---

# Fluent interfaces: Iterating on CRMQuery

I [wrote an article](https://newcome.wordpress.com/2010/07/13/refactoring-to-domain-specific-languages/) several months ago about a small internal [DSL](http://martinfowler.com/bliki/DomainSpecificLanguage.html) that I developed for creating Microsoft CRM `QueryExpressions` called [CRMQuery](https://github.com/dnewcome/crmQuery). I released this project in its nascent state on GitHub in the hopes that it would be useful to others that are in the trenches digging data out of CRM with the CRM SDK.

Lots of you have checked this project out, but I haven’t had many comments on whether it does everything that you’d want it to do (which I seriously doubt — it was intended to make my life easier in on a particular project). Fast forward to today, and CRMQuery has been used on two more major consulting projects that I’ve been involved in, and I can’t imagine going back to creating `QueryExpressions` the old way. However, I realized recently that I could go a bit further with making queries readable with a relatively simple refactoring of the code.

To show you where I’m headed with this discussion, consider the following query expression written using CRMQuery:

```

QueryBase query = CrmQuery	
 .Select()
 .From( "events" )
 .Where( "events", "statuscode", ConditionOperator.Equal, new object[] { 1 } )
 .Where( "events", "lastdatetoregister", ConditionOperator.LessEqual, new object[]{ DateTime.Now.ToString() } ).Query;

```
I started thinking that the criteria expressions looked kind of ugly, and moreover, the same expressions were being used in several places in the project in other queries. What I wanted to write was something like this:

```

QueryBase query = CrmQuery
 .Select()
 .From( "events" )
 .Where( "events", StatusCodeIsActive )
 .Where( "events", NotPastLateRegistration ).Query;

```
Just the simple act of renaming the “Where” expressions to something more intuitive made the query more readable to me. The question now is, how can we make this work in the CRMQuery code? Since the where expressions are simply CRM `FilterExpressions`, I thought that it made the most sense to expose an overload of the `Where()` method in order to allow passing a `FilterExpression` in. However, building a `FilterExpression` by hand outside of CRMQuery defeats the initial intent of building a DSL in the first place. How can we make this all work intuitively?

In the end we’d like to satisfy the following requirements:

- Caller should not have to manually build a FilterExpression

- Code to build FilterExpressions must not be duplicated between internal and external calling mechanisms

- Calls to `Where()` must continue to work as written in existing dependent code

The current code for `Where()` looks like this:

```

	public CrmQuery Where( string in_entity, string in_field, ConditionOperator in_operator, object[] in_values ) {
			FilterExpression filterExpression = new FilterExpression();
			filterExpression.FilterOperator = LogicalOperator.And;

			ConditionExpression ce = new ConditionExpression();
			ce.AttributeName = in_field;
			ce.Operator = in_operator;
			ce.Values = in_values;

			filterExpression.Conditions.Add( ce );

			if( m_lastAddedLink != null ) {
				m_lastAddedLink.LinkCriteria.AddFilter( filterExpression );
			}
			else if( m_query.EntityName == in_entity ) {
				m_query.Criteria.AddFilter( filterExpression );
			}
			else {
				LinkEntity link = FindEntityLink( m_query.LinkEntities, in_entity );
				if( link != null ) {
					link.LinkCriteria.AddFilter( filterExpression );
				}
			}
			return this;
		}

```
We want to create an overload of this method with the signature:

```

public Where( string in_entity, FilterExpression in_filterExpression );

```
Given the current implementation of `Where()` it should be obvious that an implementation of the interface defined by this method signature would be the same as the current implementation but without the code for creating a new `FilterExpression` instance. However we will end up with duplicated code for inserting the `FilterExpression` in the correct place in the resulting query. We could factor out the code for performing the `FilterExpression` insertion, but thinking about it for a moment longer, we can see that the value in having an isolated implementation of that code is not very useful, but one of our actual requirements was to have an isolated implementation of the code that *creates* the `FilterExpression` code.

We can get what we want with a two-step refactoring job. The first step is to get the two different `Where()` methods implemented without duplicating any code. This is a common pattern, where we split a method into two, with the new overload calling the old one under the hood. This intermediate step looks something like this:

```

		public CrmQuery Where( string in_entity, string in_field, ConditionOperator in_operator, object[] in_values ) {
			FilterExpression filterExpression = new FilterExpression();
			filterExpression.FilterOperator = LogicalOperator.And;

			ConditionExpression ce = new ConditionExpression();
			ce.AttributeName = in_field;
			ce.Operator = in_operator;
			ce.Values = in_values;

			filterExpression.Conditions.Add( ce );

			return Where( in_entity, filterExpression );
		}
		public CrmQuery Where( string in_entity, FilterExpression in_filterExpression ) {
			if( m_lastAddedLink != null ) {
				m_lastAddedLink.LinkCriteria.AddFilter( in_filterExpression );
			}
			else if( m_query.EntityName == in_entity ) {
				m_query.Criteria.AddFilter( in_filterExpression );
			}
			else {
				LinkEntity link = FindEntityLink( m_query.LinkEntities, in_entity );
				if( link != null ) {
					link.LinkCriteria.AddFilter( in_filterExpression );
				}
			}
			return this;
		}

```
After this first step we are halfway there. Now we extract the code for creating the filter expression into a static method that we can call separately to create a `FilterExpression` and will also be used internally by `Where()` to keep things [DRY](http://www.c2.com/cgi/wiki?DontRepeatYourself).

```

		public static FilterExpression WhereExpression( string in_field, ConditionOperator in_operator, object[] in_values ) {
			FilterExpression filterExpression = new FilterExpression();
			filterExpression.FilterOperator = LogicalOperator.And;

			ConditionExpression ce = new ConditionExpression();
			ce.AttributeName = in_field;
			ce.Operator = in_operator;
			ce.Values = in_values;

			filterExpression.Conditions.Add( ce );
			return filterExpression;
		}

```
Now we change the new `Where()` implementation to call this static method for creating a new `FilterExpression` and we are finished with the refactoring. Here is what the final method looks like:

```

public CrmQuery Where( string in_entity, string in_field, ConditionOperator in_operator, object[] in_values ) {
	FilterExpression filterExpression = CrmQuery.WhereExpression( in_field, in_operator, in_values );
	return Where( in_entity, filterExpression );
}

```
Wow, that looks a ton better. Simple, concise and implemented bottom-up — reusing our more primitive building blocks. All of this shuffling around generated almost no new code but it allows us the flexibility to do the following:

```

// define filter expressions
FilterExpression StatusCodeIsActive = CrmQuery.WhereExpression( 
 "statuscode", 
 ConditionOperator.Equal, new object[] { 1 } 
);

FilterExpression NotPastLateRegistration = CrmQuery.WhereExpression( 
	"lastdatetoregister", 
	ConditionOperator.LessEqual, 
	// TODO: use server time instead of client!
	new object[] { DateTime.Now.ToString() }
);

// use filter expressions in a query expression
QueryBase query = CrmQuery
 .Select()
 .From( "events" )
 .Where( "events", StatusCodeIsActive )
 .Where( "events", NotPastLateRegistration ).Query;

```
Being able to separately define and name the filter arguments makes the interface much more [fluent](http://martinfowler.com/bliki/FluentInterface.html), and can be understood more quickly and clearly. Maintainability is also increased since we can reuse the same filter definitions. Notice the TODO comment warning that we rely on the client time. This may cause problems down the road if the clients are in a different timezone than the server, among other things. Since we have isolated the issue rather than repeating it in every query, we will be able to address this much more quickly later on.
