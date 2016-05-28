'use strict';

var hexify = require('../helpers/hexify.js'),
    stringify = require('../helpers/stringify.js');

function MidiFileParser () {}

MidiFileParser.prototype.parseArrayBuffer = function(arrayBuffer) {
    var dataView,
        header,
        i,
        offset,
        tracks;

    dataView = new DataView(arrayBuffer);

    header = this._parseHeaderChunk(dataView);

    offset = 14;
    tracks = [];

    for (i = 0; i < header.numberOfTracks; i += 1) {
        let track;

        ({ offset, track } = this._parseTrackChunk(dataView, offset)); // jshint ignore: line

        tracks.push(track);
    }

    return {
        division: header.division,
        format: header.format,
        tracks: tracks
    };
};

MidiFileParser.prototype._parseEvent = function (dataView, offset, lastEvent) {
    var delta,
        eventTypeByte,
        result;

    ({ offset, value: delta } = this._readVariableLengthQuantity(dataView, offset)); // jshint ignore: line

    offset += 1;

    eventTypeByte = dataView.getUint8(offset);

    if (eventTypeByte === 0xF0) {
        result = this._parseSysexEvent(dataView, offset + 1);
    } else if (eventTypeByte === 0xFF) {
        result = this._parseMetaEvent(dataView, offset + 1);
    } else {
        result = this._parseMidiEvent(eventTypeByte, dataView, offset + 1, lastEvent);
    }

    result.event.delta = delta;

    return result;
};

MidiFileParser.prototype._parseHeaderChunk = function (dataView) {
    var division,
        format,
        numberOfTracks;

    if (stringify(dataView, 0, 4) !== 'MThd') {
        throw new Error(`Unexpected characters "${stringify(dataView, 0, 4)}" found instead of "MThd"`);
    }

    if (dataView.getUint32(4) !== 6) {
        throw new Error(`The header has an unexpected length of ${dataView.getUint32(4)} instead of 6`);
    }

    format = dataView.getUint16(8);
    numberOfTracks = dataView.getUint16(10);
    division = dataView.getUint16(12);

    return {
        division: division,
        format: format,
        numberOfTracks: numberOfTracks
    };
};

MidiFileParser.prototype._parseMetaEvent = function (dataView, offset) {
    var event,
        length,
        metaTypeByte;

    metaTypeByte = dataView.getUint8(offset);

    ({ offset, value: length } = this._readVariableLengthQuantity(dataView, offset + 1)); // jshint ignore: line

    if (metaTypeByte === 0x03) {
        event = {
            trackName: stringify(dataView, offset + 1, length)
        };
    } else if (metaTypeByte === 0x20) {
        event = {
            channelPrefix: dataView.getUint8(offset + 1)
        };
    } else if (metaTypeByte === 0x21) {
        event = {
            midiPort: dataView.getUint8(offset + 1)
        };
    } else if (metaTypeByte === 0x2F) {

        // @todo length must be 0

        event = {
            endOfTrack: true
        };
    } else if (metaTypeByte === 0x51) {

        // @todo length must be 5

        event = {
            setTempo: {
                /* jshint bitwise: false */
                microsecondsPerBeat: ((dataView.getUint8(offset + 1) << 16) + (dataView.getUint8(offset + 2) << 8) + dataView.getUint8(offset + 3))
                /* jshint bitwise: true */
            }
        };
    } else if (metaTypeByte === 0x54) {
        let frameRate,
            hourByte;

        // @todo length must be 5

        hourByte = dataView.getUint8(offset + 1);

        /* jshint bitwise: false */
        if ((hourByte & 0x60) === 0x00) {
            frameRate = 24;
        } else if ((hourByte & 0x60) === 0x20) {
            frameRate = 25;
        } else if ((hourByte & 0x60) === 0x40) {
            frameRate = 29;
        } else if ((hourByte & 0x60) === 0x60) {
            frameRate = 30;
        }
        /* jshint bitwise: true */

        event = {
            smpteOffset: {
                frame: dataView.getUint8(offset + 4),
                frameRate: frameRate,
                /* jshint bitwise: false */
                hour: hourByte & 0x1F,
                /* jshint bitwise: true */
                minutes: dataView.getUint8(offset + 2),
                seconds: dataView.getUint8(offset + 3),
                subFrame: dataView.getUint8(offset + 5)
            }
        };
    } else if (metaTypeByte === 0x58) {
        event = {
            timeSignature: {
                denominator: Math.pow(2, dataView.getUint8(offset + 2)),
				metronome: dataView.getUint8(offset + 3),
                numerator: dataView.getUint8(offset + 1),
				thirtyseconds: dataView.getUint8(offset + 4)
            }
        };
    } else if (metaTypeByte === 0x59) {

        // @todo length must be 2

        event = {
            keySignature: {
                key: dataView.getInt8(offset + 1),
                scale: dataView.getInt8(offset + 2)
            }
        };
    } else {
        throw new Error(`Cannot parse a meta event with a type of "${metaTypeByte.toString(16)}"`);
    }

    return {
        event: event,
        offset: offset + length + 1
    };
};

MidiFileParser.prototype._parseMidiEvent = function (statusByte, dataView, offset, lastEvent) {
    var event,
        /* jshint bitwise: false */
        eventType = statusByte >> 4;
        /* jshint bitwise: true */

    /* jshint bitwise: false */
    if ((statusByte & 0x80) === 0) {
        offset -= 1;
    } else {
        lastEvent = null;
    }
    /* jshint bitwise: true */

    if (eventType === 0x08 || (lastEvent !== null && lastEvent.noteOff !== undefined)) {
        event = {
            noteOff: {
                noteNumber: dataView.getUint8(offset),
                velocity: dataView.getUint8(offset + 1)
            }
        };

        offset += 2;
    } else if (eventType === 0x09 || (lastEvent !== null && lastEvent.noteOn !== undefined)) {
        let noteNumber,
            velocity;

        noteNumber = dataView.getUint8(offset);
        velocity = dataView.getUint8(offset + 1);

        if (velocity === 0) {
            event = {
                noteOff: {
                    noteNumber: noteNumber,
					velocity: velocity
                }
            };
        } else {
            event = {
                noteOn: {
                    noteNumber: noteNumber,
					velocity: velocity
                }
            };
        }

        offset += 2;
    } else if (eventType === 0x0B || (lastEvent !== null && lastEvent.controlChange !== undefined)) {
        event = {
            controlChange: {
                type: dataView.getUint8(offset),
			    value: dataView.getUint8(offset + 1)
            }
        };

        offset += 2;
    } else if (eventType === 0x0C || (lastEvent !== null && lastEvent.programChange !== undefined)) {
        event = {
            programChange: {
                programNumber: dataView.getUint8(offset)
            }
        };

        offset += 1;
    } else if (eventType === 0x0E || (lastEvent !== null && lastEvent.pitchBend !== undefined)) {
        event = {
            /* jshint bitwise: false */
            pitchBend: dataView.getUint8(offset) | dataView.getUint8(offset + 1) << 7
            /* jshint bitwise: true */
        };

        offset += 2;
    } else {
        throw new Error(`Cannot parse a midi event with a type of "${eventType.toString(16)}"`);
    }

    /* jshint bitwise: false */
    event.channel = statusByte & 0x0F;
    /* jshint bitwise: true */

    return { event, offset };
};

MidiFileParser.prototype._parseSysexEvent = function (dataView, offset) {
    var length;

    ({ offset, value: length } = this._readVariableLengthQuantity(dataView, offset)); // jshint ignore: line

    return {
        event: {
            sysex: hexify(dataView, offset + 1, length)
        },
        offset: offset + length + 1
    };
};

MidiFileParser.prototype._parseTrackChunk = function (dataView, offset) {
    var event,
        events,
        length;

    if (stringify(dataView, offset, 4) !== 'MTrk') {
        throw new Error(`Unexpected characters "${stringify(dataView, offset, 4)}" found instead of "MTrk"`);
    }

    event = null;
    events = [];
    length = dataView.getUint32(offset + 4) + offset + 8;
    offset += 8;

    while (offset < length) {
        ({ event, offset } = this._parseEvent(dataView, offset, event)); // jshint ignore: line

        events.push(event);
    }

    return {
        offset: offset,
        track: events
    };
};

MidiFileParser.prototype._readVariableLengthQuantity = function (dataView, offset) {
    var value = 0;

    while (true) {
		let byte = dataView.getUint8(offset);

        /* jshint bitwise: false */
    	if (byte & 0x80) {
			value += (byte & 0x7f);
			value <<= 7;
            offset += 1;
		} else {
            value += byte;

			return {
                offset,
                value
            };
		}
        /* jshint bitwise: true */
	}
};

module.exports.MidiFileParser = MidiFileParser;
