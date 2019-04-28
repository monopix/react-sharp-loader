const groupBy = require('lodash/groupBy')
const uniqBy = require('lodash/uniqBy')

const buildTargetObject = files => {
  const srcset = groupBy(
    uniqBy(
      files.filter(x => x.config.target === 'srcset'),
      x => x.path.fileName
    ),
    x => x.result.metadata.format
  )

  const fallback = files.filter(x => x.config.target === 'fallback').pop()
  const placeholder = files.filter(x => x.config.target === 'placeholder').pop()

  return {
    srcset,
    fallback,
    placeholder,
  }
}

module.exports = {
  buildTargetObject,
}
