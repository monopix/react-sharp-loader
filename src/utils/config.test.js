/* eslint-disable prettier/prettier */
const {
  defaultConfig,
  individualConfig,
  summaryConfig,
} = require('./config')

describe('individualConfig', () => {
  it('[{ width: [150, 300] }] -> [{ width: 150 }, { width: 300 }]', () => {
    const result =   [{ a: [2, 3], b: [4, 5], c: 1 }]
    const expected = [
      { a: 2, b: 4, c: 1 },
      { a: 2, b: 5, c: 1 },
      { a: 3, b: 4, c: 1 },
      { a: 3, b: 5, c: 1 },
    ]
    expect(individualConfig(result)).toEqual(expected)
  })

  it('with orginal file name', () => {
    const result =   [{ a: 2 }]
    const expected = [
      { a: 2, orginalName: 'foo', orginalExt: 'png' },
    ]
    expect(individualConfig(result, 'foo.png')).toEqual(expected)
  })

  it('{ "*.jpg": { width: 300 }} -> [{ name: "*.jpg", width: 300 }]', () => {
    const result =   { '*.jpg': { width: 300 }}
    const expected = [{ name: '*.jpg', width: 300 }]
    expect(individualConfig(result)).toEqual(expected)
  })

  it('{ "*.jpg": [{ width: 300 }]} -> [{ name: "*.jpg", width: 300 }]', () => {
    const result =   { '*.jpg': [{ width: 300, foo: 2 }, { width: 450 }]}
    const expected = [{ name: '*.jpg', width: 300, foo: 2 },{ name: '*.jpg', width: 450 }]
    expect(individualConfig(result)).toEqual(expected)
  })

  it('[{ width: 300, height: (info, obj) => obj.width * 2}] -> [{ width: 300, height: 600 }]', () => {
    const result =   [{ width: 300, height: (info, obj) => obj.width * 2}]
    const expected = [{ width: 300, height: 600 }]
    expect(individualConfig(result)).toEqual(expected)
  })
})

describe('summaryConfig', () => {
  it('shoud return empty array', () => {
    const result = summaryConfig()
    expect(result).toEqual([])
  })

  it('shoud return with defaults and common', () => {
    const result = summaryConfig([{ width: [100, 250] }], { flip: true })
    expect(result).toEqual([
      { ...defaultConfig, width: 100, flip: true },
      { ...defaultConfig, width: 250, flip: true },
    ])
  })
})
