---
title: "Writing Twitter Bots"
date: 2008-09-25T15:29:15-05:00
---

# Writing Twitter Bots

I’m in the middle of writing a Twitter bot, but Twitter just went down.  Maybe some parts are working, but right now twitter.com points to some staging server of theirs, probably as a result of some misconfiguration on their part.  Thus, I think maybe it is appropriate to blog about it since I don’t want to completely switch gears from thinking about what I’m doing.

Initially, when poking around the API using cURL, I thought that doing a little pull-based bot would not be a big deal.  After all, they are just using HTTP based authentication, so grabbing some data from the API is as simple as making a request to the URL with the right Http auth headers.

The sticky bits didn’t come until I realized that I would need to follow everyone that I want to receive a direct message from.  There seems to be a mythical befreind_all call, but my experiments show that this was either removed, or never worked in the first place.  This would not be a problem, but there is no call to pull the list of people who have followed you, so that you can programmatically follow them too.  Enter the painful world of screen scraping and simulating a web browser.
