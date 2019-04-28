// ESLint configuration
// http://eslint.org/docs/user-guide/configuring
module.exports = {
  parser: 'babel-eslint',

  parserOptions: {
    ecmaFeatures: {
      generators: true,
      experimentalObjectRestSpread: true,
    },
    sourceType: 'module',
    allowImportExportEverywhere: false,
  },

  settings: {
    // Allow absolute paths in imports, e.g. import Button from 'components/Button'
    // https://github.com/benmosher/eslint-plugin-import/tree/master/resolvers
    'import/resolver': {
      node: {
        extensions: [
          '.js',
          '.jsx',
          '.json',
        ],
        moduleDirectory: [
          'src/app',
          'src/server',
          'src/assets',
          'src/utils',
          'node_modules',
          'modules',
          'static',
          '.storybook/helpers',
        ],
      },
    },
    flowtype: {
      onlyFilesWithFlowAnnotation: true,
    },
  },

  extends: [
    'airbnb',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:flowtype/recommended',
    'prettier',
    'prettier/react',
    'prettier/flowtype',
    'plugin:testcafe/recommended',
  ],

  plugins: [
    'flowtype',
    'prettier',
    'testcafe',
    'emotion',
    'react-hooks',
  ],

  env: {
    es6: true,
    browser: true,
    node: true,
    commonjs: true,
    jest: true,
    // mongo: true,
  },

  globals: {
    // window: true,
    // document: true,
    // __dirname: true,
    _DEV_: true,
    _PROD_: true,
    _SSR_: true,
    _ANALYZE_: true,
    _DEBUG_: true,
    _STORYBOOK_: true,
    _TEST_: true,
    // process: true,
    // describe: true,
    // test: true,
    // beforeEach: true,
    // fetch: true,
    // alert: true,
    // expect: true,
    // it: true,
    // jest: true,
    shallow: true,
    render: true,
    mount: true,
    sinon: true,
    configure: true,
    renderer: true,
  },

  rules: {
    // Forbid the use of extraneous packages
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
    'import/no-extraneous-dependencies': ['error', { packageDir: '' }],

    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-as-default-member.md
    'import/no-named-as-default': 0,

    // Recommend not to leave any console.log in your code
    // Use console.error, console.warn and console.info instead
    // https://eslint.org/docs/rules/no-console
    'no-console': [
      'error',
      {
        allow: ['warn', 'error', 'info'],
      },
    ],

    // css`...`
    // https://eslint.org/docs/rules/no-unused-expressions
    'no-unused-expressions': [
      "error",
      { "allowTaggedTemplates": true }
    ],

    // https://eslint.org/docs/rules/no-plusplus#allowforloopafterthoughts
    'no-plusplus': 0, // ['error', { allowForLoopAfterthoughts: true }],

    // semicolon
    semi: ['error', 'never'],

    // https://eslint.org/docs/rules/no-underscore-dangle
    'no-underscore-dangle': 0, // ["error",  { "allow": true }],

    'prefer-template': 0,

    // Prefer destructuring from arrays and objects
    // http://eslint.org/docs/rules/prefer-destructuring
    'prefer-destructuring': [
      'warn',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],

    // Emotion
    'emotion/jsx-import': 'error',
    // 'emotion/no-vanilla': 'error',
    'emotion/import-from-emotion': 'error',
    'emotion/styled-import': 'error',

    // React hooks
    'react-hooks/rules-of-hooks': 'error',

    // Ensure <a> tags are valid
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],

    // Allow .js files to use JSX syntax
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],

    // Functional and class components are equivalent from React’s point of view
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
    'react/prefer-stateless-function': 'off',

    'react/jsx-no-bind': [
      'warn',
      {
        ignoreRefs: true,
        allowArrowFunctions: true,
        allowFunctions: false,
        allowBind: false
      },
    ],

    // ESLint plugin for prettier formatting
    // https://github.com/prettier/eslint-plugin-prettier
    'prettier/prettier': [
      'warn',
      {
        // https://prettier.io/docs/en/options.html
        singleQuote: true,
        trailingComma: 'es5',
        semi: false,
        printWidth: 80,
      },
    ],

    // https://github.com/atfzl/eslint-plugin-css-modules
    /* "css-modules/no-undef-class": [
      'warn',
      {
        camelCase: true,
      }
    ],

    "css-modules/no-unused-class": [
      'warn',
      {
        markAsUsed: ['container'],
      }
    ], */

    // Flow itself recognizes what is required and what is not
    'react/default-props-match-prop-types': [
      'error',
      {
        'allowRequiredDefaults': true,
      },
    ],
  },
}
