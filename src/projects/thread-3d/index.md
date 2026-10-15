---
layout: project-page.njk
title: "Thread"
slug: thread-3d
description: "Real-time 3D visualizer for a spiral LED art installation, driven over Art-Net — the whole piece authored as data. Live at dnuke.art/thread."
tags: [art, installation, led, art-net, webgl, 3d]
github: "https://github.com/dnewcome/thread-3d"
demo_url: "https://dnuke.art/thread/"
has_devlog: false
featured: true
order: 2
permalink: /projects/thread-3d/
---

A real-time 3D visualizer for a physical spiral LED installation. Tube centrelines, LED fixtures, pedestals, and the running light patterns are all described as data — the live piece and the on-screen preview are driven by the same Art-Net stream over UDP.

The visualizer at [dnuke.art/thread](https://dnuke.art/thread/) now runs on [voxeled](https://github.com/pixeldestrukt/voxeled): a single `thread.yaml` describes the entire piece, so the installation is editable the way a program is.
