---
title: "Reading the Drumboy Pro source before building my own groovebox"
date: 2026-09-16
tags:
  - posts
  - synth
  - embedded
  - stm32
  - kicad
  - audio
---


_2026-09-16_

## What happened

I'm about to start designing a hardware groovebox, and before drawing a single schematic I wanted to read through something in the same shape that actually shipped. Randomwaves released their [Drumboy Pro](https://github.com/Randomwaves/Drumboy-Pro) as open hardware under MIT: full KiCad, full firmware, the enclosure, and a reference SD card. It's a 10-layer sampler with a sequencer and an effects chain on an STM32H723. That's close enough to what I want that a day spent reading it is a day I don't spend rediscovering their mistakes.

**The hardware is one board and a panel.** The "Main" KiCad project holds all 346 footprints on a 4-layer board. The "Top" project is a PCB with no components on it at all. It's a fabricated front panel, with key legends drawn on a copper layer and the panel font vendored right next to the project. I'd never thought of ordering the panel from the same fab as the board, and it removes a whole category of laser-cutting and silkscreen headaches.

The parts list is refreshingly conventional:

- STM32H723ZGT6 in LQFP-144 at 550 MHz, off an 8 MHz crystal.
- 16 MB of SDRAM on the FMC bus. Every sample lives here as float32 at runtime.
- SGTL5000 codec for line in, line out and headphones over I2S and I2C.
- Six MCP23017 I2C expanders fanning out 42 Kailh Choc keys, 42 LEDs and 8 encoders.
- A 540×960 NT35510 panel on a 51-pin flex, driven as a 16-bit parallel bus off plain GPIO.
- MIDI in through an H11L1 opto, 3.5 mm jacks for MIDI and sync, USB-C for power only.
- An MP3302 boost plus three AP2112 LDOs, with ferrite beads splitting the analog rails.

The BOM has LCSC part numbers throughout and every third-party symbol, footprint and STEP model is checked in under a `Library/` folder. It's JLCPCB-ready out of the box, which is exactly how I lay out boards too.

**The firmware is two projects and one enormous class.** A bootloader owns flash sector 0, checks the SD card for a versioned firmware package, verifies a CRC-32 and programs the application into sectors 1 through 7. A little host-side C++ tool wraps the raw app binary with a header and the CRC. The app relocates its vector table at startup. A bad app build can never brick the update path, and that's the first thing I'm stealing.

The application itself is almost entirely one `Controller` class. The implementation file is about 25,000 lines. The shared header with all the constant tables is another 7,300. There's no RTOS. `main()` is a `while(true)` calling `controller.update()`, and everything else runs from interrupts. Thirteen hardware timers each own a single job: MIDI clock out, key debounce, long press, play tick, beat sync, LED metering, SD polling, text scrolling. The todo file in the repo notes that keypad and encoder handling got moved from interrupt context into the main loop partway through, which is a lesson you can read off the commit history for free.

**The audio engine is the part worth studying.** I2S runs full duplex over DMA with a double buffer of 32-sample stereo blocks, so about 0.7 ms at 44.1 kHz. The half-complete and complete callbacks each hand one half to a single `processAudioBlock` function. From there the chain is fixed and linear:

```
line-in receive → metronome → 10 sample layers → parametric EQ
  → 2 multimode filters → 2 send effects → stereo reverb → codec out
```

Every stage writes into its own float scratch buffer that lives in the class. There's no graph, no routing matrix, no allocation. It reads like a signal flow diagram, and I suspect that's why it works.

Samples stream straight out of SDRAM. When pitch is 1.0 and playback is forward there's a memcpy fast path; otherwise it falls into an interpolating loop. The line-in stage has a DC blocker, a one-pole low-pass and a hysteresis noise gate with hold. The codec's 24-bit samples are scaled by hand. There is no CMSIS-DSP anywhere, just biquads and delay lines written against the M7's FPU.

The SDRAM map is allocated by hand in a header: about 14.4 MB for samples, then delay lines, chorus buffers and cached palettized UI bitmaps, all as fixed addresses. Crude, and completely legible.

**The reference SD card is a real dataset.** 2,500 WAV samples across 19 instrument folders, plus custom binary formats for instrument libraries, drumkits, songs, presets and UI images. The image and WAV converter tools sit in the app's `Data/` folder. Having the whole content pipeline in the repo, not just the code, is what makes this readable as a complete product rather than a demo.

**What I'm taking, and what I'm not.**

Taking: the boot/app split with SD update. The H7 plus SDRAM plus SGTL5000 combination. MCP23017 for the control surface. The fixed-block DSP chain with a buffer per stage. The panel-as-PCB trick. The vendored KiCad library layout.

Not taking: the 25k-line class. Anything I borrow from the DSP or sequencer will need extracting, because it's tightly coupled to the LCD drawing code and the global tables. I'm also wary of the bit-banged 16-bit parallel display. It clearly works, but it costs a lot of GPIO and CPU cycles that LTDC or a smaller SPI panel wouldn't.

If you want to read it yourself: start with the README, then the app's `main.cpp` for the clock tree and callback wiring, then the eight `processAudio*` functions in `Controller.cpp`. Their [wiki](https://www.randomwaves.io/drumboy-pro/drumboy-pro-wiki.html) has the annotated schematic walkthrough, which I haven't gone through yet.

## Tweet draft

Before starting my own groovebox I read the whole Drumboy Pro open-source release: STM32H723, 16 MB SDRAM, SGTL5000, 42 keys on MCP23017s, a front panel that's just a component-less PCB. Bootloader/app split with SD update, fixed-block DSP chain, one 25,000-line class. Notes on what I'm stealing and what I'm not: [link]
