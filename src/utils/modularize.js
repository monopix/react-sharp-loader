const urlJoin = require('url-join')
const detectInstalled = require('detect-installed')
const cleanup = require('./cleanup')

const emotionExist = detectInstalled.sync('@emotion/core', {
  local: true,
})

const createSet = (publicPath, fileName, width) =>
  `${urlJoin(publicPath, fileName)} ${width}w`

const createContainer = (fallback, children) => `
  ${emotionExist ? 'jsx' : 'React.createElement'}('div', {
    className,
    ${emotionExist ? 'css' : 'style'}: {
      overflow: 'hidden',
      position: 'relative',
      width: '100%',
      paddingBottom: '${(fallback.result.metadata.height /
        fallback.result.metadata.width) *
        100}%',
    },
  },
    ${children.join(', ')}
  )
`
const createPicture = (format, children) => `
  ${emotionExist ? 'jsx' : 'React.createElement'}('picture', {}, [
    ${format.map(data => `
      ${emotionExist ? 'jsx' : 'React.createElement'}('source', {
        key: '${data.fileName}',
        type: '${data.mime}',
        srcSet: "${data.srcSet.join(', ')}",
        sizes: sizes || '100vw',
      }),
    `)}

    ${children.join(', ')}
  ])
`
const createImage = (files, fallback) => `
  ${emotionExist ? 'jsx' : 'React.createElement'}('img', {
    ${emotionExist ? 'css' : 'style'}: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      right: 0,
      verticalAlign: 'middle',
    },
    className: imgClassName,
    ${
      files && files.srcSet.length
        ? `srcSet: "${files.srcSet.join(', ')}",`
        : ''
    }
    alt: alt || '',
    src: "${urlJoin(
      fallback.options.publicPath || '__webpack_public_path__',
      fallback.path.fileName
    )}",
    sizes: sizes || '100vw',
  })
`
const createPlaceholder = (placeholder, fallback) => `
  ${
    fallback.result.metadata.channels <= 3
      ? `
        ${emotionExist ? 'jsx' : 'React.createElement'}('img', {
          className: imgClassName,
          src: "${placeholder.result.buffer}",
          ${emotionExist ? 'css' : 'style'}: {
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            right: 0,
            verticalAlign: 'middle',
          },
          alt: alt || '',
        })
      `
      : ''
  }
`

const modularize = files => {
  const { srcset, fallback, placeholder } = files
  const _srcset = Object.entries(srcset)

  const output = _srcset
    .pop()[1]
    .sort((a, b) => a.result.metadata.width - b.result.metadata.width)
    .reduce(
      (accu, file) => ({
        srcSet: [
          ...accu.srcSet,
          createSet(
            file.options.publicPath || '__webpack_public_path__',
            file.path.fileName,
            file.result.metadata.width
          )],
        res: [...accu.res, file.result.metadata.width],
        mime: file.path.mime,
        fileName: file.path.fileName,
      }),
      { srcSet: [], res: [] }
    )

  const picture = _srcset.map(([format, files]) =>
    files
      .sort((a, b) => a.result.metadata.width - b.result.metadata.width)
      .reduce(
        (accu, file) => ({
          srcSet: [
            ...accu.srcSet,
            createSet(
              file.options.publicPath || '__webpack_public_path__',
              file.path.fileName,
              file.result.metadata.width
            )],
          res: [...accu.res, file.result.metadata.width],
          mime: file.path.mime,
          fileName: file.path.fileName,
        }),
        { srcSet: [], res: [] }
      )
  )

  return {
    default: `({ className, imgClassName, sizes, alt } = {}) =>
      ${createContainer(fallback, [
        fallback && createPlaceholder(placeholder, fallback),
        picture && picture.length
          ? createPicture(picture, [createImage(output, fallback)])
          : createImage(output, fallback),
      ])}
    `,
    files: cleanup(files),
  }
}

module.exports = {
  modularize,
}
