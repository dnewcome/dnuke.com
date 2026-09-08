---
title: "Flashing MeshCore on the Elecrow ThinkNode M5 from Linux"
date: 2026-09-08
tags:
  - posts
  - meshcore
  - meshtastic
  - lora
  - linux
---


_2026-09-08_

## What happened

I wanted to move my Elecrow ThinkNode M5 off Meshtastic and onto [MeshCore](https://meshcore.co.uk). Every guide I found said to "put the device in bootloader mode" first, and I couldn't. No double-tap-reset trick worked, no USB drive appeared, nothing. It turned out I was chasing a mode that doesn't exist on this board, and the actual blocker was something else entirely on my Linux box.

**The board is not what the guides assume.** The ThinkNode M1 is an nRF52840, which has a UF2 bootloader you enter by double-tapping reset. The M5 is an ESP32-S3 with a CH340 USB-serial chip. There is no UF2 mode, no DFU, and no exposed BOOT button (the two user buttons are on GPIO21 and GPIO14, not GPIO0). Download mode is entered by the flasher toggling the DTR and RTS lines through the CH340. If the flasher can't connect, the problem is the serial port, full stop.

**Three gotchas that ate the time:**

1. **brltty was eating the serial port.** Ubuntu ships `brltty`, the braille display daemon, and its udev rule matches the CH340's vendor ID (`1a86`). The moment you plug the radio in, the kernel binds the port and then unbinds it, and `/dev/ttyUSB0` never appears. Nothing in the logs says why. `sudo apt remove brltty` and the port showed up on the next plug-in. This is the real reason "bootloader mode" wasn't working.

2. **The apt-packaged esptool is broken for the S3.** It connects, reads the chip ID, then crashes looking for `stub_flasher_32s3.json`, which the Debian package doesn't ship. `pipx install esptool` gets 5.4.0 with everything in it.

3. **The radio played dead while plugged into the PC afterward.** After flashing, the M5 booted but wouldn't hear anyone. Unplugging USB fixed it instantly. Anything that opens the port and leaves the handshake lines in the wrong state holds the ESP32 in reset via the same auto-reset circuit that makes flashing work. ModemManager probing new serial ports does this; so did the little script I used to read the boot log. A udev rule with `ENV{ID_MM_DEVICE_IGNORE}="1"` for `1a86:7522` stops the ModemManager half of it.

**What finally worked:** the MeshCore web flasher at [flasher.meshcore.io](https://flasher.meshcore.io) is really just esptool in the browser, and its firmware comes straight from the [GitHub releases](https://github.com/meshcore-dev/MeshCore/releases). The `-merged.bin` images contain bootloader, partition table, and app, and go at offset 0. So from the command line:

```
pipx install esptool
esptool --chip esp32s3 --port /dev/ttyUSB0 --baud 460800 erase-flash
esptool --chip esp32s3 --port /dev/ttyUSB0 --baud 460800 write-flash 0x0 \
  ThinkNode_M5_companion_radio_ble-v1.17.1-d929643-merged.bin
```

Erase first when coming from Meshtastic, since the partition layouts differ and leftover data causes boot loops. For later MeshCore updates, flash the non-merged app image without erasing so the node keeps its identity and contacts. The whole write took 18 seconds at 460800 baud and verified clean.

**One thing about MeshCore itself:** a fresh node shows an empty contact list even in a busy area, and that's by design. Meshtastic nodes beacon constantly; MeshCore companions are silent until someone sends an advert, and repeaters only self-advertise every few hours. Send a flood advert from the app and wait. Also, the firmware currently reports the M5 as a "ThinkNode M2" in the app, which is a [known naming bug](https://github.com/meshcore-dev/MeshCore/issues/1319), not a wrong flash.

## Tweet draft

Couldn't get an Elecrow ThinkNode M5 into "bootloader mode" to flash MeshCore. Turns out it's an ESP32-S3, not nRF52, so there is no bootloader mode. The real culprit was brltty on Ubuntu grabbing the CH340 serial port. Removed it, pipx esptool, erase + write the merged bin at 0x0, done. Then it played dead until I unplugged USB (ModemManager holding the reset line). Notes: [link]
