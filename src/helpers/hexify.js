/**
 * This function turns a part of a given ArrayBuffer into a hexadecimal String.
 */
export const hexify = (dataView, offset = 0, length = dataView.byteLength - (offset - dataView.byteOffset)) => {
    var hexArray,
        uint8Array;

    hexArray = [];
    offset += dataView.byteOffset;
    uint8Array = new Uint8Array(dataView.buffer, offset, length);

    for (let i = 0, length = uint8Array.length; i < length; i += 1) {
        let hex = uint8Array[i].toString(16).toUpperCase();

        if (hex.length === 1) {
            hex = 0 + hex;
        }

        hexArray[i] = hex;
    }

    return hexArray.join('');
};
