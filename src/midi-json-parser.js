'use strict';

var index = 0,
    worker = new Worker('./worker/midi-json-parser.js');

module.exports = {
    parseArrayBuffer: function(arrayBuffer) {
        var currentIndex = index;

        index += 1;

        function transferSlice(byteIndex) {
            var slice;

            if (byteIndex + 1048576 < arrayBuffer.byteLength) {
                slice = arrayBuffer.slice(byteIndex, byteIndex + 1048576);

                worker.postMessage({
                    arrayBuffer: slice,
                    byteIndex: byteIndex,
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
                    byteIndex: byteIndex,
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
                    resolve(data.midiFile);
                }
            }

            worker.addEventListener('message', onMessage);

            transferSlice(0);
        });
    }
};
