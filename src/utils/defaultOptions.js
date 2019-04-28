module.exports = {
  name: '[name].[hash:8].[ext]',
  lean: false,
  // formats: null,
  // resolve: null,
  emitFile: true, // synthetic ? https://www.npmjs.com/package/sharp-loader#server-side-rendering

  cacheDirectory: true, // 'react-sharp-loader'

  // publicPath: '/public/',
  outputPath: '',

  config: {},

  limit: 10000,

  palette: true,

  presets: {
    default: {
      srcset: [
        {
          format: ['webp', 'jpg'], // order have a meaning
          width: [150, 300, 450, 600, 900, 1200, 1600],
        },
      ],
      fallback: [{ width: 1600 }],
      placeholder: [{ width: 50, base64: true }],
      palette: [{ width: 300 }],
    },
  },

  defaultPreset: 'default',
}
