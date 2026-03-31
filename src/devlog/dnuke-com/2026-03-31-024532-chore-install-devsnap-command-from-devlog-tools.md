---
layout: devlog-post.njk
title: "install devsnap command from devlog-tools"
date: 2026-03-31
project: dnuke-com
project_name: dnuke.com
tags:
  - devlog
  - dnuke-com
---

_2026-03-31_

![](/images/devlog/dnuke-com/2026-03-31-024532-chore-install-devsnap-command-from-devlog-tools.png)

## What happened

I wired up the devsnap tooling directly into this project — the script and Claude command now live in the repo so running a devlog snapshot is just `/devsnap`. The bigger story this session was the session dashboard getting an estimated kWh energy display: using published 2025 per-token energy benchmarks (decode ~1.0 J/token, prefill ~11x cheaper, cache reads ~100x cheaper), the dashboard now estimates how much electricity each Claude session burns. It shows up in the stats bar and per-project detail view, labeled clearly as an estimate. Closing the loop on the devlog pipeline means these kinds of incremental additions actually get captured and published instead of disappearing into git history.

## Files touched

  - .claude/commands/devsnap.md
  - scripts/devsnap.sh

## Tweet draft

Added estimated kWh energy display to my Claude session dashboard — decode ~1.0 J/token, prefill 11x cheaper, cache reads 100x cheaper. Nice to see actual energy cost per project. Also wired up devsnap so these updates actually get published. [link]

---

_commit: b1f4759 · screenshot: captured (headless)_
