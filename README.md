React-sharp-loader
==================

> **image file > webpack loader > react component >** :sparkles:

*This loader is in test stage. I check if this approach makes sense. That means there can be a lot of changes from version to version.*

## Features

- **`<MyImage />` simple usage**.
- **support for emotion 10 (but not required)**
- **all in one component: placeholder, srcset, fallback**
- supports server-side rendering
- default config should be enough for most, but..
- if you want, you can change sharp config, or even inner functions.

## Future

not before version 0.2

- Access from react to: metadata, configs, dominant/vibrant colors etc.
- limit: 10000 bytes, if less then that, loader output only base64.
- better support for images lower size then declared in presets
- cache for speed up
- lazy load
- Support for height and max-height css


## Install:
```shell
yarn add react-sharp-loader
```


## Usage

### Illustrative example

Death simple import responsive images with react component

```js
import React from 'react'
import MyImage from 'imageFile.jpg'

export default () => (
  <div>
    <MyImage />
  </div>
)
```

And that’s all. In DOM you have similar structure to this one:
```js
<div>
  <img src="data:base64 .. placeholder" alt="" />
  <picture>
    <source
      type="image/webp"
      setsrc="image.300.webp 300w, image.600.webp 600w"
    />
    <img
      setsrc="image.300.jpg 300w, image.600.jpg 600w"
      src="fallback.jpg"
      alt=""
    />
  </picture>
</div>
```

Note: If you don't like output react component, you can declare your own function to create component like you want to have.

### import examples:
```js
import MyImage from 'image.jpg'
import MyImage from 'image.jpg?preset=myPresetName'
```

### Usage component:
```js
<MyImage alt="Lorem ipsum" />

// emotion 10+
<MyImage css={css`border: solid 1px red`} />
```


## Webpack:
```js
///...
module: {
  rules: [
    // ...
    {
      test: /\.(jpe?g|png|webp|gif|tiff?|svg)$/,
      loader: require.resolve('react-sharp-loader'),
    },
    // ...
  ],
},
// ...
```

### More advanced webpack example:

This loader use Sharp to image conversion. Mode information about opbtions in [Sharp documentation](https://sharp.pixelplumbing.com/en/stable/api-operation/).

```js
{
  test: /\.(jpe?g|png|webp|gif|tiff?|svg)$/,
  loader: require.resolve('react-sharp-loader'),
  options: {
    emitFile: !isSSR,
    publicPath: paths.url.images,
    outputPath: 'images',
    name: '[name].[hash:8].[ext]',
    cacheDirectory: true,
    config: {
      grayscale: true,
    },

    presets: {
      default: {
        srcset: [
          {
            format: ['webp', 'jpg'], // order have a meaning
            width: [150, 300, 450, 600, 900, 1200, 1600],
          },
        ],
        fallback: [{ width: 1600 }],
        placeholder: [{ width: 50, base64: true }],
      },
    },
  },
},
```

### Sharp config examples:

```js
[{ width: [150, 300] }]

[{ width: [10, 20], quality: [65, 80] }]

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
```

Notation like this
```js
[{ width: [10, 20], quality: [65, 80] }]
```
will give you such files:
```js
[
  { width: 10, quality: 65 },
  { width: 10, quality: 80 },
  { width: 20, quality: 65 },
  { width: 20, quality: 80 },
]
```

## API

### React Image Component

Property | Type | Default | Description
:--- | :--- | :------ | :----------
alt | String | | Alt for img tag.
sizes | String | 100vw | Sizes for img and picture tag.
className | String | | Container class.
imgClassName | String | | img tag class.

### Webpack loader options

Option | Type | Default | Description
:--- | :--- | :------ | :----------
name | String | [name].[hash:8].[ext] | File name for convered image.
emitFile | [Boolean, Function] | true | Write file on disk (Useful in ssr). or function to do that.
cacheDirectory | [String Boolean] | true | Cache file directory on disk.
publicPath | String | | url directory.
outputPath | String | | Output file on disk.
config | Object | | Common config for all files.
limit | Number | 10000 | If file size is less than than, loader export img tag with base64 source, without any setsrc, placholders etc.
presets | Object | { default } | Configs for sharp image converter.
defaultPreset | String | default | Default preset to use if no other is specified.
createHash | Function |  | Generate hash for input file.
applyConfig | Function |  | Apply config to sharp image instance.
createPath | Function |  | Create info about fileName, dir, mime etc.
createBase64 | Function |  | Create base64 data.
buildTargetObject | Function |  | Sort result files to target objects.
modularize | Function |  | Create react component and other information to export.
stringify | Function |  | Export data.


### Preset options

```js
/// ...
presets: {
  [myPresetName]: {
    [target]: sharpConfig,
  },
},
```

Target  | Type | Default | Description
:--- | :--- | :------ | :----------
srcset | Object | { ... } | Sharp config for srcset. The last one is used in img tag, others is for picture tag
fallback | Object | [{ width: 1600 }] | Sharp config for img source.
placeholder | Object | [{ width: 50, base64: true }] | Sharp config for create placeholder img tag.
palette | Object | [{ width: 300 }] | Sharp config for generate dominant colors.
outputPath | String | | Output file on disk.
config | Object | | Common config for all files.
limit | Number | 10000 | If file size is less than than, loader export img tag with base64 source, without any setsrc, placholders etc.
presets | Object | { default } | Configs for sharp image converter.
defaultPreset | String | default | Default preset to use if no other is specified.


Webpack default options in code:
```js
name: '[name].[hash:8].[ext]',
emitFile: true,
cacheDirectory: true,
outputPath: '',
config: {},
limit: 10000,
palette: true,
presets: {
  default: {
    srcset: [
      {
        format: ['webp', 'jpg'], // order have a meaning
        width: [150, 300, 450, 600, 900, 1200, 1600],
      },
    ],
    fallback: [{ width: 1600 }],
    placeholder: [{ width: 50, base64: true }],
    palette: [{ width: 300 }],
  },
},
defaultPreset: 'default',
```

## Docker

If you want use Sharp with Docker, this code can halp. Paste it to Dockefile:
```
FROM node:8-alpine

RUN apk add vips-dev fftw-dev --update-cache --repository https://dl-3.alpinelinux.org/alpine/edge/testing/ && \
    apk update && \
    apk upgrade --update-cache --available && \
    apk add ca-certificates \
        xpdf \
        vips \
        vips-dev \
        python2 \
        git \
        make \
        g++

RUN rm -rf /var/cache/apk/*
```

## Issues

If you find a bug, please file an issue on our issue tracker on [GitHub](https://github.com/monopix/react-sharp-loader/issues).


## License

MIT
