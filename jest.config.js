module.exports = {
  preset: 'ts-jest',
  testEnvironment: "node",
  verbose: true,
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
      diagnostics: true,
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  testRegex: ".test.ts$",
  collectCoverage: false,
  collectCoverageFrom: [
    "**/src/**/*.ts",
    "!**/*.{test.ts,d.ts,js}"
  ],

  coverageDirectory: "./coverage",
  globalSetup: "<rootDir>/test/GlobalSetup.ts",
  globalTeardown: "<rootDir>/test/GlobalTeardown.ts",
  maxConcurrency: 1,

  setupFilesAfterEnv: [
    "<rootDir>/test/DBConnect.ts"
  ]
};
