const loaderUtils = require('loader-utils')
const defaults = require('lodash/defaults')
const findCacheDir = require('find-cache-dir')
const defaultOptions = require('./defaultOptions')
const PKG = require('../../package.json')

const createOptions = that => {
  const opts = defaults(
    {},
    loaderUtils.getOptions(that),
    that.___testOptions,
    defaultOptions
  )

  let cacheDirectory = null
  if (typeof opts.cacheDirectory === 'string' && opts.cacheDirectory) {
    cacheDirectory = findCacheDir({
      name: opts.cacheDirectory,
    })
  } else if (opts.cacheDirectory === true) {
    cacheDirectory = findCacheDir({
      name: PKG.name,
    })
  }

  return {
    ...opts,
    presets: {
      ...defaultOptions.presets,
      ...opts.presets,
    },
    cacheDirectory,
  }
}

const createQuery = that => {
  const query =
    (that.resourceQuery && loaderUtils.parseQuery(that.resourceQuery)) || {}

  return query
}

module.exports = {
  createOptions,
  createQuery,
}
