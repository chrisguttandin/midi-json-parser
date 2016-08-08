import { stringify } from '../../../src/helpers/stringify';

describe('stringify()', () => {

    var dataView;

    beforeEach(() => {
        var uint8Array = new Uint8Array([ 65, 66, 67 ]);

        dataView = new DataView(uint8Array.buffer);
    });

    it('should stringify the given buffer', () => {
        expect(stringify(dataView)).to.equal('ABC');
    });

    it('should stringify the given buffer beginning at the given offset', () => {
        expect(stringify(dataView, 1)).to.equal('BC');
    });

    it('should stringify the given buffer with the specified lengtht', () => {
        expect(stringify(dataView, 0, 2)).to.equal('AB');
    });

});
