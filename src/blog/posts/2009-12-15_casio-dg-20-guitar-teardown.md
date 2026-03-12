---
title: "Casio DG-20 guitar teardown"
date: 2009-12-15T18:53:56-05:00
---

# Casio DG-20 guitar teardown

![\1](/images/2009-12-15_casio-dg-20-guitar-teardown_dg20.jpg)
I bought a [Casio DG-20](http://www.maketunes.com/articles/casio-dg20-digital-midi-guitar) digital Midi guitar a few years ago thinking that it would be a cheap way to input Midi data into my sequencer using guitar fingering.  I was partially right, but the feel of the instrument is not quite the same as a real guitar.  The pressure-sensitive fingerboard is certainly unique, as I don’t know of any other controller that detects input in quite the same way.

My particular instrument was purchased on eBay from a person whom I think really didn’t know much about the guitar or its history. When I got it I noticed that the neck was bowed and there were several dead spots on the fretboard.  All in all, it was in working order though, so given the rarity of these things I wasn’t too devastated.

I have made one previous attempt at tearing the guitar down in order to see if I can fix it. I didn’t have time to completely figure out how to get the neck off of the guitar in order to see what was wrong with it. Here I will document the second teardown attempt, which has been successful so far.

**Step 1 – Remove the back of the guitar**

![\1](/images/2009-12-15_casio-dg-20-guitar-teardown_dg20-back.jpg)

In order to get started, we need to remove the back of the guitar. There are components attached to both halves of the guitar, so it may be more accurate to say that we are just opening the thing up, or splitting the halves open. Remove all of the screws in the back except for the screw that holds the strap button on. Note that the metal back plate that attaches the heel of the neck must be removed in order to open the guitar up.

**Step 2 – Remove the neck**

![\1](/images/2009-12-15_casio-dg-20-guitar-teardown_dg20-inside.jpg)

Once we have the guitar open, in order to remove the neck we need to remove the two screws that are still holding the neck on that are located in the area between the heel posts that stick up toward the back of the instrument. There are also three nuts that must be removed. The nuts are located just to the right of the heel of the neck in the picture above. These nuts hold the metal stay that keeps the rubber contacts of the fretboard in contact with the ‘common’ wiring. There is one extra nut that attaches a ground connection eyelet. Once the last nuts and screws have been removed, the neck will lift clear of the body easily. If there is any resistance double check that the screws and nuts have all been removed.

**Step 3  – Remove the fingerboard**

![\1](/images/2009-12-15_casio-dg-20-guitar-teardown_dg20-neck-allenbolts.jpg)

The fingerboard is held on by double-sided adhesive tape and two small allen bolts near the nut.  First, remove the allen bolts using a 1.5mm allen wrench. The bolts can be exposed by gently pulling back the rubber fingerboard material near the nut of the guitar as shown in the photograph above.  Once the allen bolts have been removed, carefully pry the fingerboard circuit board up from the neck of the guitar, starting at the heel of the neck and working slowly up toward the nut. Since the end of the board is exposed near the heel, you can pull up gently on the end of the board to get started, and then insert a thin screwdriver several inches down the neck to start prying up the fingerboard. Continue along the length of the fingerboard until the whole board is free of the neck.

![\1](/images/2009-12-15_casio-dg-20-guitar-teardown_dg20-neck-board.jpg)

The screws that were supposed to be holding the metal truss rod in place were rattling around inside of the neck. Also there was some damage to the screw holes where the screws were supposed to go. I’m not sure if the instrument was dropped, causing the screws to shear off, or if someone had already opened the neck up to try to fix it before.  The metal bar is quite heavy, and seems to serve a dual purpose: to keep the neck straight and to balance the weight of the guitar.

Now that the fingerboard has been removed, the hard stuff is over. The rubber contact material will just pull off of the contact circuit board, as the only thing holding it on now is a small grove in the rubber material into which the edge of the circuit board fits. In the next picture we can see the contact surface of the circuit board and the contact surface of the underside of the rubber fingerboard.

![\1](/images/2009-12-15_casio-dg-20-guitar-teardown_dg20-neck-board-rubber.jpg)

**Notes on the fingerboard design and operation**

The integrated circuits that can be seen on the reverse side of the fingerboard are actually diode arrays that are intended to prevent ‘ghosting’ of finger presses. Since the operation of the guitar requires that multiple finger presses be accurately read by the guitar logic, diodes must be installed to prevent false keypresses from being registered. Note that this is not the same as debouncing. The wiring layout of the fretboard is a simple matrix, which is probably scanned by the input controller logic to determine which frets are being fingered. There is a really good explanation of key scanning and ghosting [here](http://www.dribin.org/dave/keyboard/one_html/).** **The datasheet for the diode arrays can be found [here](http://pdf1.alldatasheet.com/datasheet-pdf/view/40418/SANYO/LB1105M.html).

**Fixing the dead frets**

The resistive contact technology used in this guitar is the same that is used in most synth-action keyboards. Therefore, I am pretty confident that this controller can be fixed by using conductive paint (found in automotive windshield defroster repair kits) on the rubber contact strips of the fretboard. I have repaired my Edirol PCR-30 keyboard in this way. However, there also appears to be some damage to the ribbon cable wiring that is used to connect the fretboard to the rest of the guitar circuits.  The ribbon cable was pinched severely in the heel of the guitar when it was reassembled by a previous owner. I’ll detail the repairs in a follow-up post. In the meantime I’ll share a few close-up detail shots that I took of the fretboard assembly.

![\1](/images/2009-12-15_casio-dg-20-guitar-teardown_dg20-rubber-strips.jpg)

**Close-up of the rubber fret contacts**

![\1](/images/2009-12-15_casio-dg-20-guitar-teardown_dg20-fretboard-pads.jpg)

**Close up of the circuit board contacts. Note that the fret itself would fall in the space between the contacts.**

![\1](/images/2009-12-15_casio-dg-20-guitar-teardown_dg20-diode-array-closeup.jpg)

**Detail of the Sanyo diode IC used**
