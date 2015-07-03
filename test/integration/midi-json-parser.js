'use strict';

var loaders = require('../helper/load-fixture.js'),
    midiJsonParser = require('../../src/midi-json-parser.js');

describe('id3-parser', function () {

    describe('parseArrayBuffer()', function () {

        leche.withData([
            ['because'],
            ['scale']
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

        });

    });

});
