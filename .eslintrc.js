module.exports =  {
  parser:  '@typescript-eslint/parser',
  extends:  [
    'plugin:@typescript-eslint/recommended',
    'codex'
  ],
  parserOptions:  {
    ecmaVersion:  2018,
    sourceType:  'module',
  }
};
