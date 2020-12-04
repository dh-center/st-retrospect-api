module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'codex',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-magic-numbers': 'off',

    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: [
          'camelCase',
          'PascalCase',
          'UPPER_CASE',
        ],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
      {
        selector: 'typeLike',
        format: [
          'PascalCase',
        ],
      },
      {
        selector: 'typeParameter',
        format: [
          'StrictPascalCase',
        ],
      },
      {
        selector: 'enumMember',
        format: [ 'PascalCase' ],
      },
      {
        selector: 'objectLiteralProperty',
        format: null,
        filter: '__typename',
      },
    ],
  },
};
