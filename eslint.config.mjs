import nextPlugin from 'eslint-config-next'
import prettierConfig from 'eslint-config-prettier'

const eslintConfig = [
  ...(Array.isArray(nextPlugin) ? nextPlugin : [nextPlugin]),
  prettierConfig,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
    },
  },
]

export default eslintConfig
