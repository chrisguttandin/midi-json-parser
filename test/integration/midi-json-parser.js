'use strict';

var loadFixture = require('../helper/load-fixture.js'),
    midiJsonParser = require('../../src/midi-json-parser.js');

describe('id3-parser', function () {

    describe('parseArrayBuffer()', function () {

        it('should parse the midi file named because.mid', function (done) {
            var json = require('../fixtures/because.json');

            loadFixture('because.mid', function (err, arrayBuffer) {
                expect(err).to.be.null;

                midiJsonParser
                    .parseArrayBuffer(arrayBuffer)
                    .then(function (midiFile) {
                        expect(midiFile).to.deep.equal(json);

                        done();
                    })
                    .catch(done);
            });
        });

        it('should parse the midi file named scale.mid', function (done) {
            var json = require('../fixtures/scale.json');

            loadFixture('scale.mid', function (err, arrayBuffer) {
                expect(err).to.be.null;

                midiJsonParser
                    .parseArrayBuffer(arrayBuffer)
                    .then(function (midiFile) {
                        expect(midiFile).to.deep.equal(json);

                        done();
                    })
                    .catch(done);
            });
        });

    });

});
