'use strict';

var arrayBuffers = new Map(),
    midiFileParser,
    MidiFileParser = require('../parser/midi-file.js').MidiFileParser;

midiFileParser = new MidiFileParser();

module.exports = function (self) {
    self.addEventListener('message', function (event) {
        var arrayBuffer,
            destination,
            data = event.data,
            i,
            length,
            source;

        arrayBuffer = arrayBuffers.get(data.index);

        if (arrayBuffer === undefined) {
            arrayBuffer = new ArrayBuffer(data.byteLength);
            arrayBuffers.set(data.index, arrayBuffer);
        }

        destination = new Uint8Array(arrayBuffer);
        length = Math.min(data.byteIndex + 1048576, data.byteLength);
        source = new Uint8Array(data.arrayBuffer);

        for (i = data.byteIndex; i < length; i += 1) {
            destination[i] = source[i - data.byteIndex];
        }

        if (length === data.byteLength) {
            try {
                self.postMessage({
                    index: data.index,
                    midiFile: midiFileParser.parseArrayBuffer(arrayBuffer)
                });
            } catch (err) {
                self.postMessage({
                    err: {
                        message: err.message
                    },
                    index: data.index,
                    midiFile: null
                });
            }

            arrayBuffers.delete(data.index);
        }
    });
};
