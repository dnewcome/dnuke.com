---
layout: devlog-post.njk
title: "Video upload and playback"
date: 2026-04-03
project: curiate
project_name: Curiate
tags:
  - devlog
  - curiate
---


**Date:** 2026-04-03

## Upload failing on prod

Video uploads worked locally but failed silently on the production server. The Go backend was already configured to accept up to 100MB multipart forms and allowed `.mp4`/`.webm` MIME types — so the backend wasn't the problem.

The culprit: Nginx's default `client_max_body_size` is 1MB. Nginx was rejecting the upload before the request ever reached the Go handler. Added `client_max_body_size 100m;` to the `/v1/` proxy location in `docker/nginx.conf`, along with `proxy_read_timeout 300s` and `proxy_send_timeout 300s` for slow connections.

Also extended the Dio `sendTimeout` and `receiveTimeout` for `uploadFile()` to 5 minutes — the global 30-second timeout was too tight for large video files on slower connections.

## Playback not working at all

The video case in both `PostCard` and `PostDetailScreen` was a static `Container` with a play icon and no tap handler. Nothing happened when you clicked it.

Added the `video_player` package and created `VideoPlayerWidget` — a stateful widget that:
- Initializes `VideoPlayerController.networkUrl` from the post's media URL
- Shows a loading spinner while the video initializes
- Renders the video at its native aspect ratio (defaults to 16:9 while loading)
- Shows a play/pause overlay that fades out when playing
- Provides a scrubbable `VideoProgressIndicator` at the bottom

The player is used in `PostDetailScreen`. The post card in the feed still shows a static play icon — tapping it navigates to the detail screen where playback happens.

## Go server write timeout

The Go HTTP server had `WriteTimeout: 30s`. For a video file being streamed over a slow connection, 30 seconds isn't enough to complete the response. Extended to 5 minutes. The nginx `/uploads/` proxy location got the same treatment.

`http.FileServer` (used to serve `/uploads/`) handles `Range` requests natively, so seeking in the video player works without any additional backend changes.
