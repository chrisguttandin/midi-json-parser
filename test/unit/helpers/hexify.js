import { hexify } from '../../../src/helpers/hexify';

describe('hexify()', () => {

    var dataView;

    beforeEach(() => {
        var uint8Array = new Uint8Array([ 1, 2, 3 ]);

        dataView = new DataView(uint8Array.buffer);
    });

    it('should hexify the given buffer', () => {
        expect(hexify(dataView)).to.equal('010203');
    });

    it('should hexify the given buffer beginning at the given offset', () => {
        expect(hexify(dataView, 1)).to.equal('0203');
    });

    it('should hexify the given buffer with the specified lengtht', () => {
        expect(hexify(dataView, 0, 2)).to.equal('0102');
    });

});
