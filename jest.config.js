/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": ["ts-jest", {
      useESM: true,
      tsconfig: "tsconfig.json"
    }],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testMatch: [
    "**/__tests__/**/*.test.ts"
  ],
  // testPathIgnorePatterns: [
  //   "/node_modules/",
  //   "/dist/",
  //   "/__tests__/mocks/"
  // ]
};