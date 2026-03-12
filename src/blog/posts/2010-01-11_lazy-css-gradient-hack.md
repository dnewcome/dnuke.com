---
title: "Lazy css gradient hack"
date: 2010-01-11T23:39:43-05:00
---

# Lazy css gradient hack

I was creating a new site template for a website that I’m working on and I found myself in need of some gradient images for the header bar at the top of the page. I fired up Gimp and whipped up a png file to use for the top bar. As I progressed through the site design I realized that I wanted to change the color scheme, which meant that I had to generate another png in Gimp. Not knowing how many iterations of this I was in for, I started looking for other solutions.

There are several ways of getting gradients done programmatically. I found one that even [pre-generated the html](http://www.designdetector.com/demos/css-gradients-demo-1.php) markup on the server. There were also [several](http://ajaxian.com/archives/css-gradients-for-all) that [used](http://slayeroffice.com/code/gradient/) [Javascript](http://osteele.com/sources/javascript/docs/gradients) to generate a series of <div> elements or a <canvas> element that contained the generated gradient image.

However, I wanted a quick way to experiment with my color scheme without pulling any extra code temporarily. Most of the gradients that I use fade from the foreground color to white, so I thought that just using an overlay image that faded from fully transparent to white should give me the effect that I was looking for.

Here is the[ image file](https://newcome.wordpress.com/wp-content/uploads/2010/01/white-grad.png) that I generated using Gimp. Note that I’m showing a Gimp screenshot of a wider image below in order to illustrate how the image was created.

![\1](/images/2010-01-11_lazy-css-gradient-hack_whitegrad-screenshot.png)

In order to achieve our effect, instead of a single <div> element with a background image set, we need two extra <div> elements — one to serve as a container, and another to serve as the backdrop color that will show through from under the transparent overlay. Here is the html needed (the boilerplate html tags have been omitted for clarity):

```

<div id="container">
 <div id="background"></div>
 <div id="overlay"></div>
</div>

```
Unfortunately we need a comparatively large amount of css, but it still isn’t so bad. Notice that the main trick here is that the container serves as the positioning parent for the two elements that make up the gradient bar. The #background and #overlay elements are absolutely positioned with the same height and width so that they will occupy the same x and y positions.

```

#container {
 position: relative;
 height: 120;
}

#background {
 position: absolute;
 background-color: green;
 height: 120px;
 width: 100%;
}

#overlay {
 position: absolute;
 background-image: url('images/white-grad.png');
 background-repeat: repeat-x; height: 120;
 width: 100%;
}

```
If everything is set up as expected, our page will look like this:

```

![\1](/images/2010-01-11_lazy-css-gradient-hack_greenbar-screenshot.png)

```
Not incredibly impressive until we try the following: change the background-color of #background to black.

#background { … background-color: black; … }

![\1](/images/2010-01-11_lazy-css-gradient-hack_blackbar-screenshot.png)

Now the gradient bar is black, and we didn’t have to go back to Gimp to create any more images.

If you look closely at the images you will notice that the main drawback of this method is that the gradient is not very smooth. I only tested this in Firefox, so maybe it looks better in other browsers. It doesn’t matter to me since I will create the desired png file when I have my color scheme figured out.

Hopefully this technique is useful to someone, otherwise just grab one of the fancy Javascript gradient libraries that I listed above and get to it.
