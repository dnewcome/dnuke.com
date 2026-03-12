---
title: "Static method patterns"
date: 2011-12-14T02:32:10-08:00
---

# Static method patterns

When programming with statically-typed OO languages we all have the temptation sooner or later to implement some functionality using static methods. Static methods are “class” methods, which are called on the data types themselves rather than on an instance of a class.

In Microsoft .NET, Static methods are shared among all code that exists within a given application domain (appdomain). Static methods are very convenient for creating code that doesn’t need to deal with any external state, since we don’t have to create an instance of any class in order to call the code.

However, static methods do not participate in inheritance. They exist largely outside of the mechanisms that make object-oriented programming attractive. In light of this fact, I think that most of the time, static methods are an anti-pattern.

Static methods can make code hard to test since it is impossible to replace the static methods with alternative implementations such as mocks or stubs.

There is one workaround that I’ve found which I call the Static Adapter pattern. I have seen some references to this same pattern, and I don’t claim to have invented it, but I don’t see it listed in most classic design patterns books.

A static proxy is just like a classic proxy pattern but the methods on the proxy are static. For example, in a traditional proxy pattern we’d have something like this:

```

// proxied class
public class Service 
{
 public void DoSomething() {
 // something happens here
 }
}

public class ServiceProxy 
{
 // internally we have an instance of proxied class
 private Service m_service = new Service();

 // proxy the call to DoSomething()
 public void DoSomething() {
 m_service.DoSomething();
 }
}

```
In order to use the proxy, we do something like the following:

```

ServiceProxy proxy = new ServiceProxy();
proxy.DoSomething();

```
Notice that we have to create an instance of the proxy in order to work with it. Now there are two things that I want to extend this code to do. One is to allow me to avoid creating an instance of the proxy, and the other is to allow me to give the proxy a different internal service:

```

public class ServiceProxy 
{
 // internally we have an instance of proxied class
 public static Service m_service;

 // proxy the call to DoSomething()
 public static void DoSomething() {
 m_service.DoSomething();
 }
}

```
So now we have a static constructor that allows us to give the proxy its service implementation. The method DoSomething() can also now be called directly as:

```

ServiceProxy.m_service = new Service();
ServiceProxy.DoSomething();

```
We still have to specify the internal service for this to work. If we can get away with doing a default instantiation of the service we can do

```

ServiceProxy.DoSomething();

```
These static classes cannot implement an interface, but their internal services can. In order to provide a test implementation of some class we can plug in a dummy or test double as the internal service.

That’s enough for this post. I’ll have more to say about static classes and methods later.
