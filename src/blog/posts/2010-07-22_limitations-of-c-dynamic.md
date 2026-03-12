---
title: "Limitations of C# dynamic"
date: 2010-07-22T10:56:05-05:00
---

# Limitations of C# dynamic

I’ve been using the new dynamic keyword along with anonymous types recently, but I think that these features kind of miss the mark. Anonymous types aren’t dynamic at all — they just define the type implicitly — you can’t add new items at runtime. However you can use the DLR’s ExpandoObject if you want to be able to add items at runtime. In either case the most serious limitation is that using dynamic doesn’t let you access members that are specified at runtime.

For example, this is not valid:

```

dynamic obj = GetMyObj();
string field = GetMyField();
object value = obj[ field ];

```
furthermore, trying to access a member that doesn’t exist throws an exception:

```

dynamic obj = new { field1 = "foo" };
// throws RuntimeBinderException
string val = obj.field2;

```
Since we can’t specify fields dynamically at runtime, it is not possible to create some function that will safely access an arbitrary member and return null if it doesn’t exist. In Javascript and other dynamic languages, it is idiomatic to say things like the following:

```

var foo = obj.field1 || "Default";

```
We know that accessing field1 will return undefined so we can assign a default value with a simple assertion. At the very least we’d like to be able to do:

```

object foo = DynamicFieldExists( obj, "field1" ) ? GetValue( obj, "field1" ) : "Default";

```
However since we can’t access dynamic fields using indexer notation, I don’t know how we would write the DynamicFieldExists and GetValue functions needed to wrap the access up into a try/catch to avoid throwing an exception if the field doesn’t exist. Here is what I’d like to write:

```

public static bool DynamicFieldExists( dynamic obj, string field ) {
 bool retval = false; 
 try {
 // can't write the following:
 var temp = obj[ field ];
 retval = true;
 }
 catch( RuntimeBinderException ) {} 
 return retval;
}

```
If anyone has any thoughts on this I’d love to know.
