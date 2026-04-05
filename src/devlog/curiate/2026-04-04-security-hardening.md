---
layout: devlog-post.njk
title: "Security hardening: rate limiting, input validation, CORS"
date: 2026-04-04
project: curiate
project_name: Curiate
tags:
  - devlog
  - curiate
---


**Date:** 2026-04-04

Did a code-level security review of the backend and fixed the most impactful issues.

## Rate limiting on auth endpoints

`POST /auth/login` and `POST /auth/signup` had no rate limiting — an attacker could brute-force passwords or credential-stuff at full network speed. Added per-IP token bucket rate limiting using `golang.org/x/time/rate`:

- Login: 5 requests per minute, burst of 5
- Signup: 10 requests per minute, burst of 10

The limiter is in-process (no Redis dependency) with a background goroutine that evicts entries idle for more than 10 minutes. The real client IP is extracted from `X-Forwarded-For` first (set by nginx), falling back to `RemoteAddr`.

Exceeds the limit → 429 with `{"error":{"code":"RATE_LIMITED","message":"Too many requests..."}}`.

## Post content length cap

Comments were already capped at 500 characters but post text had no limit — you could fill the database with arbitrarily large payloads. Added a 10,000 character cap on post content.

## UUID validation before DB queries

`GET /posts/{publicId}` previously passed whatever string was in the URL directly to a Postgres UUID column. An invalid UUID (like `999999`) caused Postgres to return a type error, which the handler surfaced as a 500. Added an explicit `uuid.Parse()` check before querying — invalid IDs now return 404 immediately.

## CORS header cleanup

The CORS middleware was sending both `Access-Control-Allow-Origin: *` and `Access-Control-Allow-Credentials: true`. The CORS spec forbids this combination and browsers reject it. Since the API uses `Authorization: Bearer` headers (not cookies), CSRF isn't a real concern here — but the contradictory header is misleading. Removed `Allow-Credentials: true`.
