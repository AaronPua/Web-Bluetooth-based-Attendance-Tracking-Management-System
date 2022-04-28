// jest.config.ts
import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  automock: true,
  globals: {
    diagnostics: {
        warnOnly: true
    },
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },
  modulePaths: [
      '<rootDir>/node_modules/', 
      '<rootDir>/node_modules/meteor-jest-stubs/lib/'
  ],
  moduleNameMapper: {
    '^(.*):(.*)$': '$1_$2',
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/meteor-jest-stubs",
  ],
  unmockedModulePathPatterns: [
    '/^imports\\/.*\\.tsx?$/',
    '/^node_modules/',
  ],
}
export default config;