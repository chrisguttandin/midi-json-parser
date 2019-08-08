import { connect, disconnect, isSupported, parseArrayBuffer } from '../../src/module';
import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';

describe('module', () => {

    describe('connect()', () => {

        it('should connect a port', () => {
            return connect()
                .then((port) => {
                    expect(port).to.be.an.instanceOf(MessagePort);
                });
        });

    });

    describe('disconnect()', () => {

        let port;

        beforeEach(() => connect()
            .then((prt) => port = prt));

        it('should disconnect a port', () => {
            return disconnect(port);
        });

    });

    describe('isSupported()', () => {

        it('should export a function', () => {
            expect(isSupported).to.be.a('function');
        });

    });

    describe('parseArrayBuffer()', () => {

        leche.withData([
            [ '98137' ],
            [ 'A_F_NO7_01' ],
            [ 'MIDIOkFormat1-lyrics' ],
            [ 'MIDIOkFormat2' ],
            [ 'SubTractor 1' ],
            [ 'SubTractor 2' ],
            [ 'TheEntertainer' ],
            [ 'because' ],
            [ 'californication' ],
            [ 'minute_waltz' ],
            [ 'rachmaninov3' ],
            [ 'scale' ],
            [ 'test' ],
            [ 'test8bars' ]
        ], (filename) => {

            it('should parse the midi file', function (done) {
                this.timeout(6000);

                loadFixtureAsJson(filename + '.json', (err, json) => {
                    expect(err).to.be.null;

                    loadFixtureAsArrayBuffer(filename + '.mid', (rr, arrayBuffer) => {
                        expect(rr).to.be.null;

                        parseArrayBuffer(arrayBuffer)
                            .then((midiFile) => {
                                expect(midiFile).to.deep.equal(json);

                                done();
                            })
                            .catch(done);
                    });
                });
            });

            it('should refuse to parse a none midi file', function (done) {
                this.timeout(6000);

                loadFixtureAsArrayBuffer(filename + '.json', (err, arrayBuffer) => {
                    expect(err).to.be.null;

                    parseArrayBuffer(arrayBuffer)
                        .catch((err_) => {
                            expect(err_.message).to.equal('Unexpected characters "{\n  " found instead of "MThd"');

                            done();
                        });
                });
            });

        });

    });

});
