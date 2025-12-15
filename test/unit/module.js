import { beforeEach, describe, expect, it } from 'vitest';
import { connect, disconnect, isSupported, parseArrayBuffer } from '../../src/module';
import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';
import { filenames } from '../helper/filenames';

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
        for (const filename of filenames) {
            describe('with a midi file', () => {
                let arrayBuffer;
                let json;

                beforeEach(async () => {
                    arrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.mid`);
                    json = await loadFixtureAsJson(`${filename}.json`);
                });

                it('should parse the file', async () => {
                    const midiFile = await parseArrayBuffer(arrayBuffer);

                    expect(midiFile).to.deep.equal(json);
                });
            });

            describe('with a json file', () => {
                let arrayBuffer;

                beforeEach(async () => {
                    arrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.json`);
                });

                it('should refuse to parse the file', () => {
                    const { promise, resolve } = Promise.withResolvers();

                    parseArrayBuffer(arrayBuffer).catch((err) => {
                        expect(err.message).to.equal('Unexpected characters "{\n  " found instead of "MThd"');

                        resolve();
                    });

                    return promise;
                });
            });
        }
    });
});
