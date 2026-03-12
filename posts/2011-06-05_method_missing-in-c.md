---
title: "Method_missing in C#"
date: 2011-06-05T11:34:48-08:00
url: https://newcome.wordpress.com/2011/06/05/method_missing-in-c/
id: 1406
categories: Uncategorized
tags: 
---

# Method_missing in C#

There have been a lot of instances where I wanted to intercept any call to an object in C#. In dynamic languages like Ruby, this is pretty easy, since there is a catch-all method that gets called if no method exists. This method is method_missing.

Now that C# supports the dynamic keyword and the framework supplies a dynamic object base class, we can now emulate method_missing. 

One of the things I want in C# is a Javascript-like hash object that can be accessed like a dictionary or like a property bag using either property or indexer syntax. Phil Haack covered an early usage of DynamicObject [here](http://haacked.com/archive/2009/08/26/method-missing-csharp-4.aspx), and later the .NET framework included a type called [ExpandoObject](http://msdn.microsoft.com/en-us/library/system.dynamic.expandoobject.aspx) which allows the use of property accessor syntax for adding attributes dynamically.

However, I wanted to be able to use the indexer syntax in addition to property syntax. The only way to do this with ExpandoObject is to cast to Dictionary and access the items using IDictionary methods like this:

```

ExpandoObject expando = new ExpandoObject();
((IDictionary)expando).Add("theanswer", 42);

```
This is unnecessarily messy so I rolled my own ExpandoObject based on Phil’s code that allows indexer access to its members. Here is what I came up with:

```

using System;
using System.Collections.Generic;
using System.Dynamic;

public class SuperSpando : DynamicObject {

	Dictionary<string, object> 
		m_store = new Dictionary<string, object>();

	public object this[ string key ] {
		get {
			return m_store[ key ];
		}
		set {
			m_store[ key ] = value;
		}	
	}	
	 public override bool TrySetMember(SetMemberBinder binder, object value) {
	 m_store[ binder.Name ] = value;
	 return true;
	 }

	 public override bool TryGetMember(GetMemberBinder binder, 
	 out object result) {
	 return m_store.TryGetValue(binder.Name, out result);
	 }
} // class

```
Here is a sample use case showing both access methods:

```

dynamic ss = new SuperSpando();

// normal assignment works for ExpandoObject also
ss.foo = "bar";

// can't do this with ExpandoObject
ss["baz"]= "spaz";

Console.WriteLine( ss["foo"]);
Console.WriteLine( ss.baz );
Console.ReadLine();

```
Later on I might have to databind SuperSpando. I’m messing with a few reflection-based methods of doing this, but it looks like [using DataTable](http://stackoverflow.com/questions/4617307/converting-string-to-expando-for-binding-datagrid-in-wpf) might be the best way to do it. Seems ugly to me, but then so does using reflection.
