const loaderUtils = require('loader-utils')

module.exports = props => {
  const { buffer } = props

  const hash = loaderUtils.getHashDigest(
    buffer,
    'md5', // hashType,
    'hex', // digestType,
    32 // maxLength
  )

  return {
    ...props,
    hash,
  }
}
