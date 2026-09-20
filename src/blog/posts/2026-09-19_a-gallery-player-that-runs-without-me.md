---
title: "A gallery player that runs without me"
date: 2026-09-19
tags:
  - posts
  - vj
  - webgl
  - webrtc
  - generative
  - installation
---


_2026-09-19_

## What happened

I have a gallery show built in TiXL, and it was hard to hand off. Keeping it running meant keeping TiXL running on my Mac laptop, the only machine with enough GPU to render the patch and push it out over NDI, and nobody else could host that. The obvious fix was to render everything to video and loop it, and it was the wrong fix, because the point of the work is that it's live. So over a few evenings I built a player instead. It's called vj-show, it runs in a browser, and this post is about the one decision that made everything else easy, plus what I think it means for the other two VJ tools I keep half-building.

**The tools I was looking at spend their GPU on the wrong thing.** TouchDesigner, TiXL, vvvv: a lot of the frame budget goes into rendering the node graph, not the output. In a gallery nobody is editing. Full editability all the time is the wrong default for a show. What I actually need there is guided modification: drop in occasionally, make a variation of what's playing, and have it join the rotation alongside everything that was already there. And installing software on venue hardware is the bottleneck every time, so if the player runs in a browser, any laptop with Chromium becomes a display in a minute.

**One constraint did most of the work.** Every scene is a pure function of show time and its parameters. No per-frame state, no `t += dt`. That sounds like a limitation and it turned out to be the whole design. Two instances that agree on the clock and the schedule render identical frames without exchanging any pixels, so multi-display sync becomes a clock problem instead of a video problem. A variation is just the same scene with different parameters, so the library accretes instead of forking. There's no state to corrupt over a twelve-hour run. And a control page can preview any scene at any moment because it only needs to know what time it is.

**Sync is NTP over a WebRTC data channel.** Each display opens the same page with a tile assignment. They find each other through a mailbox on a stdlib Python server, open a data channel, and then the server is irrelevant. The lowest id becomes leader and owns the schedule and the show clock. Followers ping it twice a second, keep the lowest-round-trip sample of the last sixteen, and slew their clock onto it at about 30 ms per second. On a LAN the round trip is under a millisecond. Each display renders only its own rectangle of the canvas, so two old laptops side by side show two halves of one animation, and the seam lines up. The honest limit is vsync: each display flips on its own refresh, so tiles land within a frame of each other rather than genlocked. In a browser that's as close as it gets.

**Nothing is in pixels.** The show declares a canvas aspect, `"canvas": "16:9"`, and every window shows a normalized rectangle of it. A per-window fit mode works like CSS `object-fit`: letterbox, zoom and trim, or stretch. The coordinate helpers take the canvas rectangle a window is showing and its pixel size, and the scale factors cancel, so a 4K projector and a phone preview compute identical coordinates for the same point.

**The control page is another peer with a screen.** Open the same page with `?mode=control` and you get two monitors, preview on the left and program on the right, switcher style, and a slider for every numeric parameter of the scene you're editing. Sliders go to the leader, which folds them into the state it already broadcasts once a second, so every tile converges on the same value and a display that reboots picks the tweaks up from the leader. A save button merges them into the scene file, displays hot-reload it, and the tweak is now part of the show. That's the accretion loop I wanted: tweak, watch, save. A control peer can never become leader, so a phone with a low id can't hijack the show or leave it leaderless when it walks out the door.

**Porting the heart was mostly reading HLSL.** The TiXL patch is a decimated heart mesh where a noise volume orbits through it and faces shrink toward their centroids where the noise selects them. TiXL ships every operator's source and compute shader, so the port was reading ScatterMeshFaces and SelectVertices and putting both into one vertex shader. Each vertex carries its face's three source positions, so the per-face selection average and the centroid shrink are computed exactly as the compute shader does. The camera, material, light, fog and glow follow the graph's values. It draws in a fraction of a millisecond. I still haven't compared it side by side with the real render, because the Mac was off.

**Two bugs worth writing down.** A scene module unbound the vertex array when it loaded, and the shader path assumed its own was still bound, so fragment-shader scenes drew nothing until a mesh scene had drawn in the same frame. The show got away with it only because the heart happened to play first. Every draw binds its vertex array now. The other one wasn't code: a plain static file server I'd started on the first evening was still holding port 8000, serving the pages fine and returning 404 to every signaling request. Everything looked alive and nothing was connected. The control page now turns its status line orange when it can't reach a display.

## Where this leaves fast-vj and vlfo

This is the third time I've built part of this problem. [fast-vj](https://github.com/dnewcome/fast-vj) is a performance sampler for the Raspberry Pi: clips, sub-frame OSC triggers, NEON decode, Lua patches. [vlfo](https://github.com/dnewcome/vlfo) drives ISF shaders from Pure Data over OSC, and glfo before it did the same thing in GEM, where getting a rendered frame into a framebuffer to crossfade it was a fight every time. Now there's vj-show, which is a show runner: unattended, multi-display, editable while it runs.

I spent a while wondering whether these should be one project. I don't think so, at least not as programs. They're three different jobs. A sampler is built around latency and a media library, and its clip-and-trigger model is deliberately stateful. A modulation environment is built around patching and control signals. A show runner is built around time and sync, and the pure-function-of-time constraint that made it work is exactly what a sampler can't promise. Merging them would mean rewriting one in the other's runtime, and a browser can't do fast-vj's decode path any more than a C binary on a Pi can do a zero-install kiosk.

What repeats isn't the apps. It's the layer under them, and that's where I'd converge.

The first recurring piece is the scene contract. All three are a fragment shader, some uniforms, time, and maybe audio. vlfo already uses ISF, which puts a JSON header inside the GLSL declaring inputs with names, defaults and ranges. vj-show could accept ISF with a small prelude, fast-vj's shader directory could follow, and the control page would get its slider ranges from the header instead of a guess. One shader, three players.

The second is control transport. fast-vj and vlfo speak OSC. vj-show speaks JSON over a data channel. A UDP listener in the little server that forwards OSC into the room means a Pd patch or a hardware controller drives the gallery show without the show knowing OSC exists. That's an adapter, not a merge.

So the plan is to stop building for a bit. Run installations with this, play gigs with fast-vj, patch with vlfo, and watch for two signals. If I catch myself copying a shader between repos and renaming uniforms by hand, it's time for the ISF prelude. If I catch myself wanting the sync layer in fast-vj, that's a library to extract, and it should stay a library. If neither happens after a few shows, the separation was right.

The code is at [dnuke-art/vj-show](https://github.com/dnuke-art/vj-show), with a static copy running at [dnuke-art.github.io/vj-show](https://dnuke-art.github.io/vj-show/) that works as a single display or a standalone control page (add `?mode=control`); sync needs the little server on a LAN. The roadmap in the repo has the program/preview switcher with a T-bar next, and the reason a manual T-bar across tiles is harder than it looks: a slider value that arrives on tile B a few milliseconds after tile A shows at the seam mid-fade, so the bar has to be sent as timed samples and interpolated, the same way game netcode moves other players.
