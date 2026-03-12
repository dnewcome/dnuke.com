---
title: "Accessing Microsoft CRM from IronRuby"
date: 2010-12-04T22:39:25-05:00
url: https://newcome.wordpress.com/2010/12/04/accessing-microsoft-crm-from-ironruby/
id: 1229
categories: Uncategorized
tags: 
---

# Accessing Microsoft CRM from IronRuby

In a fit of madness It crossed my mind to try to get data out of Microsoft CRM using Ruby. The reason isn’t important now, and I may blog about it later, but suffice it to say that I hoped that it would be possible to leverage the CRM SDK libraries in other .NET environments and that it wouldn’t be necessary to resort to the odd Ruby SOAP library to accomplish the task.

There are some oddities when loading existing .NET assemblies within the IronRuby environment, but they are easily understood and don’t prevent us from getting the SDK libraries to work.

Let’s get started. We need 2 things to get things working: [IronRuby](http://ironruby.net/Download) and the [CRM 4 SDK](http://www.microsoft.com/downloads/en/details.aspx?FamilyID=82e632a7-faf9-41e0-8ec1-a2662aae9dfb&displaylang=en). Of course it also helps to have a CRM installation handy to test that it actually works.

For starters, let’s get a simple .NET program running in IronRuby:

*file: hello-dotnet.rb*

```

require "System, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089"
System::Console::WriteLine( 'Hello World' )

```
Running with IronRuby looks like this:

```

ir.exe hello-dotnet.rb

```
Several things to note — first is that we use require in the code rather than a compiler reference to access the .NET assembly. Just like in any other .NET code, we reference the assembly with its [display name](http://blogs.msdn.com/b/suzcook/archive/2003/05/29/57137.aspx) that describes its identity. It should also be obvious that, like many other languages, IronRuby uses a double colon :: scope resolution operator. This means that namespaces and static methods of objects must be accessed via this operator rather than the single dot operator that C# and VB uses.

Another odditiy that will be evident in the next code sample that we’ll look at is that method and member names are rewritten from pascal or camel case to Ruby naming conventions. For a good tutorial on this check out [IronShay’s post](http://ironshay.com/post/Starting-Using-IronRuby-in-25-Minutes.aspx) on running .NET code in IronRuby. 

```

require "System, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089"
require "microsoft.crm.sdk.dll"
require "microsoft.crm.sdktypeproxy.dll"
require "CrmQuery.dll"

include Djn::Crm
include Microsoft::Crm::Sdk
include Microsoft::Crm::Sdk::Query

query = CrmQuery.select().from( 'contacts' ).query
bec = DynamicEntityHelper::get_dynamic_entity_collection( query );
puts bec.business_entities.count

```
This code uses [CrmQuery](https://github.com/dnewcome/crmQuery) to build the query and a helper that wraps the CRM CrmService’s Execute() method. I haven’t shown the helper code but the CRM SDK contains most of the boilerplate stuff that you need to create a service connection so I haven’t shown it here.

I’m going to be using the capability that I’ve just shown in an upcoming CRM project that I’m keeping under wraps for now. I’ll detail more about what I have in mind in a later post.
