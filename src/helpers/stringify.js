/**
 * This function turns a part of a given ArrayBuffer into a String.
 */
module.exports = function stringify(dataView, offset, length) {
    var array;

    if (arguments.length < 2) {
        offset = dataView.byteOffset;
    } else {
        offset += dataView.byteOffset;
    }

    if (arguments.length < 3) {
        length = dataView.byteLength - (offset - dataView.byteOffset);
    }

    array = new Uint8Array(dataView.buffer, offset, length);

    return String.fromCharCode.apply(null, array);
};
