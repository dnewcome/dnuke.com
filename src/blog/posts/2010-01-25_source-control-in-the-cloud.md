---
title: "Source control in the cloud"
date: 2010-01-25T01:50:46-05:00
---

# Source control in the cloud

I’ve been experimenting with using [GitHub](https://github.com/) for a few small projects that I have in mind, and I just had a minor revelation about having source control as a web service. I checked in a file and realized that I didn’t finish commenting something important in the header. Ordinarily I would have gone back to my development environment and made the change and checked it in. However, while viewing the file on GitHub I noticed that I could edit the file online in the browser, with nice source highlighting and all.

Given that I’ve set up countless source control servers over the years it seems as though this kind of thing would be minor, but it really just cemented a few things for me in terms of the impact that better tools for source control might bring in the future. Although I typically install some kind of web server for online viewing of the source, I’ve found many of these tools difficult to set up and even more difficult to use for anything other than basic source viewing.

I’ve been a Subversion user and proponent for several years now, having moved out of a dark period with SourceSafe some years ago. I was able to convince my former employer at the time to migrate our codebase out of SourceSafe and into Subversion (using the [vss2svn](http://www.pumacode.org/projects/vss2svn) conversion script).

For all of the hype that projects such as Mozilla’s Bespin project have been generating about running your IDE in the cloud, I can see that the real importance of putting tools in the cloud is the ability to do things like managing builds and running tests — all of the things that you do on a server in your own environment anyway.

Beyond convenience, using services like GitHub could provide a way for the members of your team to collaborate on your codebase informally and experimentally. Forking the codebase is easy, and there is better visibility as to what the fork is trying to accomplish — there have been many times wherer I would see a branch in one of my SVN repositories where I didn’t know what the branch was for right away.
