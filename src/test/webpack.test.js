const vm = require('vm')
const fs = require('fs')
const _webpack = require('webpack')
const path = require('path')
const MemoryFileSystem = require('memory-fs')
const image = fs.readFileSync(`${process.env.PWD}/src/test/image.jpg`)
const imageResult = fs.readFileSync(`${process.env.PWD}/src/test/result.jpg`)

const { PWD } = process.env
const resolvePath = (...args) => path.resolve(PWD, path.join(...args))

jest.setTimeout(15000)

const webpackConfig = (query, entry = 'index.js', extra) => {
  return {
    mode: 'production',
    // entry: path.join(__dirname, '..', '..', 'example', entry),
    entry: resolvePath('example', entry),
    context: resolvePath('example'),
    output: {
      path: resolvePath('dist'),
      publicPath: '/foo',
      filename: 'bundle.js',
      libraryTarget: 'commonjs2',
    },
    module: {
      rules: [
        {
          test: /\.(gif|jpe?g|png|svg|tiff)(\?.*)?$/,
          use: {
            loader: resolvePath('src', 'index.js'),
            query,
          },
        },
      ],
    },
    ...extra,
  }
}

const webpack = (options, inst, extra) => {
  const configuration = webpackConfig(options, inst, extra)
  const compiler = _webpack(configuration)
  compiler.outputFileSystem = new MemoryFileSystem()

  return new Promise(resolve => {
    compiler.run((err, _stats) => {
      expect(err).toBe(null)

      if (_stats.hasErrors()) {
        // eslint-disable-next-line
        console.log(_stats.toString())
        // throw new Error('webpack error occured')
      }

      const stats = _stats.toJson()
      const files = {}
      let code = ''

      stats.assets.forEach(asset => {
        files[asset.name] = compiler.outputFileSystem.readFileSync(
          path.join(configuration.output.path, asset.name)
        )
        if (asset.name === 'bundle.js') {
          code = files[asset.name].toString('utf8')
        }
      })

      const sandbox = vm.createContext({})
      sandbox.global = {}
      sandbox.module = { exports: {} }
      vm.runInContext(code, sandbox)

      resolve({ stats, files, exports: sandbox.module.exports })
    })
  })
}

xit('should works with a webpack and emit proper files', () => {
  const options = {
    cache: false,
    config: {
      grayscale: true,
    },
    // presets: {
    //   default: [{ width: 100 }],
    //   thumbnail: [{ width: [150, 300] }],
    //   prefetch: [{ width: [50, 200], grayscale: [false] }],
    //   fallback: [{ width: 240 }],
    //   placeholder: [{ width: 30, base64: true }],
    // },
    // outputs: 'default',
    // fallback: 'fallback',
    // placeholder: 'placeholder',
  }
  return webpack(options).then(({ stats, files }) => {
    expect(stats).not.toBe(null)
    expect(stats.assets.length).toBe(2)
    // NOTE: The order isn't guaranteed
    expect(Buffer.compare(files[stats.assets[0].name], imageResult)).toBe(1)
  })
})

xit('should works with a webpack and exports react module', () => {
  const options = {
    cache: false,
    config: {
      grayscale: true,
    },
    presets: {
      prefetch: {
        srcset: [
          {
            format: ['webp', 'jpg'], // order have a meaning
            width: [60, 150],
          },
        ],
        fallback: [{ width: 80 }],
        placeholder: [{ width: 50, base64: true }],
      },
    },

  }
  return webpack(options).then(({ exports }) => {
    expect(exports.a()).toMatchSnapshot()
  })
})
