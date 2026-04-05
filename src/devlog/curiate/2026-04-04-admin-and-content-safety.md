---
layout: devlog-post.njk
title: "Admin system, reserved usernames, per-user rate limiting, and post bug fixes"
date: 2026-04-04
project: curiate
project_name: Curiate
tags:
  - devlog
  - curiate
---


**Date:** 2026-04-04

## Admin user system

Added an `is_admin` boolean to the `users` table. Only admin users can create sub-accounts (the multi-account feature). This gates what was previously open to any authenticated user.

The check is a single `IsAdmin(userID)` call in the `AddAccount` handler — non-admins get a `403 FORBIDDEN`. On the Flutter side the "Add account" menu item is conditionally rendered based on `currentUser?.isAdmin`. Set the first account as admin via a direct SQL update.

## Reserved username blocklist

Someone had registered the username `admin`. Added a hardcoded blocklist of reserved names — system names (`admin`, `support`, `api`, `root`), platform names (`curiate`, `staff`), and single/two-character names that would be confusing or abusable. The check runs at both signup and profile edit. Standard practice: Twitter, GitHub, and every other platform with an @ namespace does this.

## Per-user rate limiting for content actions

Extended the existing IP-based rate limiter (used on auth endpoints) to also key by authenticated user ID. Applied to:

- `POST /posts` — 20/hr, burst 5
- `POST /posts/:id/comments` — 60/hr, burst 10
- `POST /follows/:username` — 60/hr, burst 15

The limiter is generalized to work on any string key, so adding new limits is a one-liner. Still in-process (no Redis), but that's fine for a single server.

## Post bug fixes

Three related post lifecycle issues got fixed in the same batch:

**Unknown username after posting** — `CreatePost` was returning a bare `Post` model without the user join, so the feed showed "Unknown" for the author of a newly created post. Fixed by fetching the full `PostWithUser` record after creation and returning that in the response.

**Deleted post stays in feed** — `FeedProvider.removePost()` existed but wasn't being called when a post was deleted from the detail screen. Added the call.

**Files not deleted on post delete** — The delete handler was removing the database row but leaving the uploaded files on disk. Added `os.RemoveAll()` on the post's upload directory.

**Navigate to feed after posting** — After creating a post, the app was calling `context.pop()` which could land anywhere depending on navigation history. Changed to `context.go('/')` so the user always lands on the feed where they can immediately see their new post.
