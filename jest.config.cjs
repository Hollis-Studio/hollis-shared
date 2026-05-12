/**
 * @ai-context Jest configuration for shared contracts tests
 *
 * This configuration is used to run the contract compilation and validation tests.
 * Run: npm run test:contracts (from root)
 */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  rootDir: '.',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@hollis/contracts$': '<rootDir>/index.ts',
    '^@hollis/contracts/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          // Inline tsconfig for jest - compatible with our module structure
          target: 'ES2022',
          module: 'ESNext',
          lib: ['ES2022'],
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
          declaration: false,
          moduleResolution: 'node',
        },
      },
    ],
  },
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/__tests__/**',
    '!jest.config.js',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
};
