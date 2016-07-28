import * as midiFileParser from '../../../src/parser/midi-file';
import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../../helper/load-fixture';

describe('midiFileParser', function () {

    describe('parseArrayBuffer()', function () {

        leche.withData([ // eslint-disable-line no-undef
            ['because'],
            ['scale'],
            ['SubTractor 1'],
            ['SubTractor 2']
        ], function (filename) {

            it('should parse the midi file', function (done) {
                this.timeout(5000);

                loadFixtureAsJson(filename + '.json', function (err, json) {
                    expect(err).to.be.null;

                    loadFixtureAsArrayBuffer(filename + '.mid', function (err, arrayBuffer) {
                        expect(err).to.be.null;

                        expect(midiFileParser.parseArrayBuffer(arrayBuffer)).to.deep.equal(json);

                        done();
                    });
                });
            });

            it('should refuse to parse a none midi file', function (done) {
                this.timeout(5000);

                loadFixtureAsArrayBuffer(filename + '.json', function (err, arrayBuffer) {
                    expect(err).to.be.null;

                    expect(function () {
                        midiFileParser.parseArrayBuffer(arrayBuffer);
                    }).to.throw(Error, 'Unexpected characters "{\n  " found instead of "MThd"');

                    done();
                });
            });

        });

    });

});
