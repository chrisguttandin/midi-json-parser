import { connect, disconnect, isSupported, parseArrayBuffer } from '../../src/module';
import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';

describe('module', () => {
    describe('connect()', () => {
        it('should connect a port', () => {
            return connect().then((port) => {
                expect(port).to.be.an.instanceOf(MessagePort);
            });
        });
    });

    describe('disconnect()', () => {
        let port;

        beforeEach(() => connect().then((prt) => (port = prt)));

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
        leche.withData(
            [
                ['98137'],
                ['A_F_NO7_01'],
                ['MIDIOkFormat1-lyrics'],
                ['MIDIOkFormat2'],
                ['SubTractor 1'],
                ['SubTractor 2'],
                ['TheEntertainer'],
                ['because'],
                ['californication'],
                ['minute_waltz'],
                ['rachmaninov3'],
                ['scale'],
                ['test'],
                ['test8bars']
            ],
            (filename) => {
                describe('with a midi file', () => {
                    let arrayBuffer;
                    let json;

                    beforeEach(async function () {
                        this.timeout(20000);

                        arrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.mid`);
                        json = await loadFixtureAsJson(`${filename}.json`);
                    });

                    it('should parse the file', async function () {
                        this.timeout(20000);

                        const midiFile = await parseArrayBuffer(arrayBuffer);

                        expect(midiFile).to.deep.equal(json);
                    });
                });

                describe('with a json file', () => {
                    let arrayBuffer;

                    beforeEach(async function () {
                        this.timeout(20000);

                        arrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.json`);
                    });

                    it('should refuse to parse the file', function (done) {
                        this.timeout(20000);

                        parseArrayBuffer(arrayBuffer).catch((err) => {
                            expect(err.message).to.equal('Unexpected characters "{\n  " found instead of "MThd"');

                            done();
                        });
                    });
                });
            }
        );
    });
});
