const nodePath = require('path')

const emitFile = props => {
  const { loader, result, path, config, options } = props
  const newPath = nodePath.join(options.outputPath, path.fileName)

  if (options.emitFile && config.target !== 'placeholder') {
    loader.emitFile(newPath, result.buffer)
  }

  return props
}

module.exports = {
  emitFile,
}
