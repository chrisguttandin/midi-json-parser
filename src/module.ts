import { load } from 'midi-json-parser-broker';
import { IMidiFile } from 'midi-json-parser-worker';
import { worker } from './worker/worker';

const blob: Blob = new Blob([ worker ], { type: 'application/javascript; charset=utf-8' });

const url: string = URL.createObjectURL(blob);

const midiJsonParser = load(url);

export const connect = midiJsonParser.connect;

export const disconnect = midiJsonParser.disconnect;

export const parseArrayBuffer: (arrayBuffer: ArrayBuffer) => Promise<IMidiFile> = midiJsonParser.parseArrayBuffer;
