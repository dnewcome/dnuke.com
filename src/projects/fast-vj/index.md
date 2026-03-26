---
layout: project-page.njk
title: "fast-vj"
slug: fast-vj
description: "Realtime VJ sampler for live performance — GPU shader effects, OSC control, and LuaJIT scripting on Raspberry Pi 4 at 60fps."
tags: [video, performance, opengl, lua, osc, raspberry-pi, c]
github: "https://github.com/dnewcome/fast-vj"
has_demo: false
permalink: /projects/fast-vj/
---

A realtime VJ sampler built for live performance, targeting Raspberry Pi 4 running fullscreen 1080p with GPU shader effects at 60fps. Inspired by Veejay but built from scratch around the Pi 4's unified memory architecture — frame uploads are a memcpy within the same memory pool, not a bus transfer.

Clips (video, images, audio) are triggered over OSC UDP with sub-frame latency. GLSL fragment shaders run at full GPU speed alongside a waveform and FFT spectrum fed from live audio, letting shaders react to bass, presence, or any frequency band in real time. Everything is scriptable via LuaJIT — `on_frame(dt)` and `on_osc(addr, val)` callbacks give you clip control, shader uniforms, FFT data, and per-pixel image access from a live Lua patch.

Video uses MJPEG AVI (mmap'd, no bus transfer) or JPEG frame directories decoded with libjpeg-turbo NEON SIMD — about 5ms per 1080p frame, well within a 16ms frame budget.

Included shaders: default oscilloscope/FFT overlay, spectrum visualizer, glowing waveform, sine plasma, and kaleidoscope with audio-reactive zoom. Custom shaders drop in as plain GLSL files with no compilation step.

There is an experimental WebAssembly port that runs in the browser via Emscripten, with OSC bridged over WebSocket. It works but has an unresolved slowdown over time — it lives on the `wasm-port` branch and isn't merged into main.

- [GitHub](https://github.com/dnewcome/fast-vj)
- [Devlog](/devlog/fast-vj/)
