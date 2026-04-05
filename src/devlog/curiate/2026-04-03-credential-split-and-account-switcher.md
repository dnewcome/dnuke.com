---
layout: devlog-post.njk
title: "Credential split and multi-account switcher"
date: 2026-04-03
project: curiate
project_name: Curiate
tags:
  - devlog
  - curiate
---


**Date:** 2026-04-03

## What changed

The original schema had one `users` row per person, with email and password hash sitting directly on the user. This made it impossible to have multiple accounts (usernames) under one login — you'd need a separate email for each, which is awkward for dev/testing and wrong architecturally anyway.

Split the schema into two tables:

- `credentials` — owns `email` and `password_hash`. One row per login identity.
- `users` — owns `username`, `bio`, `profile_image_url`, and a `credential_id` FK. One row per account.

This means one email+password can have multiple usernames attached. Signup with an existing email and matching password now creates a sibling account instead of rejecting the request.

On login, the backend looks up the credential, verifies the password, then issues JWT tokens for **all** accounts under that credential in a single response. The client stores all tokens locally — switching accounts is purely client-side with no re-authentication.

JWT claims now include `credential_id` alongside `user_id` and `username`. An authenticated `POST /me/accounts` endpoint lets you add a new username to your current credential without re-entering your email/password.

## UI changes

Added an account switcher dropdown to the app bar. It shows:

- The current credential's email as a header
- All accounts with a checkmark on the active one
- Add account (just asks for a username)
- View profile
- Sign out (clears all sessions, goes to login)

The current username is shown inline next to the profile icon so it's always clear which account you're on.

## Feed/discover logic

Fixed the feed query to include your own posts (previously only showed followed users' posts). Discover now explicitly excludes your own posts. Both tabs refresh when switching accounts.

## Migration tooling

Added `scripts/migrate.sh` — a small bash script that tracks applied migrations in a `schema_migrations` table and runs pending `.sql` files in sorted order. The deploy workflow rsyncs migration files to the server and runs the script via SSH before restarting the service. No migration logic lives in the app binary.

Migration `002_credential_split.sql` handles the data migration: creates `credentials`, backfills it from the existing `users` rows, links them via `credential_id`, then drops `email` and `password_hash` from `users`.
