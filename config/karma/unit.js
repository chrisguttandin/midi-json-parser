'use strict';

var browserify = require('../../package.json').browserify;

module.exports = function (config) {

    var configuration = {

            basePath: '../../',

            browserify: {
                transform: browserify.transform
            },

            files: [
                'src/module.js',
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
                'src/module.js': 'browserify',
                'test/integration/**/*.js': 'browserify',
                'test/unit/**/*.js': 'browserify'
            }

        };

    if (process.env.TRAVIS) { // jshint ignore: line
        configuration.browsers = [
            'ChromeSauceLabs',
            'FirefoxSauceLabs'
        ];

        configuration.captureTimeout = 120000;

        configuration.customLaunchers = {
            ChromeSauceLabs: {
                base: 'SauceLabs',
                browserName: 'chrome',
                platform: 'OS X 10.11'
            },
            FirefoxSauceLabs: {
                base: 'SauceLabs',
                browserName: 'firefox',
                platform: 'OS X 10.11'
            }
        };

        configuration.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER; // jshint ignore: line
    } else {
        configuration.browsers = [
            'ChromeCanary',
            'FirefoxDeveloper'
        ];
    }

    config.set(configuration);

};
