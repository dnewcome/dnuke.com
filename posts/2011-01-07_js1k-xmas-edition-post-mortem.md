---
title: "JS1k Xmas Edition post-mortem"
date: 2011-01-07T19:56:37-08:00
url: https://newcome.wordpress.com/2011/01/07/js1k-xmas-edition-post-mortem/
id: 1244
categories: Uncategorized
tags: 
---

# JS1k Xmas Edition post-mortem

I submitted an [entry](http://js1k.com/2010-xmas/demos#id850) for the [JS1k Xmas competition](http://js1k.com/2010-xmas/) but I never posted anything about it here. I was very busy at the end of the year but one night I was feeling exhausted with everything so I sat down and started hacking around with some ideas for a Javascript game. An hour later I had the first inkling that maybe I’d be able to pull together something for the competition.

What I had hacked together didn’t really have a Christmas theme though, so I had to get creative with the back story to make it work. Snowmen are just a few circles and easy to draw, but seemed kind of boring. Everyone loves zombies so I just turned the snowmen green and called it good. I thought that anything with zombies in it would win for sure but I was wrong. So wrong, in fact, that I didn’t even make it into the top 10. There are a lot of things I think could have made my entry better.

### More detailed characters (zombie snowmen)

I thought that it wouldn’t be possible to make my zombies any more detailed and still hit the 1k limit. However, judging by some of the other entries, this seems to be incorrect. If I had put in some more details – maybe something a bit humorous – the game would have had a much greater appeal.

### Better hit detection

The way I initially created the snowman animation was to start with the main larger circle that forms the snowman body. All other coordinates on the character are based from this origin point. The point would roughly correspond to the belly button of the snowman (if snowmen had belly buttons). This was lazy on my part, since it would have been more intuitive to present either the head or the entire character bounding box as the hit zone. This probably caused some confusion for players that tried to register a kill without reading the directions.

### Satisfying kill animation

A large part of the appeal with a mindless shooter game, even one with otherwise non-lethal snowballs (which are like silver bullets to these undead snowmen) is a nice animation of the enemy’s demise. Something as simple as having the head fall off before removing the enemy from the playing field could have helped.

### A way to die and lose the game

Since this was a quick demo, I didn’t think to add something in the game loop that checked how close a zombie snowman was to the player. This would have been really easy to add and could have made it a real game (since you could actually die). There is a score counter, but it is relatively meaningless since all you need to do is play the game longer to get a higher score since you can never die.

### Multiple levels of play

There is only one difficulty level in the game as it stands. I could have increased the speed of the snowmen or maybe how often a new one spawned, which would have resulted in more snowmen as time went on. This, coupled with the snowmen actually killing you if they got to close could have made a better game.

Of course it’s possible that none of this would have helped me. Maybe zombie snowmen just aren’t going to cut it. It has been a while since I wrote the game now, so I don’t remember all of the things I was thinking at the time. Hopefully I’ll have the sense to look back at this for the next JS1k competition.
