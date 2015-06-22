'use strict';

var midiFileParser,
    MidiFileParser = require('../../../src/parser/midi-file.js').MidiFileParser,
    loadFixture = require('../../helper/load-fixture.js');

midiFileParser = new MidiFileParser();

describe('midiFileParser', function () {

    describe('parseArrayBuffer()', function () {

        it('should parse the midi file named because.mid', function (done) {
            var json = require('../../fixtures/because.json');

            loadFixture('because.mid', function (err, arrayBuffer) {
                expect(err).to.be.null;
                expect(midiFileParser.parseArrayBuffer(arrayBuffer)).to.deep.equal(json);

                done();
            });
        });

    });

});
