---
title: "MockCrm for testing MS CRM code"
date: 2011-01-27T01:59:26-08:00
---

# MockCrm for testing MS CRM code

I’ve been debating whether to release some code I’ve been playing with for a while for unit testing Microsoft CRM projects. I had hacked something together back in CRM 4 to test a project that was slow and tricky to test manually against a real CRM installation. But there wasn’t good test coverage on this code and there were a lot of cases that it didn’t handle.

I revisited the idea of creating a CRM mock service this week and created a version for CRM 2011 and it seems to be better suited for the new API.

The mock lets you set up some data at the top of the test like this:

```

m_service = new MockCrmService();
Entity de = new Entity();
de.LogicalName = "mydynamic";
de["prop1"] = "foo";
Guid deID = m_service.Create( de );

```
Then we can run a test on the fixture that we created in the code above like this:

```

	[FestTest]
		public void TestDynamic() {
			QueryBase query = CrmQuery
				.Select()
				.From( "mydynamic" )
				.Where( "mydynamic", "prop1", ConditionOperator.Equal, new object[] { "foo" } ).Query;

			EntityCollection bec = m_service.RetrieveMultiple( query );
			Fest.AssertTrue( bec.Entities.Count > 0, "found more than zero entities" );
		}

```
Note that these examples use my micro .NET unit testing library [Fest](https://github.com/dnewcome/fest) and my [CrmQuery](https://github.com/dnewcome/crmQuery) DSL for building CRM queries.

The reason I’m debating releasing this code is that I don’t know if I can spare the time and effort to polish this up. On the other hand I’ve benefited from Phil Haack’s experiments in [mocking .NET HttpContext](http://haacked.com/archive/2007/06/19/unit-tests-web-code-without-a-web-server-using-httpsimulator.aspx) and mocking [email servers](http://haacked.com/archive/2006/05/30/ATestingMailServerForUnitTestingEmailFunctionality.aspx). I guess sometimes it is useful to just see the approach that others are trying when it comes to testing. You don’t always need the polish. What do you guys think?
