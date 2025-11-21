import nextPlugin from 'eslint-config-next'
import prettierConfig from 'eslint-config-prettier'

const eslintConfig = [
  // eslint-config-next may export as array or object depending on version
  ...(Array.isArray(nextPlugin) ? nextPlugin : [nextPlugin]),
  prettierConfig,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
    },
  },
]

export default eslintConfig
