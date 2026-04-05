---
layout: devlog-post.njk
title: "CI pipeline and test coverage"
date: 2026-04-04
project: curiate
project_name: Curiate
tags:
  - devlog
  - curiate
---


**Date:** 2026-04-04

## What changed

Added a GitHub Actions workflow that runs tests before deploying. The deploy job only starts if both test jobs pass — a bad push can't reach production.

Two parallel test jobs:

- **flutter-test** — runs `flutter test` on every push
- **go-test** — spins up a Postgres 17 service container and runs `go test ./...` against a real database

The Go integration tests were broken in two ways after the credential split: they only applied migration 001 (so the `credentials` table didn't exist), and `cleanDB` deleted rows without dropping tables, so indexes conflicted on subsequent runs. Fixed by dropping tables between runs and applying both migrations in order. The `signup` helper also needed updating — the response shape changed from `{token}` to `{accounts: [{token}]}` after the credential split.

Added unit tests for `PostProvider` and `AuthProvider`:

- `PostProvider.clear()` — verifies stale comments from a previous post are gone before loading a new one
- `AuthProvider.checkAuthStatus()` — verifies tokens are not deleted on transient errors (network failure, server restart), only on 401

The `AuthProvider` tests required adding optional constructor injection so services can be faked without mockito. The fakes subclass the real services and override only the methods under test.
