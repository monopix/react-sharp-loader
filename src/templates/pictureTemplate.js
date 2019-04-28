module.exports = `
  {{emotionExist ? 'jsx' : 'React.createElement'}}('picture', {}, [
    {{emotionExist ? 'jsx' : 'React.createElement'}}('source', {
      type: 'image/webp',
      srcSet: "${files.srcSet.join(', ')}",
      sizes: sizes || '100vw',
    }),

    {{children.join(', ')}}
  ])
`
