const fs = require('fs')
const image = fs.readFileSync(`${process.env.PWD}/src/test/image.jpg`)
const imageResult = fs.readFileSync(`${process.env.PWD}/src/test/result.jpg`)
// const { summaryConfig } = require('./utils/config')
const loader = require('../index.js')

it('should loader works', done => {
  const that = {
    async: () => (error, data) => {
      done()
      console.log('\n------\n', data, '\n------\n')
    },
    resourceQuery: '',
    ___testOptions: {
      cache: false,
      config: {
        grayscale: true,
      },
      // presets: {
      //   default: [{ width: 100 }],
      //   thumbnail: [{ width: [150, 300] }],
      //   prefetch: [{ width: [50, 120], grayscale: [false] }],
      //   fallback: [{ width: 240, target: 'fallback' }],
      //   placeholder: [{ width: 30, base64: true, target: 'placeholder' }],
      // },
      // output: 'default',
      // fallback: 'fallback',
      // placeholder: 'placeholder',
    },
    ___testIndividual: [
      { width: 150, target: 'srcset', format: 'webp' },
      { width: 150, target: 'srcset', format: 'png' },
      { width: 150, target: 'srcset', format: 'jpg' },
      { width: 50, target: 'srcset', format: 'webp' },
      { width: 50, target: 'srcset', format: 'png' },
      { width: 50, target: 'srcset', format: 'jpg' },
      { width: 120, target: 'fallback' },
      { width: 20, target: 'placeholder' },
    ],
    emitFile: (name, buffer) => {
      if (Buffer.compare(buffer, imageResult)) {
        // done()
      }
    },
  }

  loader.call(that, image)
})
