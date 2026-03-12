---
title: "Dynamic objects in C#"
date: 2010-06-05T17:30:33-05:00
---

# Dynamic objects in C#

Microsoft’s efforts toward making its .NET languages more dynamic get plenty of hype, so when I dug into using dynamic (aka expando) objects hoping to solve a few simple problems where I wanted to perform data binding on data that would only be known at runtime, I was optimistic that the new features would be just what I needed.

The Dynamic Language Runtime (DLR) defines a type called ExpandoObject that allows us to create new members on an instance on the fly, much like we can in languages such as Javascript. For example, in Javascript, we can add a member to an object by simply assigning a value:

```

var obj = {};
obj.member = "hello";

```
One very important feature of expando objects in Javascript is that we are able to create a member using runtime data. In the example above, the ‘member’ property was specified using Javascript code that was available when the script was compiled. Fortunately we can also do something like this:

```

obj["member"] = "hello";

```
Astute readers will observe that, in place of a literal string, we can use a variable whose value can be set at runtime:

```

var fieldname = "member";
obj[ fieldname ] = "hello";

```
So now that we’ve seen how things work in Javascript, let’s take a look at some C# code. In order to compile the code that follows, you’ll need Microsoft.Dynamic.dll from the DLR as well as Microsoft.CSharp.dll. Also, you’ll need to be running on the 4.0 framework, since we’ll be needing support for the ‘dynamic’ keyword.

```

dynamic obj = new System.Dynamic.ExpandoObject();
obj.member = "hello";

```
Brilliant. Now members can be created on the fly just like in Javascript. However, support for runtime member definition [doesn’t seem to be released](http://connect.microsoft.com/VisualStudio/feedback/details/468668/expandoobjects-implementation-of-idictionary-string-object-item-set-fails-for-new-keys) yet in the DLR. Fortunately, there is a workaround. Unfortunately it is ugly. We can cast to IDictionary and add the data member by adding a new element to the dictionary as follows:

```

( ( IDictionary )obj ).Add( "member", "hello" );

```
Note that the use of the ‘dynamic’ keyword signals to the compiler that type-checking should be deferred until runtime. It is also a type, so we can perform a cast. For example:

```

((dynamic) new System.Dynamic.ExpandoObject()).member = "woo";

```
It is a pointless example, since we don’t return a reference to the new object, but it serves to illustrate how ‘dynamic’ fits into the language.

Now the real reason that I wanted to create dynamic objects was so that I could bind them to an ASP.NET GridView. As an example, we can use anonymous types to create a data source like this:

```

MyGridView.DataSource = new object[] {
	new { name = "Dan", occupation = "programmer" }
};

```
The preceding code is great if we know exactly which fields we need at compile time, but in order to build the items at runtime we’d need something like the dynamic objects that I showed in the previous examples. Unfortunately, it doesn’t work — dynamic objects cannot be used in data binding. This leads me to wonder how useful ExpandoObject really is, since it is effectively just syntactic sugar around IDictionary if it doesn’t look like a normal .NET type (ie, with defined class members). Maybe I’m missing something, but this seems like an elaborate scheme that doesn’t fully solve the issue of creating dynamic objects in .NET.
