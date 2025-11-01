module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  projects: [
    '<rootDir>/packages/core',
    '<rootDir>/packages/identitypass',
    '<rootDir>/packages/dashboard',
    '<rootDir>/packages/nest'
  ],
  collectCoverageFrom: [
    'packages/*/src/**/*.ts',
    '!packages/**/dist/**',
    '!packages/**/*.d.ts',
    '!packages/**/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
};
