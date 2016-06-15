var index = 0,
    midiJsonParserWorker = require('./worker/midi-json-parser.js'),
    webworkify = require('webworkify'),
    worker;

worker = webworkify(midiJsonParserWorker);

module.exports = {
    parseArrayBuffer (arrayBuffer) {
        var currentIndex = index;

        index += 1;

        function transferSlice(byteIndex) {
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

                setTimeout(function () {
                    transferSlice(byteIndex + 1048576);
                });
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

        return new Promise(function (resolve, reject) {
            function onMessage(event) {
                var data = event.data;

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
    }
};
