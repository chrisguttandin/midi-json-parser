import { hexify } from '../helpers/hexify';
import { stringify } from '../helpers/stringify';

export const parseArrayBuffer = (arrayBuffer) => {
    var dataView,
        header,
        offset,
        tracks;

    dataView = new DataView(arrayBuffer);

    header = _parseHeaderChunk(dataView);

    offset = 14;
    tracks = [];

    for (let i = 0, length = header.numberOfTracks; i < length; i += 1) {
        let track;

        ({ offset, track } = _parseTrackChunk(dataView, offset));

        tracks.push(track);
    }

    return {
        division: header.division,
        format: header.format,
        tracks,
    };
};

const _parseEvent = (dataView, offset, lastEvent) => {
    var delta,
        eventTypeByte,
        result;

    ({ offset, value: delta } = _readVariableLengthQuantity(dataView, offset));

    offset += 1;

    eventTypeByte = dataView.getUint8(offset);

    if (eventTypeByte === 0xF0) {
        result = _parseSysexEvent(dataView, offset + 1);
    } else if (eventTypeByte === 0xFF) {
        result = _parseMetaEvent(dataView, offset + 1);
    } else {
        result = _parseMidiEvent(eventTypeByte, dataView, offset + 1, lastEvent);
    }

    result.event.delta = delta;

    return result;
};

const _parseHeaderChunk = (dataView) => {
    var division,
        format,
        numberOfTracks;

    if (stringify(dataView, 0, 4) !== 'MThd') {
        throw new Error(`Unexpected characters "${ stringify(dataView, 0, 4) }" found instead of "MThd"`);
    }

    if (dataView.getUint32(4) !== 6) {
        throw new Error(`The header has an unexpected length of ${ dataView.getUint32(4) } instead of 6`);
    }

    format = dataView.getUint16(8);
    numberOfTracks = dataView.getUint16(10);
    division = dataView.getUint16(12);

    return {
        division,
        format,
        numberOfTracks
    };
};

const _parseMetaEvent = (dataView, offset) => {
    var event,
        length,
        metaTypeByte;

    metaTypeByte = dataView.getUint8(offset);

    ({ offset, value: length } = _readVariableLengthQuantity(dataView, offset + 1));

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
                microsecondsPerBeat: ((dataView.getUint8(offset + 1) << 16) + (dataView.getUint8(offset + 2) << 8) + dataView.getUint8(offset + 3)) // eslint-disable-line no-bitwise
            }
        };
    } else if (metaTypeByte === 0x54) {
        let frameRate,
            hourByte;

        // @todo length must be 5

        hourByte = dataView.getUint8(offset + 1);

        if ((hourByte & 0x60) === 0x00) { // eslint-disable-line no-bitwise
            frameRate = 24;
        } else if ((hourByte & 0x60) === 0x20) { // eslint-disable-line no-bitwise
            frameRate = 25;
        } else if ((hourByte & 0x60) === 0x40) { // eslint-disable-line no-bitwise
            frameRate = 29;
        } else if ((hourByte & 0x60) === 0x60) { // eslint-disable-line no-bitwise
            frameRate = 30;
        }

        event = {
            smpteOffset: {
                frame: dataView.getUint8(offset + 4),
                frameRate,
                hour: hourByte & 0x1F, // eslint-disable-line no-bitwise
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
        throw new Error(`Cannot parse a meta event with a type of "${ metaTypeByte.toString(16) }"`);
    }

    return {
        event,
        offset: offset + length + 1
    };
};

const _parseMidiEvent = (statusByte, dataView, offset, lastEvent) => {
    var event,
        eventType = statusByte >> 4; // eslint-disable-line no-bitwise

    if ((statusByte & 0x80) === 0) { // eslint-disable-line no-bitwise
        offset -= 1;
    } else {
        lastEvent = null;
    }

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
                    noteNumber,
                    velocity
                }
            };
        } else {
            event = {
                noteOn: {
                    noteNumber,
                    velocity
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
            pitchBend: dataView.getUint8(offset) | (dataView.getUint8(offset + 1) << 7) // eslint-disable-line no-bitwise
        };

        offset += 2;
    } else {
        throw new Error(`Cannot parse a midi event with a type of "${ eventType.toString(16) }"`);
    }

    event.channel = statusByte & 0x0F; // eslint-disable-line no-bitwise

    return { event, offset };
};

const _parseSysexEvent = (dataView, offset) => {
    var length;

    ({ offset, value: length } = _readVariableLengthQuantity(dataView, offset));

    return {
        event: {
            sysex: hexify(dataView, offset + 1, length)
        },
        offset: offset + length + 1
    };
};

const _parseTrackChunk = (dataView, offset) => {
    var event,
        events,
        length;

    if (stringify(dataView, offset, 4) !== 'MTrk') {
        throw new Error(`Unexpected characters "${ stringify(dataView, offset, 4) }" found instead of "MTrk"`);
    }

    event = null;
    events = [];
    length = dataView.getUint32(offset + 4) + offset + 8;
    offset += 8;

    while (offset < length) {
        ({ event, offset } = _parseEvent(dataView, offset, event));

        events.push(event);
    }

    return {
        offset,
        track: events
    };
};

const _readVariableLengthQuantity = (dataView, offset) => {
    var value = 0;

    while (true) {
        let byte = dataView.getUint8(offset);

        if (byte & 0x80) { // eslint-disable-line no-bitwise
            value += (byte & 0x7f); // eslint-disable-line no-bitwise
            value <<= 7; // eslint-disable-line no-bitwise
            offset += 1;
        } else {
            value += byte;

            return {
                offset,
                value
            };
        }
    }
};
