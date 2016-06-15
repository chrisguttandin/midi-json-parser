import { parseArrayBuffer } from '../parser/midi-file';

const arrayBuffers = new Map();

export default (self) => {
    self.addEventListener('message', ({ data: { arrayBuffer, byteIndex, byteLength, index } }) => {
        var completeArrayBuffer,
            destination,
            length,
            source;

        completeArrayBuffer = arrayBuffers.get(index);

        if (completeArrayBuffer === undefined) {
            completeArrayBuffer = new ArrayBuffer(byteLength);
            arrayBuffers.set(index, completeArrayBuffer);
        }

        destination = new Uint8Array(completeArrayBuffer);
        length = Math.min(byteIndex + 1048576, byteLength);
        source = new Uint8Array(arrayBuffer);

        for (let i = byteIndex; i < length; i += 1) {
            destination[i] = source[i - byteIndex];
        }

        if (length === byteLength) {
            try {
                self.postMessage({
                    index,
                    midiFile: parseArrayBuffer(completeArrayBuffer)
                });
            } catch (err) {
                self.postMessage({
                    err: {
                        message: err.message
                    },
                    index,
                    midiFile: null
                });
            }

            arrayBuffers.delete(index);
        }
    });
};
