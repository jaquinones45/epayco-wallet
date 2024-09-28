/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['text', 'html', 'lcov'],
  roots: ['<rootDir>/tests/'],
  testEnvironment: 'node',
  coverageDirectory: '<rootDir>/coverage',
};