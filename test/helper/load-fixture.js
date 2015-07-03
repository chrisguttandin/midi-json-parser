'use strict';

module.exports = {

    loadFixtureAsArrayBuffer: function loadFixtureAsArrayBuffer(fixture, callback) {
        var request = new XMLHttpRequest();

        request.onerror = function (event) {
            callback('request-failed');
        };
        request.onload = function (event) {
            callback(null, event.target.response);
        };
        request.open('GET', 'base/test/fixtures/' + fixture);
        request.responseType = 'arraybuffer';
        request.send();
    },

    loadFixtureAsJson: function loadFixtureAsJson(fixture, callback) {
        var request = new XMLHttpRequest();

        request.onerror = function (event) {
            callback('request-failed');
        };
        request.onload = function (event) {
            try {
                callback(null, JSON.parse(event.target.response));
            } catch (err) {
                callback('request-failed');
            }
        };
        request.open('GET', 'base/test/fixtures/' + fixture);
        request.send();
    }

};
