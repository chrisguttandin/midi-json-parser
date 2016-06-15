import midiJsonParserWorker from './worker//midi-json-parser';
import webworkify from 'webworkify';

const worker = webworkify(midiJsonParserWorker);

var index = 0;

export const parseArrayBuffer = (arrayBuffer) => {
    var currentIndex = index;

    index += 1;

    const transferSlice = (byteIndex) => {
        var slice;

        if (byteIndex + 1048576 < arrayBuffer.byteLength) {
            slice = arrayBuffer.slice(byteIndex, byteIndex + 1048576);

            worker.postMessage({
                arrayBuffer: slice,
                byteIndex,
                byteLength: arrayBuffer.byteLength,
                index: currentIndex
            }, [
                slice
            ]);

            setTimeout(() => transferSlice(byteIndex + 1048576));
        } else {
            slice = arrayBuffer.slice(byteIndex);

            worker.postMessage({
                arrayBuffer: slice,
                byteIndex,
                byteLength: arrayBuffer.byteLength,
                index: currentIndex
            }, [
                slice
            ]);
        }
    }

    return new Promise((resolve, reject) => {
        const onMessage = ({ data }) => {
            if (data.index === currentIndex) {
                worker.removeEventListener('message', onMessage);

                if (data.midiFile === null) {
                    reject(new Error(data.err.message));
                } else {
                    resolve(data.midiFile);
                }
            }
        }

        worker.addEventListener('message', onMessage);

        transferSlice(0);
    });
};
