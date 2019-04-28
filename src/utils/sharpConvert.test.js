const fs = require('fs')
const { convert } = require('./sharpConvert')
const { summaryConfig } = require('./config')

// const readStream = fs.createReadStream(`${process.env.PWD}/src/test/image.jpg`)
// const writeStream = fs.createWriteStream(`${process.env.PWD}/src/test/resultStream.jpg`)
const image = fs.readFileSync(`${process.env.PWD}/src/test/image.jpg`)
const imageResult = fs.readFileSync(`${process.env.PWD}/src/test/result.jpg`)
const imageResultBase64 = fs.readFileSync(
  `${process.env.PWD}/src/test/resultBase64.txt`,
  'utf8'
)

it('should resize', async () => {
  const config = summaryConfig({ '*.jpg': { width: 200 } })
  const result = await convert(image, config[0])
  expect(Buffer.compare(result.buffer, imageResult)).toBe(0)
})

// it('should resize in stream', async () => {
//   const config = summaryConfig({ '*.jpg': { width: 200, format: 'jpeg' } })
//   await readStream.pipe(transform(config[0])).pipe(writeStream)
//   const resultFile = fs.readFileSync(
//     `${process.env.PWD}/src/test/resultStream.jpg`
//   )
//   expect(Buffer.compare(resultFile, imageResult)).toBe(0)
// })

it('should convert to base64', async () => {
  const config = summaryConfig({
    '*.jpg': {
      width: 200,
      base64: true,
    },
  })
  const result = await convert(image, config[0])
  expect(result.buffer).toBe(imageResultBase64)
})

it('should return error on resize', async () => {
  const config = summaryConfig({ '*.jpg': { width: 201 } })
  const result = await convert(image, config[0])
  expect(Buffer.compare(result.buffer, imageResult)).toBe(1)
})

it('should return error on enlargment', async () => {
  const config = summaryConfig({ '*.jpg': { width: 601 } })

  await expect(convert(image, config[0])).rejects.toEqual(
    'File undefined :  Image enlargement is detected\n  real width: 600px, required width: 601px'
  )
})

it('should return error on empty config', async () => {
  await expect(convert(image, null)).rejects.toEqual(Error('Empty config'))
})
