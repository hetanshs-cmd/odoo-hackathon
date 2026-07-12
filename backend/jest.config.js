/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  // Use the new transform syntax (ts-jest v29+) — avoids the globals deprecation warning
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
      },
    ],
  },
  // Map path aliases defined in tsconfig
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Show verbose output so each test case is visible
  verbose: true,
  // Collect coverage only from src — not tests or dist
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      lines: 60,
    },
  },
};

module.exports = config;
