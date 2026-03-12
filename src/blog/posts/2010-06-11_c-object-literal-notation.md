---
title: "C# object literal notation"
date: 2010-06-11T17:05:13-05:00
---

# C# object literal notation

I have a project coming up where I’d like to be able to write some declarative configuration in an object literal notation similar to JSON. The project is going to be written in C#, so I could embed a Javascript implementation [like IronJS](https://newcome.wordpress.com/2010/05/25/embedding-ironjs/) and just use JSON, or I could try using IronPython or some other .NET language that supports object literals. However, now that C# supports anonymous types, I wondered how far I could go staying within the C# language.

For starters, a simple “hash” style object can be created like so:

```

var obj = new { name = "value" };

```
Fortunately, anonymous types may be nested, so the following is valid:

```

var obj = new { 
 name = "value", 
 obj = new { 
 name = "value" 
 }
};

```
So far, things are looking pretty good. With the exception of the ‘new’ keyword, there are only slight syntactic differences between what we’d see in a JSON literal and what we have here in C#. The other major feature of JSON is the array literal. C# supports array initialization lists, so we can create a new unnamed array as such:

```

new object[]{ "one", "two", 3 }

```
Now it isn’t too much of a stretch to see that we can create arrays as values in our anonymous types, like this:

```

var obj = new { 
 name = "value", 
 arr = new object[] { "one", "two", 3 } 
};

```
Now what happens if we want go the other way around, and create an array of anonymous types? We can do this:

```

var obj = new object[] {
 new { name = "value" },
 new { name = "value2" }
};

```
There is one problem with this however. Since we are defining our array type as object, trying to access the ‘name’ member like this:

```

obj[1].name

```
Results in the following error:

```

error CS1061: 'object' does not contain a definition for 'name' and no extension method 'name' accepting
 a first argument of type 'object' could be found (are you missing a using directive or an assembly reference?)

```
Fortunately we can make use of the ‘dynamic’ keyword (it is actually a type too!) in C# to defer static type checking on our objects by declaring the array like this:

```

var obj = new dynamic[] {
 new { name = "value" },
 new { name = "value2" }
};

```
Things are looking pretty rosy right now — sure, the added syntax is a bit of a drag compared to JSON, but so far we’ve done much less work than we would had we embedded another language.

There is one last piece to the puzzle — functions. C# supports anonymous functions in the form of either anonymous delegates or lambda functions. Either will work for our purposes here, although lambdas weren’t introduced until later, so it is possible that your version of the .NET framework won’t support them.

```

// using anonymous delegate
new Action( delegate() { 
 Console.WriteLine( "called function" ); 
})

// using lambda expression
new Action( () => { 
 Console.WriteLine( "called function" ); 
})

```
There is one trick here that I haven’t talked about yet: the Action delegate type. It turns out that an anonymous delegate or lambda expression can’t be directly assigned to a variable in our anonymous types, so we have to wrap them in a proper delegate instance. We could have created our own delegate type for this purpose, but .NET has a few built-ins that make our lives somewhat simpler. ‘Action’ is a delegate describes a function taking no parameters and returning void, perfect for our sample here which only produces the side effect of console output.

If we put everything together we can create complex objects like the following:

```

var obj = new { 
	name = "value", 
	function = new Action(() => { 
		Console.WriteLine( "called function" ); 
		string foo = "bar";
		var nested = new Action( () => { 
			Console.WriteLine( "inner function " + foo ); 
		});
		nested();
 },
	array = new dynamic[] { 
		"one", 
		"two", 
		new Action( () => { Console.WriteLine( "array function" ); } ),
		3
	}
};

```
Notice that I threw in an extra treat — there is a function called ‘nested’ nested inside of another function. The local variable ‘foo’ is visible to the nested function. Speaking of variables, this leads us to the biggest shortcoming that I’ve found with expressing object literals in C# — we have no access to the ‘this’ reference in our functions. In JSON we would be able to refer to the object instance in which the function is defined but in C# we do not. It may be possible to retrieve a reference to ‘this’ somehow using Reflection, so if some astute reader finds a method for doing so, I’d love to know about it.
