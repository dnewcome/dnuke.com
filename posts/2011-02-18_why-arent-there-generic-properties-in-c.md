---
title: "Why aren&#8217;t there generic properties in C#?"
date: 2011-02-18T19:56:07-08:00
url: https://newcome.wordpress.com/2011/02/18/why-arent-there-generic-properties-in-c/
id: 1326
categories: Uncategorized
tags: 
---

# Why aren&#8217;t there generic properties in C#?

I ran across something interesting today about the C# generics language feature and its underlying CLR support.

While maintaining a library of helper functions I thought it would be nice to be able to index into a collection of mixed-type properties and cast the result using a type specified by a generic type parameter. The calling code would have looked something like this:

```

// not valid code
string val = collection<string>[ "key" ];

```
Seems simple enough, we can have generic fields in our classes, and generic methods, so it seems like generic properties and indexers would follow.

However, the difference is that a property is a wrapper around a backing store. With a generic type field, we cannot provide a type argument at any time other than the class instantiation obviously, since setting a field is a simple assignment.

The crucial difference is when the type is known. In the case of a generic field we know the type when the class is instantiated with the type argument.

For example:

```

public class Gen<T> {
 public T Field;
}

Gen<string> gen = new Gen<string>();
gen.Field = "foo";

```
So why can’t we have:

```

public class Gen {
 public T Field<T> { get; set; };
}

Gen gen = new Gen();
gen.Field<string> = "foo";

```
As I alluded to before, the reason has to do with the underlying implementation of the heap in the CLR. Since we don’t know the type when the class is instantiated, the CLR can’t allocate it properly on the heap since it doesn’t know how much space it needs.

The only explanation that I found is an old post by a member of the C# team [here](http://www.boyet.com/Articles/GenericProperties.html).

Thinking about this some more I think it should be possible technically if the type were constrained to reference types.

Using generic type parameter constraints we would write:

```

public class Gen {
 public T Field<T> where T : class { get; set; };
}

```
As long as we are storing a reference type it shouldn’t matter what it is since the pointer is the same size.

Also, if we abused the getter/setter a bit and used a collection as the backing store, it seems like everything should work, but the compiler enforces the constraints based on the common use case of properties, which is to wrap private fields to fire events and do logging perhaps, not to substitute for methods that manage back end storage.

This is pure speculation, but it is an interesting thought exercise.
