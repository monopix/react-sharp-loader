const sharp = require('sharp')
const size = require('./size')

const convert = (context, input, metadata, config) =>
  new Promise((resolve, reject) => {
    if (!config || !Object.keys(config).length) {
      return reject(new Error('Empty config'))
    }

    const errPrefix = `File ${config.orginalName} : `
    const image = sharp(input)

    // Object.assign(image.options, options.sharp)

    image.metadata((err, metadata) => {
      if (err) {
        return reject(new Error(errPrefix + err.message))
      }

      let width
      let height
      let extract
      let toFormat

      if (config.format) {
        toFormat = config.format
      } else if (metadata.format) {
        toFormat = metadata.format
      } else if (config.orginalExt) {
        toFormat = config.orginalExt
      } else {
        toFormat = 'jpeg'
      }

      try {
        width = size(config.width, metadata.width)
        height = size(config.height, metadata.height)
      } catch (error) {
        return reject(new Error(errPrefix + error.message))
      }

      if (width || height) {
        if (
          config.withoutEnlargement &&
          (width > metadata.width || height > metadata.height)
        ) {
          let message = `${errPrefix} Image enlargement is detected`
          if (width) {
            message += `\n  real width: ${
              metadata.width
            }px, required width: ${width}px`
          }
          if (height) {
            message += `\n  real height: ${
              metadata.height
            }px, required height: ${height}px`
          }
          if (config.errorOnEnlargement) {
            return reject(message)
          }
          if (config.skipOnEnlargement) {
            // passing a null file to the callback stops a new image being added to the pipeline for this config
            return resolve(0)
          }
        }
      }

      try {
        if (config.extractBeforeResize) {
          extract = config.extractBeforeResize
          image.extract(extract)
        }

        image.resize(width, height, {
          kernel: config.kernel,
        })

        if (config.extractAfterResize) {
          extract = config.extractAfterResize
          image.extract(extract)
        }

          // Deprecate

//         if (config.crop !== false) {
//           if (config.crop === 'entropy') {
//             image.crop(sharp.strategy.entropy)
//           } else if (config.crop === 'attention') {
//             image.crop(sharp.strategy.attention)
//           } else {
//             image.crop(config.crop)
//           }
//         }

        // Deprecate

        // if (config.embed) {
        //   image.embed()
        // }

        // Deprecate

        // if (config.max) {
        //   image.max()
        // }

        // Deprecate

        // if (config.min) {
        //   image.min()
        // }

        if (config.trim) {
          image.trim(config.trim)
        }


        // Deprecate

        // if (config.ignoreAspectRatio) {
        //   image.ignoreAspectRatio()
        // }

        // Deprecate

        // image.withoutEnlargement(config.withoutEnlargement)

        // Deprecate

        // image.background(config.background)


        image.flatten(config.flatten)
        image.negate(config.negate)

        if (config.rotate !== false) {
          if (typeof config.rotate === 'boolean') {
            image.rotate()
          } else {
            image.rotate(config.rotate)
          }
        }

        image.flip(config.flip)
        image.flop(config.flop)
        image.blur(config.blur)

        if (typeof config.sharpen === 'boolean') {
          image.sharpen(config.sharpen)
        } else {
          image.sharpen(
            config.sharpen.sigma,
            config.sharpen.flat,
            config.sharpen.jagged
          )
        }

        image.threshold(config.threshold)

        if (config.gamma !== false) {
          if (typeof config.gamma === 'boolean') {
            image.gamma()
          } else {
            image.gamma(config.gamma)
          }
        }

        image.grayscale(config.grayscale)
        image.normalize(config.normalize)
        image.withMetadata(config.withMetadata)
        image.tile(config.tile)

        if (config.withoutChromaSubsampling) {
          config.chromaSubsampling = '4.4.4' // eslint-disable-line no-param-reassign
        }

        switch (toFormat.toLowerCase()) {
          case 'webp':
            image.webp(config)
            break
          case 'png':
            image.png(config)
            break
          case 'tif':
          case 'tiff':
            image.tiff(config)
            break
          case 'raw':
            image.raw()
            break
          default:
            image.jpeg(config)
            break
        }
      } catch (error) {
        error.message = errPrefix + error.message
        return reject(new Error(error, { showStack: true }))
      }

      image.toBuffer((error, fileBuffer, info) => {
        if (error) {
          // eslint-disable-next-line no-param-reassign
          error.message = errPrefix + error.message
          return reject(new Error(error, { showStack: true }))
        }

        if (config.base64) {
          const type = `image/${info.format}`
          const prefix = `data:${type};base64,`
          const buffer = prefix + fileBuffer.toString('base64')
          return resolve({
            buffer,
            config,
            // individualConfig,  // TO DO
            info: { ...info, size: buffer.length },
          })
        }

        return resolve({
          buffer: fileBuffer,
          config,
          // individualConfig,
          info,
        })
      })
    })
  })

module.exports = {
  convert,
}
