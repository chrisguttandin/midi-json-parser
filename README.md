# midi-json-parser

**This module is parsing midi files into a human-readable JSON object.**

[![tests](https://img.shields.io/travis/chrisguttandin/midi-json-parser/master.svg?style=flat-square)](https://travis-ci.org/chrisguttandin/midi-json-parser)
[![dependencies](https://img.shields.io/david/chrisguttandin/midi-json-parser.svg?style=flat-square)](https://www.npmjs.com/package/midi-json-parser)
[![version](https://img.shields.io/npm/v/midi-json-parser.svg?style=flat-square)](https://www.npmjs.com/package/midi-json-parser)

This module parses a binary MIDI file and turns it into a JSON representation.

Developing this module wouldn't have been possible without all the great resources out there. The
following list tries to mention a few of them:

- A detailed specification of the MIDI file format as HTML: [Standard MIDI-File Format Spec. 1.1, updated](http://www.music.mcgill.ca/~ich/classes/mumt306/StandardMIDIfileformat.html) and PDF: [Standard MIDI-File Format Spec. 1.1, updated](http://www.cs.cmu.edu/~music/cmsip/readings/Standard-MIDI-file-format-updated.pdf)

- A brief description of the MIDI file format: [Outline of the Standard MIDI File Structure](http://www.ccarh.org/courses/253/handout/smf/)

- A blog post about the timing information in MIDI files: [Timing in MIDI files](http://sites.uci.edu/camp2014/2014/05/19/timing-in-midi-files/)

- An explanation of the concept called running status: [Running Status](http://www.blitter.com/~russtopia/MIDI/~jglatt/tech/midispec/run.htm)

- Actually a documentation for a Python library, but it also contains extensive information on MIDI messages itself: [Mido - MIDI Objects for Python](http://mido.readthedocs.org/en/latest/index.html)

- Very detailed information on meta messages, but also on many other non MIDI related audio topics as well: [RecordingBlogs.com Wiki](http://www.recordingblogs.com/sa/tabid/88/Default.aspx?topic=MIDI+meta+messages)

- A JavaScript MIDI parser and synthesiser: [jasmid - A Javascript MIDI file reader and synthesiser](https://github.com/gasman/jasmid) and its excluded parser: [midi-file-parser](https://github.com/NHQ/midi-file-parser)

- A complete MIDI app which also contains a parser: [MIDI.js](https://github.com/mudcube/MIDI.js)

- A very similar parser but for Node.js only [MIDI Converter](https://github.com/mobyvb/midi-converter)

- A parser for converting MIDI into a JavaScript object which can also turn it back into a binary MIDI file again: [MIDIFile](https://github.com/nfroidure/MIDIFile)
