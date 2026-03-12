---
title: "Coordinating software development with CruiseControl"
date: 2010-10-05T22:06:29-05:00
url: https://newcome.wordpress.com/2010/10/05/development-with-cruisecontrol/
id: 1139
categories: Uncategorized
tags: 
---

# Coordinating software development with CruiseControl

I ordinarily don’t write about my client work here, but since it pertains to good software engineering practices in general, I wanted to publish this article here on my main blog. I initially titled this post “Continuous integration with CruiseControl”, but what I’m describing isn’t [full-fledged CI](http://en.wikipedia.org/wiki/Continuous_integration), although it incorporates many of its tenets.

**The scenario:**

The most recent consulting project that I did was for a medical certification board in which the client needed a web portal for managing the test registration and certification process. I did most of the work early in the project, building the framework of the site including workflows and some generic page rendering controls. For the final push to deliver the site, there were a total of four developers and business analysts making changes to the site simultaneously. The site was particularly configuration driven, and we were maintaining a demo site for periodic client walkthroughs and inspections.

As work progressed I noticed an increasing number of emails going around to the tune of “the project won’t build for me anymore” and “I pushed my code to the demo site and now everything is broken”. We were stepping all over each other pushing code to the demo site and checking in configuration changes.

**The solution:**

In the past I’ve always set up a common build environment for building any code for shipping or deployment. Known informally as the “build box”, it can be a virtual machine or a shared host on a virtual hosting provider out in the cloud. Actually, I think it is better than having a physical machine as it makes multiple build environments very easy to accommodate. Sometimes dependencies can be difficult or impossible to install side-by-side on a single OS instance to allow building multiple configurations on the same machine.

The goal was to enable everyone on the team to build the site on a separate box with known dependencies to smoke-test the commit, and to deploy the code to the demo site. The first order of business was to write a build script so that we have a repeatable way of building the product. Since this was a single ASP.NET web site, all I had to do was to create a small batch file, which I unceremoniously entitled “build.bat”, consisting of a single call to aspnet_compiler:

```

C:\WINDOWS\Microsoft.NET\Framework\v4.0.30319\aspnet_compiler -f -v /MyApp -p "C:\Program Files\CruiseControl.NET\server\sandbox" C:\Inetpub\wwwroot\certification

```
Aspnet_compiler unfortunately does not accept relative paths when used like this, so I actually had two scripts — one for building locally and one used when triggered on the build box. Had I been feeling more ambitious I could have modified the script to take a base path argument. Notice that the output path is under the IIS root path, so we end up both building the code and deploying it in one swoop.

In theory everyone on the team could log onto the build box, do a Subversion update to get the latest code and run the build script to make sure things build and update the demo site. However, there are some nice things about a CI server such as email notifications and build history that I wanted to have available, so I still wanted to get CruiseControl running on the build box.

**Installing CruiseControl.NET:**

I used the [installer ](http://sourceforge.net/projects/ccnet/files/CruiseControl.NET%20Releases/)to install the CCNet Windows service and the web portal. The installer did not create an ASP.NET web application for the site, so I had to manually go into IIS manager and add the following path as a web application:

```

C:\Program Files\CruiseControl.NET\webdashboard

```
Also note that the installer installs the Windows service but does not set it to start up automatically, so you will probably want to go into services.msc and change ‘CruseControl.NET Server’ to ‘Startup Type: Automatic’.

Once the service is running and the website is up, we need to configure a project in CruiseControl. This is done using the file ccnet.config which is located in the CruiseControl installation directory. Here we can set up the source control location and email notifications. I’ll show my configuration here and make a few notes on it, but it is worth checking the official documentation as there are a lot of configuration options. Getting email alerts to work was the most difficult thing, so hopefully my configuration can jumpstart you in this regard.

```

<project name="Portal" >
 <sourcecontrol type="svn">
 <trunkUrl>http://scc/svn/dev/trunk/Clients</trunkUrl>
 <workingDirectory>C:\Program Files\CruiseControl.NET\server\sandbox</workingDirectory>
 <username></username>
 <password></password>
 <executable>C:\Program Files\svn-win32-1.6.6\bin\svn.exe</executable>
 </sourcecontrol>
 <tasks>
 <exec executable="C:\Program Files\CruiseControl.NET\server\sandbox\build.bat"/>
 </tasks>
 <publishers>
 <xmllogger/>
 <email from="cruisecontrol@altaisystems.com" mailhost="mailserver">
 <users>
 <user name="Dan Newcome" group="Developers" address="xxx@altaisystems.com"/>
 </users>
 <groups>
 <group name="Developers">
 <notifications>
 <notificationType>Always</notificationType>
 </notifications>
 </group>
 </groups>
 </email>
 </publishers>
</project>

```
One gotcha that I ran into was that once you specify an email publisher, the XML logger must be explicitly defined. In the absence of a publishers section, the XML logger is defined automatically. I bring this up because the XML logger is necessary for capturing the build output for viewing on the website.

I’ll save the details of setting up email notifications for another post. In the meantime hopefully this plants the seed in your head that there is a better way of getting everyone’s commits working together than just having everyone test their builds by hand. Along with source control and a bug tracking system, a continuous integration server is one of the cornerstones of modern software development practice.
