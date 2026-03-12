---
title: "Embedding IronJS &#8211; Part II"
date: 2011-03-13T11:53:24-08:00
---

# Embedding IronJS &#8211; Part II

Over the past year or so I have been working on-and-off on a project called [Node.NET](https://newcome.wordpress.com/2010/05/08/node-net-node-js-implemented-in-javascript-on-the-net-runtime/) in which I have experimented with embedding several different Javascript implementations within the .NET framework. Many different implementations exist including one integrated CLR implementation from Microsoft called JScript.NET. Although JScript is well integrated and allows us to write everything in Javascript, it isn’t well supported and I’m always wondering if it will be included at all in each new release of the .NET framework.

I have successfully used unmanaged Javascript implementations such as Google’s [V8](http://code.google.com/p/v8/) by compiling mixed-mode binaries using the Microsoft C++ compiler, which supports mixing native and managed code. However, this is much more complicated than writing pure managed code since in addition to marshaling between JS contexts and the CLR we have the added complexity of marshaling data between the CLR and native C++ code. To see what is involved the code from this early effort is still in the Node.NET project on github and there is now another project from Noesis dedicated to embedding V8 called [Javascript.NET](http://javascriptdotnet.codeplex.com/).

Since searching for a fully-managed JS implementation, I have found that [IronJS](https://github.com/fholm/IronJS) is the best solution so far, leveraging the [Dynamic Language Runtime](http://dlr.codeplex.com/) from Microsoft to handle many of the dirty tasks of garbage collection and code generation from the AST. This means that IronJS will benefit, along with IronPython, IronRuby and others, from all of the research that MS has done with dynamic languages on the .NET runtime.

In a past article I outlined my experiences with [embedding the first IronJS](https://newcome.wordpress.com/2010/05/25/embedding-ironjs/), which was written in C#. In this installment I will be using the newer F# IronJS implementation. This version of IronJS is a full rewrite and there have been lots of API changes and improvements. This article has been a long time coming since I have not had the time to dive into the new codebase until this past week. I’m not an expert at F# so I had to learn a bit of the language to figure things out since what I’m going to show here is not documented by the author. Since everything here was learned by reading the source and by reverse-engineering, there may be better ways to accomplish things and there may be some errors, so I apologize for this in advance.

Now, on to some code examples.

The very simplest thing we can do is create the Javascript context and execute a string of source code. Here we create the context and calculate 2+2 and write the result to the console:

```

 IronJS.Hosting.Context ctx = IronJS.Hosting.Context.Create();
 Console.WriteLine( ctx.Execute("2+2;") );

```
Beyond simply executing a string of code, the first thing we’d like to do when embedding a language is to make some code from the host environment available to the embedded language environment. In our case the host environment is the .NET CLR and the embedded environment is IronJS.

The most basic example is making a simple ‘print’ statement available so that we can output debug statements that print to the console from Javascript. Fortunately there is some code that does this right in the IronJS sources under the DevUI project. Here is my version of the Print host function:

```

static void Print(IronJS.Box box) {
 Console.WriteLine(IronJS.Api.TypeConverter.toString(box));
}

```
Notice that the argument type is IronJS. Box. The Box type is a concept introduced in IronJS which represents a value that is not known at compile time. Box may be required for certain argument types, but I have been able to get away with using System.String directly in some cases.

IronJS.Box is a struct laid out to mimic a C-style union like this:

```

type [<NoComparison>] [<StructLayout(LayoutKind.Explicit)>] Box =
 struct 
 //Reference Types
 [<FieldOffset(0)>] val mutable Clr : ClrObject 
 [<FieldOffset(0)>] val mutable Object : IjsObj
 [<FieldOffset(0)>] val mutable Array : IjsArray
 [<FieldOffset(0)>] val mutable Func : IjsFunc
 [<FieldOffset(0)>] val mutable String : IjsStr
 [<FieldOffset(0)>] val mutable Scope : Scope

 //Value Types
 [<FieldOffset(8)>] val mutable Bool : IjsBool
 [<FieldOffset(8)>] val mutable Number : IjsNum

 //Type & Tag
 [<FieldOffset(12)>] val mutable Tag : TypeTag
 [<FieldOffset(14)>] val mutable Marker : uint16
 end

```
IronJS provides a TypeConverter for dealing with Box values, so instead of trying to extract the data from a Box ourselves, it is safer to use the TypeConverter as shown in the line:

```

Console.WriteLine(IronJS.Api.TypeConverter.toString(box));

```
Now that we have a .NET function let’s put it into the global JS environment:

```

IronJS.Hosting.Context ctx = IronJS.Hosting.Context.Create();
 var print =
 IronJS.Api.HostFunction.create<Action<IronJS.Box>>(
 ctx.Environment, Print);
ctx.PutGlobal("print", print);

```
Now we can call the global ‘print’ function from Javascript:

```

 ctx.Execute("print( 'hello from javascript' )");

```
The next thing we want to do is to call a function that is defined in Javascript from the host environment. In IronJS, we do this by compiling the function to a .NET delegate and then invoking the delegate. Once the initial Javascript code has been executed, we get a reference to the global function that is created using GetGlobal.

```

 IronJS.Hosting.Context ctx = IronJS.Hosting.Context.Create();
 ctx.Execute("hello = function() { return 'hello from IronJS' }");
 IronJS.Box obj = ctx.GetGlobal("hello");
 Func<IronJS.Function,IronJS.Object,IronJS.Box> fun = 
 obj.Func.Compiler.compileAs<Func<IronJS.Function,IronJS.Object,IronJS.Box>>(obj.Func);
 
 IronJS.Box res = fun.Invoke(obj.Func, obj.Func.Env.Globals);
 Console.WriteLine( res.String );

```
One thing to notice is that the delegate signature has two extra arguments — IronJS.Function and IronJS.Object, which will take the function itself and the target object on which to call the function. This was mostly reverse engineered from the implementation of Array.Sort() which can take a sort function as an argument.

Beyond calling global methods we’ll want to control the creation of Javascript objects and call methods in different execution scopes, but I’m going to have to cover that in a future article. Node.NET requires a few more advanced embedding techniques but for now this will get you started embedding newest version of IronJS.
