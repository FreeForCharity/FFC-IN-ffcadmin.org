const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/__tests__/**/*.test.js', '**/__tests__/**/*.test.ts'],
  collectCoverageFrom: ['app/**/*.{js,jsx,ts,tsx}', '!app/**/*.d.ts', '!**/node_modules/**'],
  // Coverage thresholds set to 0% because this project uses build-output validation tests
  // rather than component unit tests. This is intentional for a static site generator.
  // Tests validate the generated output structure rather than component behavior.
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
