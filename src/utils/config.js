/* eslint-disable no-nested-ternary */
const isArray = require('lodash/isArray')
const flatMap = require('lodash/flatMap')
const isFunction = require('lodash/isFunction')
const isPlainObject = require('lodash/isPlainObject')
const defaults = require('lodash/defaults')
const reduce = require('lodash/reduce')
const path = require('path')

const defaultConfig = {
  crop: false,
  embed: false,
  min: false,
  max: false,
  withoutEnlargement: true,
  skipOnEnlargement: true,
  ignoreAspectRatio: false,
  kernel: 'lanczos3',
  extractBeforeResize: false,
  extractAfterResize: false,
  background: '#fff',
  flatten: false,
  negate: false,
  rotate: false,
  flip: false,
  flop: false,
  blur: false,
  sharpen: false,
  threshold: false,
  gamma: false,
  grayscale: false,
  normalize: false,
  quality: 80,
  progressive: false,
  withMetadata: false,
  tile: false,
  withoutChromaSubsampling: false,
  compressionLevel: 6,
  format: null,
  trim: false,

  errorOnUnusedConfig: true,
  errorOnUnusedImage: true,
  errorOnEnlargement: true,
  passThroughUnused: false,
  stats: true,
  debug: false,
}

/**
[{ width: [150, 300] }] -> [{ width: 150 }, { width: 300 }]
[{ width: [10, 20], quality: [65, 80] }] -> [
  { width: 10, quality: 65 },
  { width: 10, quality: 80 },
  { width: 20, quality: 65 },
  { width: 20, quality: 80 },
]

{
  '*.jpg': {
    width: [600, 900]
  },
  'name.png': {
    widht: 400,
  },
  '.webp': [
    { width: 400, grayscale: true },
    { width: 400, grayscale: false },
  ],
  '*': {
    width: 400, grayscale: [true, false] },
  },
}

[
  {
    name: 'specialNme.jpg',
    width: [150, 300],
  },
    width: [150, 300, 600],
    fotmat: ['jpeg', 'webp'],
  },
  {
    base64: true,
    width: 50,
    format: 'jpeg',
  }
]

*/

const transformer = (value, key, obj) =>
  isArray(value)
    ? value.map(x => ({ ...obj, [key]: x }))
    : isFunction(value)
      ? [{ ...obj, [key]: value({ width: 90 }, obj) }]
      : isPlainObject(value)
        ? [obj]
        : [{ ...obj, [key]: value }]

const individualConfig = (config, fileName = '', label) => {
  const { name, ext } = path.parse(fileName)
  const orginal = name ? { orginalName: name, orginalExt: ext.slice(1) } : {}
  return flatMap(config, (element, fileBlob) => {
    const resultArray =
      typeof fileBlob === 'string'
        ? isArray(element)
          ? element.map(x => ({ ...x, ...orginal, name: fileBlob }))
          : [{ ...element, ...orginal, name: fileBlob }]
        : [{ ...element, ...orginal }]

    return reduce(
      element,
      (result, value, key) =>
        result.reduce((sum, x) => [...sum, ...transformer(value, key, x)], []),
      resultArray
    )
  })
}

const summaryConfig = (individual, common) => {
  const flat = individualConfig(individual)
  return flat.map(x => defaults(x, common, defaultConfig))
}

module.exports = {
  defaultConfig,
  summaryConfig,
  individualConfig,
}
