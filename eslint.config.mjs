import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettierConfig from 'eslint-config-prettier'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierConfig,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'e2e/**',
    '*.config.js',
    '*.config.cjs',
    '*.config.mjs',
    '*.config.ts',
    'jest.setup.js',
  ]),
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      // Internal navigation must use next/link so links respect basePath
      // (e.g. NEXT_PUBLIC_BASE_PATH). Bare <a href="/..."> breaks under a
      // configured basePath. External, mailto/tel/sms, and #anchor links are
      // unaffected because their href does not start with "/". (#268)
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'JSXOpeningElement[name.name="a"]:has(JSXAttribute[name.name="href"] Literal[value=/^\\//])',
          message:
            'Use <Link> from next/link for internal links (href starting with "/") so they respect basePath. Bare <a href="/..."> breaks under a configured basePath.',
        },
      ],
    },
  },
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
])
