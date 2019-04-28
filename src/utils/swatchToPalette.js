const sortBy = require('lodash/sortBy')

module.exports = swatch => {
  const palette = Object.entries(swatch).reduce(
    (result, [key, value]) => ({
      ...result,
      ...(value
        ? {
            [key]: {
              popularity: value.getPopulation(),
              hex: value.getHex(),
              name: key,
            },
          }
        : {}),
    }),
    {}
  )

  const byPopularity = sortBy(palette, ['popularity']).reverse()

  return {
    byPopularity,
    byName: palette,
  }
}
