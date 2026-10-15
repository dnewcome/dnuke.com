---
layout: project-page.njk
title: "Wirebender"
slug: wirebender
description: "A CNC wire-bending machine that turns G-code into arbitrary 3D shapes in 14–16ga steel — with a full simulator, path planner, and a 'Machine as Code' paper."
tags: [hardware, robotics, cnc, g-code, grbl, simulation, paper]
github: "https://github.com/punkfab/wirebender"
has_devlog: false
featured: true
order: 1
permalink: /projects/wirebender/
---

A CNC wire-bending machine capable of bending 14 or 16 gauge steel wire into arbitrary 3D shapes from G-code. Wire is fed from a spool through a rotating feed tube — the tube's rotation sets the bend plane, and a bending head at its end performs the actual bend. Motion runs on a GRBL 1.1 board.

The repo is the whole machine as code: geometry, a kinematic simulator, a path planner that compiles target shapes into motion, the drive layer, and homing. It's written up in the **"Machine as Code"** paper that lives alongside the source.
