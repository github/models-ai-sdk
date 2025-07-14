import githubRecommended from 'eslint-plugin-github/lib/configs/flat/recommended.js'
import githubTypescript from 'eslint-plugin-github/lib/configs/flat/typescript.js'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default [
  {
    ignores: ['dist/**', 'examples/**'],
  },
  githubRecommended,
  ...githubTypescript,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/newline-after-import': 'error',
      'sort-imports': 'off',
    },
  },
  {
    files: ['eslint.config.js'],
    rules: {
      'import/extensions': 'off',
    },
  },
]
