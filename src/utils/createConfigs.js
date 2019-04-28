const defaults = require('lodash/defaults')
const { individualConfig, defaultConfig } = require('./config')

module.exports = (that, options, query) => {
  const { defaultPreset, presets, config } = options

  const currentPreset = query.preset
    ? presets[query.preset]
    : presets[defaultPreset]

  if (!currentPreset) throw new Error('Preset not found')

  const srcset = individualConfig(currentPreset.srcset).map(x => ({
    ...x,
    target: 'srcset',
  }))

  const fallback = individualConfig(currentPreset.placeholder).map(x => ({
    ...x,
    target: 'fallback',
  }))

  const placeholder = individualConfig(currentPreset.placeholder).map(x => ({
    ...x,
    target: 'placeholder',
  }))

  const individual = that.___testIndividual || [
      ...srcset,
      ...fallback,
      ...placeholder,
    ] || [{}]

  return individual.map(local => ({
    defaultConfig,
    individualConfig: local,
    config: defaults({}, local, config, defaultConfig),
  }))
}
