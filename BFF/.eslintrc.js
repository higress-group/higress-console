const { getESLintConfig } = require('@iceworks/spec');

module.exports = getESLintConfig('react-ts', {
  root: true,
  parserOptions: {
    project: ['tsconfig.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  rules: {
    "@typescript-eslint/indent": ["error", 2],
    'no-param-reassign': 0,
    'prefer-const': 0,
    'no-mixed-operators': 0,
    'arrow-parens': 0,
    'react/jsx-filename-extension': 0,
    'react-hooks/exhaustive-deps': 0,
    'react/jsx-no-target-blank': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-require-imports': 0,
    '@typescript-eslint/quotes': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/semi': 0,
  },
});
