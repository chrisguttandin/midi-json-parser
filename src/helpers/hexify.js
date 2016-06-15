/**
 * This function turns a part of a given ArrayBuffer into a hexadecimal String.
 */
module.exports = function hexify(dataView, offset, length) {
    var hexArray,
        uint8Array;

    if (arguments.length < 2) {
        offset = dataView.byteOffset;
    } else {
        offset += dataView.byteOffset;
    }

    if (arguments.length < 3) {
        length = dataView.byteLength - (offset - dataView.byteOffset);
    }

    uint8Array = new Uint8Array(dataView.buffer, offset, length);

    hexArray = [];
    length = uint8Array.length;

    for (let i = 0; i < length; i += 1) {
        let hex = uint8Array[i].toString(16).toUpperCase();

        if (hex.length === 1) {
            hex = 0 + hex;
        }

        hexArray[i] = hex;
    }

    return hexArray.join('');
};
