const omit = require('lodash/omit')

// remove binary Buffer

module.exports = data =>
  omit(data, [
    'srcset',
    'fallback.buffer',
    'fallback.image',
    'fallback.loader',
    'fallback.options',
    'fallback.result.buffer',
    'placeholder.buffer',
    'placeholder.image',
    'placeholder.loader',
    'placeholder.options',
    'placeholder.result.buffer',
  ])
