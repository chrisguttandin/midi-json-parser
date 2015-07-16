'use strict';

var browserify = require('../../package.json').browserify;

module.exports = function (config) {

    config.set({

        basePath: '../../',

        browserify: {
            transform: browserify.transform
        },

        browsers: [
            'ChromeCanary',
            'FirefoxDeveloper'
        ],

        files: [
            'src/midi-json-parser.js',
            {
                included: false,
                pattern: 'src/**/*.js',
                served: false,
                watched: true,
            },
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true,
                watched: true,
            },
            'test/integration/**/*.js',
            'test/unit/**/*.js'
        ],

        frameworks: [
            'browserify',
            'leche',
            'mocha',
            'sinon-chai' // implicitly uses chai too
        ],

        preprocessors: {
            'src/midi-json-parser.js': 'browserify',
            'test/integration/**/*.js': 'browserify',
            'test/unit/**/*.js': 'browserify'
        }

    });

};
