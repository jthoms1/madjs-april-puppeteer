
var path = require('path');
process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function(config) {
  config.set({
    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-typescript'
    ],

    browsers: ['ChromeHeadless'], // run in Chrome and Firefox

    singleRun: true, // set this to false to leave the browser open

    frameworks: ['jasmine', 'karma-typescript'],

    preprocessors: {
      "**/*.ts": "karma-typescript"
    },

    files: [
      'src/tests/**/e2e.ts',
    ],

    reporters: ['progress'],

    karmaTypescriptConfig: {
      tsconfig: "./tsconfig.json"
    },
  });
};
