const detectInstalled = require('detect-installed')
const serialize = require('serialize-javascript')

const emotionExist = detectInstalled.sync('@emotion/core', { local: true })

const stringify = data =>
  // `const React = require('react');module.exports = ${serialize(data, { isJSON: false })}`
  `
  ${emotionExist
    ? 'const { jsx } = require("@emotion/core")'
    : 'const React = require("react")'};
module.exports = ${data.default}
${Object.entries(data.files).map(([key, value]) =>
  `module.${key} = ${serialize(value, { isJSON: true })}`
).join(';')}
`

  // `const React = require('react');exports.default = ${data.default}`

module.exports = {
  stringify,
}
