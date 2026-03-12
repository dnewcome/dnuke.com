---
title: "Thinkpad T61 Ultrabay Eject under Ubuntu Gutsy"
date: 2008-07-06T20:04:37+00:00
---

# Thinkpad T61 Ultrabay Eject under Ubuntu Gutsy

I was toying with the idea of adding a second hard disk to my Thinkpad recently, but I remember reading some time ago that ejecting the Ultrabay device was not supported under Linux. However, I was just reading [here](http://www.thinkwiki.org/wiki/How_to_hotswap_UltraBay_devices) that eject should work with my configuration (2.6.22 kernel, ata_piix kernel module). I poked around for the bay under /proc as suggested by the instructions, but didn’t turn up anything. Looking around some more, it turns out that we need to look under /sys instead:

# echo 1 > /sys/devices/platform/bay.0/eject

This caused the light to go out on the bay, and I pulled the DVD drive with no apparent ill effect.

When I put the drive back into the bay it was automatically recognized and the light came back on.

Here is the dmesg log for the removal/insertion. There are some errors here, I wonder if they could be avoided by deleting the scsi device before ejecting as advised by the above link.

[ 8205.532000] ACPI: \_SB_.PCI0.IDE0.PRIM.MSTR: Ejecting device

[ 8206.740000] ata1.00: exception Emask 0x0 SAct 0x0 SErr 0x0 action 0x2 frozen

[ 8206.740000] ata1.00: cmd a0/00:00:00:00:20/00:00:00:00:00/a0 tag 0 cdb 0x0 data 0

[ 8206.740000] res 00/00:00:00:00:00/00:00:00:00:00/00 Emask 0x2 (HSM violation)

[ 8206.740000] ata1: soft resetting port

[ 8207.052000] ata1.00: revalidation failed (errno=-2)

[ 8207.052000] ata1: failed to recover some devices, retrying in 5 secs

[ 8212.056000] ata1: soft resetting port

[ 8212.368000] ata1.00: revalidation failed (errno=-2)

[ 8212.368000] ata1: failed to recover some devices, retrying in 5 secs

[ 8217.372000] ata1: soft resetting port

[ 8217.684000] ata1.00: revalidation failed (errno=-2)

[ 8217.684000] ata1.00: disabled

[ 8218.188000] ata1: EH complete

[ 8389.216000] ata1: exception Emask 0x10 SAct 0x0 SErr 0x0 action 0x2 frozen

[ 8389.216000] ata1: (ACPI event)

[ 8389.216000] ata1: soft resetting port

[ 8389.536000] ata1.00: ATAPI: HL-DT-ST DVDRAM GSA-U10N, 1.05, max UDMA/33

[ 8389.724000] ata1.00: configured for UDMA/33

[ 8389.724000] ata1: EH complete

[ 8389.724000] ata1.00: detaching (SCSI 0:0:0:0)

[ 8404.508000] scsi 0:0:0:0: CD-ROM HL-DT-ST DVDRAM GSA-U10N 1.05 PQ: 0 ANSI: 5

[ 8404.512000] sr0: scsi3-mmc drive: 24x/24x writer dvd-ram cd/rw xa/form2 cdda tray

[ 8404.512000] sr 0:0:0:0: Attached scsi CD-ROM sr0

[ 8404.512000] sr 0:0:0:0: Attached scsi generic sg0 type 5
