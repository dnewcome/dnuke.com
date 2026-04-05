---
layout: devlog-post.njk
title: "Mobile navigation fixes, nginx cache headers, and a Makefile for prod ops"
date: 2026-04-04
project: curiate
project_name: Curiate
tags:
  - devlog
  - curiate
---


**Date:** 2026-04-04

## Double navigation on mobile swipe

On iOS Safari, the browser's back-swipe gesture was firing at the same time as go_router's own back navigation. The result: tapping back on a post detail screen popped the route AND navigated the browser back — landing two screens back instead of one. The fix was wrapping the gesture-sensitive parts of the screen in an `AbsorbPointer`-style detector that consumes horizontal swipe events before they reach the browser's navigation handler. Subtle platform-specific behavior that doesn't show up in testing until you're actually on the device.

## nginx cache headers for Flutter web

Flutter's web build generates filenames with content hashes (`main.dart.js?v=abc123`, `canvaskit.wasm`). Configuring nginx to send `Cache-Control: immutable, max-age=31536000` for these assets and `no-cache` for `index.html` means users get instant loads on repeat visits while always getting the latest `index.html` on deploy. Without this, browsers were re-downloading the multi-megabyte CanvasKit WASM on every visit.

## Makefile for production operations

Added a `Makefile` at the repo root to capture the commands needed for production operations that aren't part of the CI/CD pipeline — things like running a specific migration manually, SSHing into the server, or rebuilding the Flutter app for deployment. These were previously living in my shell history or scattered across README notes. A Makefile is the right container for this: it's version-controlled, self-documenting, and doesn't require any tooling beyond `make`.

## Test fixes

The integration tests were hardcoding a list of migration files instead of globbing the migrations directory. Adding a new migration broke them. Changed to `filepath.Glob("../../migrations/*.sql")` — tests now automatically pick up new migrations.
