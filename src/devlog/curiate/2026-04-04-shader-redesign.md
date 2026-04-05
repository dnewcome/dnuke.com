---
layout: devlog-post.njk
title: "Shader-powered login screen and soft laser cyber optimism redesign"
date: 2026-04-04
project: curiate
project_name: Curiate
tags:
  - devlog
  - curiate
---


**Date:** 2026-04-04

## The redesign

Replaced the original design with what I've been calling "soft laser cyber optimism" — dark backgrounds, violet-to-pink gradients, glow effects, the Outfit typeface. The goal was something that feels like it belongs in the same aesthetic neighborhood as Bluesky or Linear but with a bit more edge. Post cards got gradient accent bars unique to each post, a gradient ring around the avatar, and flat dividers replacing Material elevation.

## GPU fragment shader on the auth screens

The login and signup screens now have animated orb background using a GLSL fragment shader compiled directly into the Flutter app. Flutter's `FragmentShader` API lets you write a `.frag` file, declare it in `pubspec.yaml` under `shaders:`, and render it with a `CustomPainter`. No external package needed — the shader is a first-class Flutter asset.

The orbs are smooth Gaussian blobs drifting in slow Lissajous paths, rendered entirely on the GPU. Getting the math right for the layered blobs took a few iterations — the first version was too aggressive (high amplitude, fast timing) and felt anxious rather than atmospheric. Settled on 0.35× speed and amplitude tuned so the motion is barely perceptible until you stare at it.

## Dealing with font FOUC

Flutter web has a Flash of Unstyled Content problem: the app renders a frame or two before custom fonts load, causing a visible swap from the fallback font to Outfit. The fix is `FontLoader` — preload all font weights explicitly before calling `runApp`. This adds a small startup delay but eliminates the flash entirely. Also had to restore the HTML renderer's font smoothing after some CSS interference was making text look pixelated.
