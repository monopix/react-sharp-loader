const createBase64 = props => {
  const { config, result } = props

  if (config.base64) {
    const type = `image/${result.metadata.format}`
    const prefix = `data:${type};base64,`
    const buffer = prefix + result.buffer.toString('base64')

    return {
      ...props,
      result: {
        buffer,
        metadata: {
          ...result.metadata,
          size: buffer.length,
        },
      },
    }
  }

  return props
}

module.exports = {
  createBase64,
}
