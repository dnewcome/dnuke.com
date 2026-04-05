---
layout: devlog-post.njk
title: "iOS image upload fix (HEIC→JPEG) and nginx upload 404s"
date: 2026-04-04
project: curiate
project_name: Curiate
tags:
  - devlog
  - curiate
---


**Date:** 2026-04-04

## iOS HEIC filename mismatch

Images uploaded from iOS Safari were failing silently. The photo library on iOS reports a `.HEIC` filename even when the browser has already transcoded the image to JPEG for the upload. The backend extension allowlist doesn't know about `.heic`, so it rejected the upload.

The fix is a `_normalizeFilename()` helper in `PostService` that inspects the XFile's `mimeType` property (set by the browser, not derived from the filename) and overwrites the extension if they disagree. `image/jpeg` with a `.HEIC` filename becomes `.jpg`. The MIME type is ground truth; the filename is not.

## nginx upload 404s

Uploaded images were 404ing on the production server even though the files existed on disk. The nginx config had two location blocks that were in conflict:

```nginx
location ~* \.(jpg|jpeg|png|gif|webp|...)$ { ... }   # regex: matches /uploads/foo.jpg
location /uploads/ { proxy_pass http://go_backend; }   # prefix: also matches
```

nginx's regex locations beat prefix locations by default — so image requests to `/uploads/` were being matched by the asset-caching regex rule, which did `try_files $uri =404` against the wrong root directory. The fix is `location ^~ /uploads/` — the `^~` prefix modifier means "if this matches, stop evaluating regex rules."

## Comment reply style

The reply nesting in comment threads was rendering the vertical connection line inside the row layout, which pushed content to the right. Moved the line to a `Stack` with a `Positioned` overlay so it sits at the left edge without affecting the horizontal layout of the reply content.
