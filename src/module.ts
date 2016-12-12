import { load } from 'midi-json-parser-broker';
import { worker } from './worker/worker';

const blob: Blob = new Blob([ worker ], { type: 'application/javascript' });

const url: string = URL.createObjectURL(blob);

const midiJsonParser = load(url);

export const parseArrayBuffer = midiJsonParser.parseArrayBuffer;
