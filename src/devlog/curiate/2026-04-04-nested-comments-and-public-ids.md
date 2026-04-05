---
layout: devlog-post.njk
title: "Nested comments and public post IDs"
date: 2026-04-04
project: curiate
project_name: Curiate
tags:
  - devlog
  - curiate
---


**Date:** 2026-04-04

## Nested comments

Added one level of replies to comments. The backend enforces a depth limit of 1 — you can reply to a top-level comment, but not to a reply. Attempting to do so returns a 400.

The schema change is simple:

```sql
ALTER TABLE comments ADD COLUMN parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE;
```

The repository fetches top-level comments first, then batch-fetches all replies in a single query using `WHERE parent_id IN ($1, $2, ...)` with dynamically built placeholders. This avoids N+1 — one query for roots, one for all their children.

On the Flutter side, `CommentItem` renders replies with 56px left indentation and a 2px vertical rule. The Reply button only appears on top-level comments. When tapping Reply, a "Replying to @username" banner appears above the comment input field and the text field gets autofocus.

## Public UUIDs for posts

The integer primary key for posts was leaking into public URLs (`/posts/42`) and file storage paths (`/uploads/posts/42/`). Added a `public_id UUID` column with a database default:

```sql
ALTER TABLE posts ADD COLUMN public_id UUID NOT NULL DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX idx_posts_public_id ON posts(public_id);
```

The integer PK stays for internal joins and sub-resources (likes, comments). The UUID is used everywhere else: `GET/DELETE /posts/{publicId}`, media file paths, and all Flutter navigation. The `GetByPublicID` repository method shares a `getPost()` helper with `GetByID` to avoid duplicating the join query.

A PLAN.md TODO tracks the remaining work: existing media files are still stored under the old integer paths, and UUIDs could be base62-encoded (~22 chars vs 36) for shorter URLs.
