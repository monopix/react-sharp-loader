/* eslint-disable */

module.exports = function (wallaby) {

  process.env.NODE_ENV = 'test'

  return {
    files: [
      // {pattern: 'node_modules/react/dist/react-with-addons.js', instrument: false},
      // 'server/**',
      // { patern: 'modules/react-tinymce/es/*.js', instrument: false },
      'src/**',
      'index.js',
      'package.json',
      '!**/__tests__/*.{js,jsx}',
      '!**/*.test.{js,jsx}',
      '!**/*.spec.{js,jsx}',
      '!**/node_modules/**',
      '!**/vendor/**',
    ],

    tests: [
      '**/*.{test,spec}.js',
      '!**/node_modules/**',
      '!**/vendor/**',
    ],

    compilers: {
      '**/*.js?(x)': wallaby.compilers.babel()
    },

    testFramework: 'jest',

    env: {
      type: 'node',
      runner: 'node'
    },

    // debug: true,

    setup: function (wallaby) {
      var jestConfig = require(`${process.env.PWD}/jest.config.js`)

      // for example:
      // jestConfig.globals = { "__DEV__": true }
      jestConfig.globals = Object.assign({}, jestConfig.globals, {
      })
      delete jestConfig.rootDir

      wallaby.testFramework.configure(jestConfig)
    },
  }
}
