'use strict';

var loaders = require('../../helper/load-fixture.js'),
    MidiFileParser = require('../../../src/parser/midi-file.js').MidiFileParser;

describe('midiFileParser', function () {

    var midiFileParser;

    beforeEach(function () {
        midiFileParser = new MidiFileParser();
    });

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

                        expect(midiFileParser.parseArrayBuffer(arrayBuffer)).to.deep.equal(json);

                        done();
                    });
                });
            });

        });

        it('should refuse to parse a none midi file', function (done) {
            loaders.loadFixtureAsArrayBuffer('because.json', function (err, arrayBuffer) {
                expect(err).to.be.null;

                expect(function () {
                    midiFileParser.parseArrayBuffer(arrayBuffer);
                }).to.throw(Error, 'Unexpected characters "{\n  " found instead of "MThd"');

                done();
            });
        });

    });

});
