---
layout: devlog-post.njk
title: "MOV video support, audio uploads, and a custom audio player"
date: 2026-04-04
project: curiate
project_name: Curiate
tags:
  - devlog
  - curiate
---


**Date:** 2026-04-04

## MOV video support for iOS

iOS records video as QuickTime MOV files. The backend extension allowlist only had `.mp4` for video — `.mov` wasn't accepted at all. Adding it was more involved than just appending to the list.

Go's `http.DetectContentType` uses the MIME sniffing spec, which doesn't recognize the QuickTime `ftyp` brand. It returns `application/octet-stream` for valid MOV files. The solution is a secondary validation step: if the detected MIME is `application/octet-stream` and the extension is `.mov`, read bytes 4–8 of the file and check the 4CC box type. Valid QuickTime/MP4 containers start with `ftyp`, `moov`, `free`, `wide`, or `mdat`. This is a tight enough check to accept real MOV files while rejecting arbitrary binary blobs masquerading as video.

## Video thumbnail generation

After upload, the server generates a JPEG thumbnail from the first frame using ffmpeg via `exec.Command`. The thumbnail is served as a static file alongside the video and included in the post response so the feed can show a preview image without loading the full video. The generation happens in a goroutine so it doesn't block the upload response.

## Audio file uploads

`image_picker` only handles images and video. For audio, switched to the `file_picker` package which opens the system file picker with `FileType.audio`. On iOS Safari this surfaces the Files app (and iCloud Drive) where downloaded or saved audio lives.

The backend accepts `.mp3`, `.wav`, and `.flac` with proper MIME validation.

## Audio player widget

Built a custom audio player using the `audioplayers` package: gradient play/pause button, scrubber slider with mm:ss timestamps for current position and duration. Styled to match the app theme with violet/pink gradients and a subtle glassmorphism container. The player listens to `onPlayerStateChanged`, `onPositionChanged`, and `onDurationChanged` streams from `AudioPlayer` and rebuilds only the relevant parts of the widget tree on each tick.
