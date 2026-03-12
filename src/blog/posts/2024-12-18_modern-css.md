---
title: "Modern CSS"
date: 2024-12-18T18:32:37-08:00
tags: ["css", "html", "javascript", "programming", "web-development"]
---

# Modern CSS

I’m writing a little UI and I was looking around at CSS frameworks. I know that Tailwind is pretty much what everyone uses now. I used to be on a team at Yahoo that developed the concept of Atomic CSS and Tachyons. These were minimal CSS-only frameworks that didn’t rely on React or anything.

I’m looking into modern CSS features now and wondering if there is a way to put something together using new features like variables and flexbox which did not exist back when I first started looking at CSS.

I had some guidelines that I published previously here [https://newcome.wordpress.com/2017/08/23/csstem/](https://newcome.wordpress.com/2017/08/23/csstem/) 

It looks like [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) could help us with theming.

```
:root {
 --main-bg-color: cornflowerblue;
}
.rbox {
 border: 1px solid;
 border-color: var(--main-bg-color);
 border-radius: 10px;
 overflow: hidden;
 width: 10vw;
 height: 10vh;
}

<div class="row">
 <div class="col">
 <div class="rbox lout">Lorem ipsum lorem ipsum lorem ipsum Thing 1 thing blah blah sdfsdf</div>
 <div class="rbox lout"></div>
 </div>
 <div class="col">
 <div class="rbox lout"></div>
 <div class="rbox lout"></div>
 </div>
</div>
```

![\1](/images/2024-12-18_modern-css_screenshot-2024-12-18-at-6.31.30e280afpm.png)

Just simple stuff is way easier these days.
