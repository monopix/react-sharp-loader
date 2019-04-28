const sharp = require('sharp')
const Vibrant = require('node-vibrant')
const findCacheDir = require('find-cache-dir')
const cacache = require('cacache')
const { from } = require('rxjs')
const { map, mergeMap, tap, reduce, catchError } = require('rxjs/operators')
const { applyConfig } = require('./utils/applyConfig')
const { createBase64 } = require('./utils/createBase64')
const { emitFile } = require('./utils/emitFile')
const { stringify } = require('./utils/stringify')
const { buildTargetObject } = require('./utils/buildTargetObject')
const { modularize } = require('./utils/modularize')
const { createOptions, createQuery } = require('./utils/createOptions')
// const swatchToPalette = require('./utils/swatchToPalette')
const createConfigs = require('./utils/createConfigs')
const createPath = require('./utils/createPath')
const createHash = require('./utils/createHash')

module.exports = function loader(buffer) {
  if (this.cacheable) this.cacheable()

  const callback = this.async()
  const image = sharp(buffer)
  // const vibrant = new Vibrant(buffer, {})
  const options = createOptions(this)
  const query = createQuery(this)
  const configs = createConfigs(this, options, query)


  from(configs)
    .pipe(
      // Prepare props.
      map(props => ({
        ...props,
        query,
        buffer,
        options,
        loader: this,
        image: image.clone(),
      })),
      mergeMap(props =>
        from(props.image.metadata()).pipe(
          map(metadata => ({ ...props, metadata }))
        )
      ),
      map(options.createHash || createHash),

      // Get color palette from image.
      // mergeMap(props =>
      //   from(vibrant.getPalette()).pipe(
      //     map(swatchToPalette),
      //     map(palette => ({
      //       ...props,
      //       palette,
      //     })),
      //     catchError(callback)
      //   )
      // ),

      // Configuring sharp object.
      tap(options.applyConfig || applyConfig),

      // Converting images.
      mergeMap(props =>
        from(props.image.toBuffer({ resolveWithObject: true })).pipe(
          map(({ data, info }) => ({
            ...props,
            result: {
              buffer: data,
              metadata: info,
            },
          })),
          catchError(callback)
        )
      ),
      map(options.createPath || createPath),
      map(options.createBase64 || createBase64),

      // mergeMap(props =>
      //   from(
      //     cacache.put(options.cacheDirectory, props.hash, result.buffer)).pipe(
      //     map(({ data, info }) => ({
      //       ...props,
      //       result: {
      //         buffer: data,
      //         metadata: info,
      //       },
      //     })),
      //     catchError(callback)
      //   )
      // ),

      // Save images on a disk.
      tap(props =>
        typeof options.emitFile === 'function'
          ? options.emitFile(props)
          : emitFile(props)
      ),

      // Prepare module.
      reduce((acc, val) => [...acc, val], []),
      map(options.buildTargetObject || buildTargetObject),
      map(options.modularize || modularize),
      map(options.stringify || stringify),

      // End.
      catchError(callback),
      tap(data => callback(null, data))

      // https://github.com/webpack-contrib/url-loader/blob/master/src/index.js
    )
    .subscribe()
}

module.exports.raw = true
