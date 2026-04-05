---
layout: devlog-post.njk
title: "In-app audio recording, Gravatar on signup, and avatar cache invalidation"
date: 2026-04-04
project: curiate
project_name: Curiate
tags:
  - devlog
  - curiate
---


**Date:** 2026-04-04

## In-app audio recording

The audio picker originally only offered file selection. Added a "Record" button alongside it that uses the `record` package to capture audio from the microphone.

The UX is simple: tap Record, see a red dot + timer ticking up, tap Stop. The recording saves as `recording.m4a`. On iOS Safari the `record` package uses the browser's `MediaRecorder` API (Safari supports `audio/mp4` AAC output). On native iOS it uses AVFoundation — more reliable and with better codec support.

The M4A format required a new validation path on the backend. Like MOV files, Go's `http.DetectContentType` returns `application/octet-stream` for M4A (it's an ISO Base Media File Format container starting with an `ftyp` box). Extended the existing box-header validation to cover `.m4a` as well.

The web audio file picker had a separate bug: `file_picker` with `withData: false` returns null paths on web — there's no filesystem access in the browser. The XFile was constructed with just the filename as its "path", so `readAsBytes()` had nothing to read. Fixed by switching to `withData: true` and `XFile.fromData(pf.bytes!)` for web, falling back to path-based XFile on native.

## Gravatar on signup

When a new user signs up, the server now checks Gravatar for a matching avatar. The check is `md5(lowercase(trim(email)))` → `https://www.gravatar.com/avatar/{hash}?d=404&s=400`. If a Gravatar exists (200 response), the image is downloaded and saved to the user's profile image path. If not (404), nothing happens.

The fetch runs in a goroutine and doesn't block the signup response. The image is stored on our own server — Gravatar is only contacted once at signup, not on every page load, so user emails aren't leaked to a third party on every avatar render.

Gravatar has a huge install base from WordPress, GitHub, and Stack Overflow. A surprising number of new users will get an avatar automatically.

## Avatar cache invalidation

Uploading a new profile picture wasn't taking effect until app restart. `CachedNetworkImage` caches by URL — and the avatar URL doesn't change between uploads (`/uploads/profiles/{username}/avatar.jpg`). The old image persisted in the cache even after the state was updated.

Fix: call `CachedNetworkImage.evictFromCache(oldUrl)` after a successful avatar upload, before updating the provider state. The next render fetches fresh from the server.
