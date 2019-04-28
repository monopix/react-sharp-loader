const path = require('path')
const loaderUtils = require('loader-utils')
const mime = require('mime')

// https://www.npmjs.com/package/ts-loader-utils#interpolatename

module.exports = props => {
  const { loader, config, options, result } = props

  const interpolated = loaderUtils.interpolateName(loader, options.name, {
    content: result.buffer,
  })
  const { dir, name } = path.parse(interpolated)
  const ext = config.base64 ? '.txt' : result.metadata.format

  return {
    ...props,
    path: {
      dir,
      name: config.name || name,
      ext,
      hash: name.replace(/^.*\./, ''),
      mime: mime.getType(result.metadata.format),
      fileName: path.join(
        dir,
        `${config.name || name}.${result.metadata.format}`
      ),
    },
  }
}
