---
title: "Code reading: ASP.NET MVC"
date: 2011-01-11T01:29:05-08:00
---

# Code reading: ASP.NET MVC

I’ve been looking around for a good RESTful API framework for .NET to possibly implement an API design that I’ll be working on soon. One of the things I’m considering (other than WCF) is using ASP.NET MVC as a Web service. I’m not going to go through the whole MVC codebase here, but I was digging through it to find out how something was done so I thought I’d write up my notes here as a new installment of my Code Reading series.

As powerful as code metadata and reflection is in the .NET framework, there are often things that I find myself wanting to do that turn out to be awkward (and therefore almost not worth the effort) or just impossible without resorting to metaprogramming techniques like emitting IL or rewriting and compiling code files on the fly. One of the things that I always thought should be pretty straightforward was adding logging or error handling to a method using the .NET attribute mechanism. 

For example consider the following method:

```

public List<Employee> GetEmployees() {
 // get empoyees here
}

```
What I’d like to do is add simple trace logging to the method by adding an attribute to it like this:

```

[CallTrace]
public List<Employee> GetEmployees() {
 // get empoyees here
}

```
where CallTrace causes a log entry to be written when the entry and exit points of the method are reached, which might look something like this:

```

Starting logging...
2011-01-10 TRACE - Entered GetEmployees()
2011-01-10 TRACE - Exited GetEmployees()

```
As far as I know there is no way to cause an attribute applied to a method to hook into the method without using reflection somewhere within the method or externally to search out any attributes that may be applied, which unfortunately falls under the aforementioned category of “awkward and more trouble than it’s worth”. The only solutions that I’ve come up with that avoid adding code to the methods themselves involves rewriting the class using reflection and emitting a new class with the new code inserted. In case you are wondering that is a big pain.

So, after having gone through this thought exercise I was surprised today when looking through some ASP.NET MVC documentation that mentioned that you should be able to do just what I was trying to do above using a mechanism called an ActionFilter. The idea is that you can create an attribute that implements ActionFilterAttribute and then you can apply it to a controller method and have actions trigger when the method is called. Here is an example that I found [here](http://www.asp.net/mvc/tutorials/understanding-action-filters-cs) (modified for brevity):

```

 public class LogActionFilter : ActionFilterAttribute
 {
 public override void OnActionExecuting( ActionExecutingContext filterContext )
 {
 Log("OnActionExecuting", filterContext.RouteData); 
 }

 private void Log(string methodName, RouteData routeData)
 {
 Debug.WriteLine( routeData.Values["action"], "Action Filter Log" );
 }

 }
}

```
This attribute could be applied to a MVC Controller action like so:

```

[LogActionFilter]
public List<Employee> GetEmployees() {
 // get empoyees here
}

```
So my goal was to read through the MVC source to find out how the authors accomplished this feat.

Browsing through the code I found the following promising file:

*ActionMethodSelector.cs*

```

 private void PopulateLookupTables() {
 MethodInfo[] allMethods = ControllerType.GetMethods(BindingFlags.InvokeMethod | BindingFlags.Instance | BindingFlags.Public);
 MethodInfo[] actionMethods = Array.FindAll(allMethods, IsValidActionMethod);

 AliasedMethods = Array.FindAll(actionMethods, IsMethodDecoratedWithAliasingAttribute);
 NonAliasedMethods = actionMethods.Except(AliasedMethods).ToLookup(method =&gt; method.Name, StringComparer.OrdinalIgnoreCase);
 }

```
It turns out to be not a bad start for digging into the code. We see that ASP.NET MVC is using reflection to build a list of available action methods and store them in a lookup table. This is probably some kind of dispatch table, so let’s keep looking through code files.

Next up we have a dispatcher class.

*ActionMethodDispatcher.cs*

```

 private static ActionExecutor GetExecutor(MethodInfo methodInfo) {
 // Parameters to executor
 ParameterExpression controllerParameter = Expression.Parameter(typeof(ControllerBase), "controller");
 ParameterExpression parametersParameter = Expression.Parameter(typeof(object[]), "parameters");

 // Build parameter list
 List parameters = new List();
 ParameterInfo[] paramInfos = methodInfo.GetParameters();
 for (int i = 0; i &lt; paramInfos.Length; i++) {
 ParameterInfo paramInfo = paramInfos[i];
 BinaryExpression valueObj = Expression.ArrayIndex(parametersParameter, Expression.Constant(i));
 UnaryExpression valueCast = Expression.Convert(valueObj, paramInfo.ParameterType);

 // valueCast is &quot;(Ti) parameters[i]&quot;
 parameters.Add(valueCast);
 }

 // Call method
 UnaryExpression instanceCast = (!methodInfo.IsStatic) ? Expression.Convert(controllerParameter, methodInfo.ReflectedType) : null;
 MethodCallExpression methodCall = methodCall = Expression.Call(instanceCast, methodInfo, parameters);

 // methodCall is &quot;((TController) controller) method((T0) parameters[0], (T1) parameters[1], ...)&quot;
 // Create function
 if (methodCall.Type == typeof(void)) {
 Expression lambda = Expression.Lambda(methodCall, controllerParameter, parametersParameter);
 VoidActionExecutor voidExecutor = lambda.Compile();
 return WrapVoidAction(voidExecutor);
 }
 else {
 // must coerce methodCall to match ActionExecutor signature
 UnaryExpression castMethodCall = Expression.Convert(methodCall, typeof(object));
 Expression lambda = Expression.Lambda(castMethodCall, controllerParameter, parametersParameter);
 return lambda.Compile();
 }
 }

```
This code builds up a lambda expression for later execution. I don’t see any places where we would be injecting code from the attributes however. I could be missing something here, but let’s move on for now. The next thing I saw was an action invoker. Let’s take a look at an excerpt from this class (edited for brevity):

*ControllerActionInvoker.cs*

```

 public virtual bool InvokeAction(ControllerContext controllerContext, string actionName) {
 ...

 ControllerDescriptor controllerDescriptor = GetControllerDescriptor(controllerContext);
 ActionDescriptor actionDescriptor = FindAction(controllerContext, controllerDescriptor, actionName);
 if (actionDescriptor != null) {
 FilterInfo filterInfo = GetFilters(controllerContext, actionDescriptor);

 try {
 AuthorizationContext authContext = InvokeAuthorizationFilters(controllerContext, filterInfo.AuthorizationFilters, actionDescriptor);
 if (authContext.Result != null) {
 // the auth filter signaled that we should let it short-circuit the request
 InvokeActionResult(controllerContext, authContext.Result);
 }
 else {
 if (controllerContext.Controller.ValidateRequest) {
 ValidateRequest(controllerContext);
 }
 else {
 ValidationExcludeAllAction();
 }

 IDictionary parameters = GetParameterValues(controllerContext, actionDescriptor);
 ActionExecutedContext postActionContext = InvokeActionMethodWithFilters(controllerContext, filterInfo.ActionFilters, actionDescriptor, parameters);
 InvokeActionResultWithFilters(controllerContext, filterInfo.ResultFilters, postActionContext.Result);
 }
 }
 ...

 return true;
 }

 // notify controller that no method matched
 return false;
 }

```
Here we have the smoking gun. We get filters that were applied via attributes:

```

 FilterInfo filterInfo = GetFilters(controllerContext, actionDescriptor);

```
then we use those filters for authentication, and later we apply all remaining filters with this line:

```

 ActionExecutedContext postActionContext = InvokeActionMethodWithFilters(controllerContext, filterInfo.ActionFilters, actionDescriptor, parameters);

```
Overall, pretty cool but not what I was hoping to find. I wanted to see some clever way of making the classes self-aware of their attributes rather than an external invocation mechanism. Hopefully you enjoyed the ride.
