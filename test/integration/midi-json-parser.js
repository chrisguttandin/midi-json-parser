'use strict';

var loaders = require('../helper/load-fixture.js'),
    midiJsonParser = require('../../src/midi-json-parser.js');

describe('midi-parser', function () {

    describe('parseArrayBuffer()', function () {

        leche.withData([
            ['because'],
            ['scale'],
            ['SubTractor 1'],
            ['SubTractor 2']
        ], function (filename, json) {

            it('should parse the midi file', function (done) {
                loaders.loadFixtureAsJson(filename + '.json', function (err, json) {
                    expect(err).to.be.null;

                    loaders.loadFixtureAsArrayBuffer(filename + '.mid', function (err, arrayBuffer) {
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

            it('should refuse to parse a none midi file', function (done) {
                loaders.loadFixtureAsArrayBuffer('because.json', function (err, arrayBuffer) {
                    expect(err).to.be.null;

                    midiJsonParser
                        .parseArrayBuffer(arrayBuffer)
                        .catch(function (err) {
                            expect(err.message).to.equal('Unexpected characters "{\n  " found instead of "MThd"');

                            done();
                        });
                });
            });

        });

    });

});
