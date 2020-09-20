const { env } = require('process');

module.exports = (config) => {
    config.set({
        basePath: '../../',

        browserDisconnectTimeout: 100000,

        browserNoActivityTimeout: 100000,

        files: [
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true,
                watched: false
            },
            'test/unit/**/*.js'
        ],

        frameworks: ['leche', 'mocha', 'sinon-chai'],

        preprocessors: {
            'test/unit/**/*.js': 'webpack'
        },

        webpack: {
            mode: 'development',
            module: {
                rules: [
                    {
                        test: /\.ts?$/,
                        use: {
                            loader: 'ts-loader'
                        }
                    }
                ]
            },
            resolve: {
                extensions: ['.js', '.ts']
            }
        },

        webpackMiddleware: {
            noInfo: true
        }
    });

    if (env.TRAVIS) {
        config.set({
            browsers: ['ChromeSauceLabs', 'FirefoxSauceLabs'],

            captureTimeout: 120000,

            customLaunchers: {
                ChromeSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'chrome',
                    platform: 'OS X 10.15'
                },
                FirefoxSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'firefox',
                    platform: 'OS X 10.15'
                }
            },

            tunnelIdentifier: env.TRAVIS_JOB_NUMBER
        });
    } else {
        config.set({
            browsers: ['ChromeCanaryHeadless', 'FirefoxDeveloperHeadless']
        });
    }
};
