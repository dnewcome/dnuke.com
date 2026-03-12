---
title: "Stupid .NET serialization tricks"
date: 2010-07-08T14:07:31-05:00
---

# Stupid .NET serialization tricks

I’ve been meaning to write up a few things about .NET serialization that I’ve come across recently. I have a basic set of maneuvers for getting the XML output to look like you need it to in the case that you are trying to use some .NET data structures as the basis for writing out some XML to be consumed by another service. However, I’m not going to cover that right now — rather, I’m going to illustrate a solution that I found to a potential show-stopper that I came across in some work for a client.

I needed a way to quickly feed some canned data to an application targeting Microsoft CRM. I was going to be tweaking the data a lot during the development of the solution, so I didn’t want to spend all day clicking around in the CRM customizations UI — I wanted to just edit a file. This would let me go between different versions of a customized entity also.

So I hacked up a dummy service that implemented ICrmService so that I could hand it off to my application without it knowing it was getting canned data. Microsoft dropped the ball by providing ICrmService, but not actually using it in their service implementation. This required another workaround, which I won’t go into here. Apart from this issue, the code took very little time to write, as all I did was take the business entities and throw them into a Dictionary<string, List> and pull them out when the application requested them.

The issue came when I wanted to persist the data structure to disk. The BusinessEntity and DynamicEntity instances were serializable, so I didn’t envision having difficulties just spinning the whole data structure to disk. For example, the following code worked just fine to serialize an instance of the CRM ‘contact’ entity:

```

XmlSerializer serializer = new XmlSerializer( typeof( contact ) );
serializer.Serialize( Console.OpenStandardOutput(), myContact );

```
So I started by just serializing my whole nested data structure type, Dictionary<string, List>

```

XmlSerializer serializer = new XmlSerializer( typeof( Dictionary<string, List<BusinessEntity>> ) );
serializer.Serialize( Console.OpenStandardOutput(), dataStructure );

```
Fist issue is that Dictionary is not serializable. I have run across this before, and somehow I seem to forget it each time. It doesn’t make much sense, since List is perfectly serializable. I have solved this in the past by subclassing the generic dictionary class. This time around I used an implementation that I found [here](http://weblogs.asp.net/pwelter34/archive/2006/05/03/444961.aspx).

The second issue was that types derived from the base types specified explicitly in the data structure type aren’t recognized by the default .NET serialization methods. I’m sure we could implement our own serializer, but that sounds like more trouble that it’s worth. In order to let the serializer know about other types that it may run into, we need to use the XmlInclude attribute on the base class. Everything derives from BusinessEntity, so we could fix things by adding the following attributes to the definition of BusinessEntity:

```

[XmlInclude( typeof( contact ) )]
[XmlInclude( typeof( subject ) )]
....

```
Unfortunately we can’t change BusinessEntity, since it is part of the CRM SDK. Even if we had the source, it would be ill-advised. The first thing I thought of was subclassing BusinessEntity like this:

```

	[XmlInclude( typeof( contact ) )]
	[XmlInclude( typeof( subject ) )]
	public class MockBusinessEntity : BusinessEntity
	{
	}

```
The problem with this is that in C# we can’t easily downcast and C++ style reinterpret_cast is completely out of the question. You’d probably have to disassemble everything to MSIL and hand tweak it. Even then, Anders Hejlsberg would probably come out from Redmond and punch you in the face. Or at the very least give you a noogie and a stern talking-to. Even if we managed to get the cast to work, I’d imagine that .NET serialization looks at the reflected runtime type of the object anyway, so it probably still wouldn’t work.

After some experimentation, I found that the XmlInclude attribute doesn’t have to appear in the inheritance hierarchy, just in the data structure itself. So Instead of using List I created a collection class called BusinessEntityList. Here is the code:

```

	[XmlInclude( typeof( contact ) )]
	[XmlInclude( typeof( subject ) )]
	public class BusinessEntityList : List<BusinessEntity>
	{
	}

```
Now our data structure type looks like this:

SerializableDictionary 

And serialization works as expected 

```

XmlSerializer serializer = new XmlSerializer( typeof( SerializableDictionary<string, BusinessEntityList> ) );
serializer.Serialize( Console.OpenStandardOutput(), dataStructure );

```
One unfortunate limitation of this solution is that each type that we need to handle must be represented in an XmlInclude attribute. In CRM there are probably 100 different built-in types, so in order to handle them all, we’ll need to maintain a lot of attributes.

**Update:** I have since avoided this issue entirely by simply using BusinessEntityCollection in lieu of a List. This should have been blindingly obvious, but I didn’t think of it at the time I was dealing with this initially.
