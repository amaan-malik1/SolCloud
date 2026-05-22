/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  testTimeout: 120000,
  forceExit: true,
  verbose: true,
  globals: {
    'ts-jest': {
      tsconfig: {
        module: 'commonjs'
      }
    }
  }
}
