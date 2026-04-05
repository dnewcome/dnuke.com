---
layout: devlog-post.njk
title: "Invite passphrase for account creation"
date: 2026-04-04
project: curiate
project_name: Curiate
tags:
  - devlog
  - curiate
---


**Date:** 2026-04-04

Added a lightweight gate to account creation while the app is in early access, before email verification exists.

Set `INVITE_PASSPHRASE=<phrase>` in the backend environment. When set:

- `POST /auth/signup` checks that `invite_code` in the request body matches the passphrase, returning 403 if it doesn't
- `GET /v1/config` returns `{"invite_required": true}` so the client knows to show the field
- The Flutter signup screen fetches `/v1/config` on mount and conditionally renders an "Invite Code" field

When the env var is absent, no check is performed and the field is hidden — zero friction for local development.

A few implementation details worth noting:

**Constant-time comparison** — the passphrase check uses `crypto/subtle.ConstantTimeCompare` instead of `!=`. A regular string comparison short-circuits on the first differing byte, which in theory leaks timing information about how many leading characters the attacker got right. Constant-time comparison always scans the full string. No added latency; it's just the correct primitive for secret comparisons.

**Config endpoint** — rather than embedding the invite flag in some other response, a dedicated `GET /v1/config` endpoint was added. It's public, unauthenticated, and currently returns only `invite_required`. It's a natural place to add other client-facing feature flags later without breaking anything.
