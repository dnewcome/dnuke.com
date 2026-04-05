---
layout: devlog-post.njk
title: "Local dev setup"
date: 2026-04-03
project: curiate
project_name: Curiate
tags:
  - devlog
  - curiate
---


**Date:** 2026-04-03

## What changed

Got a proper local dev loop running after some time away from the project.

The stack: PostgreSQL 17 running locally on port 5433, Go backend, Flutter web in Chrome. The backend `.env` was already wired correctly. Flutter needed `ApiConfig.baseUrl` updated to point at `localhost:8080` in dev builds — it was using relative URLs which only work when Flutter is served from the same origin as the API.

Added [Air](https://github.com/air-verse/air) for Go hot reload. Without it, any backend change requires manually killing and restarting `go run`. Air watches `.go` files and rebuilds automatically. Config lives at `curiate-backend/.air.toml`.

To start local dev:

```bash
# Terminal 1
cd curiate-backend && ~/go/bin/air

# Terminal 2
cd curiate_flutter && flutter run -d chrome
```
