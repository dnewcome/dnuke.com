---
title: "Refactoring to domain-specific languages"
date: 2010-07-13T01:41:28-05:00
---

# Refactoring to domain-specific languages

Today I was adding new functionality to a library of Microsoft CRM functions that I’ve been building up to make performing queries more manageable, when I realized that I was duplicating a lot of code between different query types. For example, we might want to construct a query that has a simple filter on it that compares an entity field to a value. For example, the code might look something like this:

```

public static QueryBase FilterByField( string in_entityName, string in_fieldName, object in_fieldValue, ColumnSetBase in_columns, IEnumerable<String> in_orderfields ) {
	QueryExpression queryExpression = new QueryExpression();
	queryExpression.EntityName = in_entityName;
	queryExpression.ColumnSet = in_columns;

	FilterExpression filterExpression = new FilterExpression();
	filterExpression.FilterOperator = LogicalOperator.And;

 .....

	foreach( String orderfield in in_orderfields ) {
		if( ( orderfield != null ) && ( orderfield != "" ) ) {
			queryExpression.AddOrder( orderfield, OrderType.Ascending );
		}
	}
	return queryExpression;
}

```
In another query type where we want to do a join, we might have something like this:

```

public static QueryBase GetLinked( 
	string in_fromEntity, string in_fromField, string in_toEntity, string in_toField, 
		string in_filterField, object in_filterValue
	) {
	LinkEntity linkEntity = new LinkEntity();
	...
 // create a query expression
	QueryExpression query = new QueryExpression( in_fromEntity );
 ...

 // here we add a filter
 linkEntity.LinkCriteria.FilterOperator = LogicalOperator.And;
 ....

 return query;
}

```
Looking closely, this code is not very [DRY](http://en.wikipedia.org/wiki/Don't_repeat_yourself). Each of these query construction methods has to create an instance of QueryExpression, set up any filters, and the second function doesn’t even support ordering like FilterByField does. If we wanted to add ordering we’d have to add it by duplicating the code in FilterById and probably create a new overloaded function to support callers that expect the old function signature.

An obvious solution to the duplication of code in this example is to split things up by query clause. We’d end up with functions like AddLink() and AddFilter(). Most likely, the function signatures would look like this:

```

AddLink( QueryBase, ... );
AddFilter( QueryBase, ... );

```
In each case we pass the query that we are building into each method along with any other parameters needed to build the particular clause. As I began this refactoring, I realized that this was a perfect time to use method chaining to build up the query by calling successive methods on the same query object. By modifying each method to return the same instance of the query that was passed in, we can write something like this:

```

AddFilter( AddLink( new QueryExpression(), ... ), ... );

```
Not quite what we want, but let’s wrap the QueryExpression up in a new class. If we return the wrapper instance from each method, and the wrapper class has the functions defined on it, we can chain the calls like this:

```

new QueryWrapper().AddLink( ... ).AddFilter( ... );

```
At this point I was thinking that by naming the methods by their SQL counterparts, I could create a small internal [domain-specific language](http://en.wikipedia.org/wiki/Domain-specific_language) out of this. An example would look like this:

```

new QueryWrapper().Join( ... ).Where( ... );

```
About 20 minutes later, after rearranging and renaming the code, I was able to write a query like this using the refactored code:

```

QueryBase query = QueryDsl
	.Select( new AllColumns() )
	.From( "childentity" )
	.Join( "childentity", "childentityid", 
		"parententity", "parententityid" )
	.Where( "parententity", "name", 
		ConditionOperator.Equal, new string[] { "myparent" } ).Query;

```
This is a huge improvement in flexibility while still remaining readable and understandable. Previously I would have had a separate query builder for each complex query like the one above.

To give you an idea of how this was implemented, I’m including the first basic revision of the code below.

```

using System;
using System.Collections;
using Microsoft.Crm.Sdk.Query;

namespace MSCrm.Query
{
	/**
	* QueryDsl is an experimental domain-specific language for building
	* Microsoft CRM QueryExpressions.
	*/
	public class QueryDsl
	{
		// We use Select() function instead of constructor
		private QueryDsl() { }

		/**
		 * QueryDsl wraps a CRM QueryExpression. Idiomatic usage chains calls 
		 * together, only accessing the Query as the last call in the chain.
		 */
		public QueryExpression Query {
			get { return m_query; }
		} 
		private QueryExpression m_query;
		
		/**
		 * Select serves as the constructor and the start of the 
		 * chain. By Sql convention, accepts the projection list
		 */
		public static QueryDsl Select( ColumnSetBase in_columns ) {
			QueryExpression query = new QueryExpression();
			query.ColumnSet = in_columns;
			QueryDsl dsl = new QueryDsl();
			dsl.m_query = query;
			return dsl;
		}

		/**
		 * From sets the entity type that the query will return
		 */
		public QueryDsl From( string in_entityName ) {
			m_query.EntityName = in_entityName;
			return this;
		}
		
		/**
		 * Join uses LinkEntity to establish a relation between two entities.
		 * Use Where to add criteria using the 'to' entity.
		 */
		public QueryDsl Join( string in_fromEntity, string in_fromField, string in_toEntity, string in_toField ) {
			LinkEntity linkEntity = new LinkEntity();
			linkEntity.LinkFromEntityName = in_fromEntity;
			linkEntity.LinkFromAttributeName = in_fromField;
			linkEntity.LinkToEntityName = in_toEntity;
			linkEntity.LinkToAttributeName = in_toField;
			linkEntity.JoinOperator = JoinOperator.Inner;
			
			// TODO: we only support joins against the entity defined in the
			// root query - should write support for nested LinkEntities
			m_query.LinkEntities.Add( linkEntity );
			return this;
		}

		public QueryDsl Where( string in_entity, string in_field, ConditionOperator in_operator, object[] in_values ) {
			FilterExpression filterExpression = new FilterExpression();
			filterExpression.FilterOperator = LogicalOperator.And;

			ConditionExpression ce = new ConditionExpression();
			ce.AttributeName = in_field;
			ce.Operator = in_operator;
			ce.Values = in_values;

			filterExpression.Conditions.Add( ce );

			// TODO: we overwrite any existing filter - we might 
			// want to do some logic to append instead of replace
			if( m_query.EntityName == in_entity ) {
				m_query.Criteria = filterExpression;
			}
			else {
				LinkEntity link = FindEntityLink( m_query.LinkEntities, in_entity );
				if( link != null ) {
					link.LinkCriteria = filterExpression;
				}
			}
			return this;
		}

		/**
		 * Used by Where to figure out which LinkEntity corresponds to the desired
		 * entity we wish to attach the criteria to
		 */
		private LinkEntity FindEntityLink( ArrayList in_linkEntities, string in_entityName ) {
			foreach( LinkEntity link in in_linkEntities ) {
				FindEntityLink( link.LinkEntities, in_entityName );
				if( link.LinkToEntityName == in_entityName ) {
					return link;
				}
			}
			return null;
		}

		/**
		 * OrderBy adds ordering fields to the query at the toplevel.
		 * 
		 * TODO: for full sql compliance we need to pass array of booleans
		 * since we can specify ascending/descending for each field
		 */
		public QueryDsl OrderBy( string[] in_orderfields, OrderType in_ordertype ) {
			foreach( String orderfield in in_orderfields ) {
				if( ( orderfield != null ) && ( orderfield != "" ) ) {
					m_query.AddOrder( orderfield, in_ordertype );
				}
			}
			return this;
		}

	} // class 
} // namespace

```
