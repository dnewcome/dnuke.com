---
layout: devlog-post.njk
title: "UI refresh: flat design, pastel gradients, image preview"
date: 2026-04-04
project: curiate
project_name: Curiate
tags:
  - devlog
  - curiate
---


**Date:** 2026-04-04

## Flat post cards with pastel gradients

Replaced the Material card style (elevation, shadow, rounded border) with a flat design. Posts and comments are now separated by a single thin `Divider` line.

Each post card gets a pastel gradient background, cycling through six palettes by post ID so adjacent posts always differ:

- Indigo → pink
- Green → sky
- Amber → violet
- Rose → sky
- Emerald → amber
- Violet → emerald

The gradients are very low saturation — barely-there washes of color rather than bold blocks. The card theme globally sets elevation to 0.

## Image preview before posting

Previously, selecting an image on the create post screen only showed the filename in a list tile. Now it renders a full-width preview using `Image.memory()` on the locally-read bytes — no upload, purely client-side. Two overlay buttons let you swap the image (pencil) or remove it (X). The upload still only happens when Post is tapped.

Video and audio selections continue to show a filename tile with the same edit/remove actions.
