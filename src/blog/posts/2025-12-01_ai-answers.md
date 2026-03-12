---
title: "AI Answers"
date: 2025-12-01T16:35:40-08:00
tags: ["ai", "api", "artificial-intelligence", "programming", "technology"]
---

# AI Answers

Every once in a while I ask myself a pretty general overview question. Normally I poke around the programming subreddit or maybe look on Stack Overflow. AI has been kind of useful for not making any real decision but just summarizing the internet zeitgeist the same way I would doing initial discovery. I still read what AI gives me with extreme prejudice and come up with my own conclusions but I must admit it does do a great job at presenting most alternatives and their arguments.

I recently wondered if there was a well-known location to put OpenAPI specs. In the past days of SOAP APIs there was a path for the `WSDL` file (Web Service Description Language) that defined the API. There were plenty of bad ideas around SOAP but the service discovery was not among them (IMO). 

Let’s see what Gemini had to say:

> 
The OpenAPI Specification (OAS) does not define a single official “well-known location” or mandatory file path for its documents. The location is determined by the implementation of the API or server hosting the file. 

However, several common conventions and emerging standards exist for discoverability:

Common Conventions and Best Practices

- **Recommended Filenames**: The [OpenAPI Specification](https://spec.openapis.org/oas/v3.2.0.html) recommends that the entry document be named `openapi.json` or `openapi.yaml` depending on the format used. For older Swagger specifications, `swagger.json` was the standard name.

- **Common Endpoints**:

**`/api-docs`**: This is a widely used conventional endpoint for hosting documentation.

- **`/openapi.json` or `/openapi.yaml`**: Many APIs make the document available directly at these paths, often relative to the API’s base URL.

- **`/swagger.json`**: Often used for APIs built with older Swagger tooling.

- **`/swagger/v1/swagger.json`**: Microsoft’s ASP.NET Core implementations often use a similar versioned path structure by default. 

Emerging Standards for Discovery

- **Well-Known URI (`/.well-known/`)**: There have been discussions and a recent RFC to standardize discovery under the IETF’s well-known URI standard (RFC 5785).

**`/.well-known/api-catalog`**: RFC 9727 defines this specific location for an API catalog, which is a document (using the Linkset format) that can point to multiple API descriptions.

- **`/.well-known/openapi.json`**: This path has been proposed and is sometimes used in practice to make the single specification file easily discoverable.

- **HTTP Link Headers**: Another proposed method for automated discovery is to use the `Link` header in HTTP responses to point to the location of the OpenAPI document, often using the “service-desc” link relation type. 

In practice, the exact location depends entirely on how the API provider or web framework has configured the service. 

That’s pretty cool. Apparently the SOAP `.well-known` system is an IETF RFC now. Or, maybe it was then too, I don’t know. 

At any rate it looks like just putting `openapi.yaml` at the root of the service is a simple and mostly acceptable way of doing things. I’ll probably just do that. It’s also worth noting that the online Swagger tool is often exposed via `/api-docs`. That seems like a good idea too, I’ll probably do that.
