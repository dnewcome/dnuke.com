---
layout: devlog-post.njk
title: "Session expiry UX and username flash"
date: 2026-04-03
project: curiate
project_name: Curiate
tags:
  - devlog
  - curiate
---


**Date:** 2026-04-03

## The problem: daily forced re-login

Users were being kicked to the login screen every day. The JWT tokens were set to expire after 24 hours. When the token expired the app would redirect to login with no explanation — no pre-filled email, no "your session expired" message, just a blank login form.

Extended the JWT expiry to 30 days in `internal/utils/jwt.go`. Daily forced re-login was friction with no real security benefit for this app.

## Preserving account data on token expiry

The old `deleteToken()` removed the entire account entry from storage. That meant losing the stored username and email, so the login screen couldn't pre-fill anything on re-authentication.

Changed `deleteToken()` to clear only the token field while keeping the `AccountSession` entry intact. On session expiry, the login screen now reads the stored account, pre-fills the email, and shows a "Your session has expired. Please sign in again." banner. Much less alarming than arriving at a blank form.

## Username flash on page reload

After fixing the login loop, a new issue appeared: the username in the nav bar would briefly disappear on every hard reload before reappearing a moment later. The sequence was:

1. Page loads, `checkAuthStatus()` is called
2. `_currentUser` is null while `getMe()` is in flight → UI renders as if logged out
3. `getMe()` returns → username appears

Fixed by pre-populating `_currentUser` from the stored `AccountSession` before the API call. The username appears immediately from local storage, then gets replaced by the full `User` object once `getMe()` returns. The flash is gone — the user always sees their username.

## GoRouter URL restoration

GoRouter restores the last URL on hard reload, which bypasses the splash screen where `checkAuthStatus()` runs. Pages like HomeScreen were rendering without knowing if the user was authenticated.

Fixed by adding an `initState` check in `HomeScreen` — if `currentUser` is null after GoRouter has restored the URL, it runs `checkAuthStatus()` and redirects to login if it fails. This runs after the first frame so it doesn't block the initial render.
