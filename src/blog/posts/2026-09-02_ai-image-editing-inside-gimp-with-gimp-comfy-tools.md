---
title: "AI image editing inside GIMP with gimp-comfy-tools"
date: 2026-09-02
tags:
  - posts
  - ai
  - gimp
---


_2026-09-02_

## What happened

I wanted to do AI image generation and inpainting without leaving GIMP, so I wired up [gimp-comfy-tools](https://github.com/nchenevey1/gimp-comfy-tools) — a GIMP 3.0 plugin suite that talks to a local ComfyUI server over its REST + WebSocket API. It opens a "ComfyUI Studio" panel inside GIMP where you type a prompt, pick a checkpoint, and the result comes back as a new layer with all the generation parameters stored on the layer as metadata.

The setup turned out to be more involved than dropping a folder into a plugin directory, so here's the whole path in case it helps someone else.

**The stack:** GIMP 3.2.4 (AppImage), a local ComfyUI checkout with a fresh Python venv, PyTorch CUDA build for my RTX 4070 Super, and the plugin suite copied into GIMP's user plug-ins directory.

**Three gotchas that ate the most time:**

1. **The right plug-ins directory.** GIMP 3.2 keeps its config in `~/.config/GIMP/3.2/` (not `3.0`), and the plugin folder must sit there as three siblings — `modules/`, `gimp-generate-pers/`, and `gimp-metadata-viewer/`. Drop it in the wrong profile dir and nothing shows up, no error.

2. **The Python shebang.** The plugin's `#!/usr/bin/env python3` resolved to my pyenv Python, which had no `gi` bindings. Installing `gir1.2-gimp-3.0` system-wide and pointing the shebang at `/usr/bin/python3` fixed the "no panel at all" symptom.

3. **The beige-gradient bug.** The first several generations came back as a flat beige gradient. The culprit: the plugin's persisted settings had saved `cfg: 0.0` and `denoise: 0.0` (out-of-range zeros that slipped past the UI spinners). With zero CFG guidance the model just produces a flat field. Clamping cfg/denoise/seed to sane values at read time fixed it, and suddenly real images came out.

**What finally worked:** a RealisticVision v5 (SD 1.5) checkpoint dropped into `models/checkpoints/`, two example workflows registered, and the settings clamped so degenerate zeros can't propagate. A test generation did 25 steps at ~4.9 it/s on the 4070 Super — a full image in under 9 seconds including model load.

## Files touched

  - ComfyUI checkout: `~/sandbox/thirdparty/ComfyUI` (venv + PyTorch CUDA + checkpoint)
  - GIMP plug-ins: `~/.config/GIMP/3.2/plug-ins/{modules,gimp-generate-pers,gimp-metadata-viewer}`
  - GIMP comfy data: `~/.config/GIMP/3.2/comfy/Workflows/` (workflow registry + example workflows)
  - GIMP comfy data: `~/.config/GIMP/3.2/comfy/data/last_inputs_persistent.json` (persisted settings)

## Tweet draft

Piped Stable Diffusion into GIMP with gimp-comfy-tools + a local ComfyUI. Text-to-image and inpainting right inside the editor, results come back as layers tagged with their generation params. The fun parts: the plug-ins dir that wasn't where I thought, the missing GI bindings, and chasing a flat beige gradient back to a `cfg: 0.0` that leaked into persisted settings. Now it does 25 steps in ~5s on a 4070 Super [link]

---

_commit: 7041849 · screenshot: no screenshot_
