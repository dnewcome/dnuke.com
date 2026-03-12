---
title: "Writing a .NET unit testing framework in 100 lines of code"
date: 2011-06-11T11:18:17-08:00
url: https://newcome.wordpress.com/2011/06/11/writing-a-net-unit-testing-framework-in-100-lines-of-code/
id: 1425
categories: Uncategorized
tags: 
---

# Writing a .NET unit testing framework in 100 lines of code

Some time ago, I got frustrated with setting up NUnit for simple testing projects. I didn’t want to bother with the test runner, and I didn’t want to mess with any tooling in Visual Studio. My lazy default for doing the tests was to create a new console application and use it to drive the system under test.

After a while I figured it was about time to at least put my assertion code into a project and reuse that every time I did a lazy console test runner. You know how these things go after that. I figured it couldn’t be too hard to support using .NET attributes to mark test cases and maybe do test fixtures. I ended up with a complete unit-testing framework including assertions in under 100 lines of code. You can see the result on [github](https://github.com/dnewcome/fest/blob/master/fest.cs).

In order to enable something like this:

```

[FestTest]
public void FirstTest() {
 // do AAA here
}

```
We need to get all methods in the assembly that are adorned with the FestTest attribute and run them. Seems simple enough, here is the basic framework:

```

Assembly executingAssembly = Assembly.GetCallingAssembly();
Type[] types = executingAssembly.GetTypes();
foreach( Type type in types ) {
	MethodInfo[] methods = type.GetMethods();
	foreach( MethodInfo method in methods ) {
		object[] attributes = method.GetCustomAttributes( typeof( FestTest ), true );
		if( attributes.Length > 0 ) {
			// Invoke the test method here
		}
	}
}

```
In my final version of the code I decided to support the use of test fixtures using attributes as well. That is, you are able to inject a new instance of a fixture into a test method using something like this:

```

// test fixture we'd like to inject into the test
public class MyFixture { 
	public string teststring = "teststring";
}

[FestTest]
[FestFixture( typeof( MyFixture ) )]
public void Test1( MyFixture myfixture ) {
	...
	Fest.AssertEqual<string>( myfixture.teststring, "teststring");
}

```
This added to the complexity of the code significantly, but still the library comes in at under 100 lines. I’ll post some details about how I did this in a future blog post.
