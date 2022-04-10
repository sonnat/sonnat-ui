const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./"
});

const jestConfig = {
  verbose: true,
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  testRegex: ".*\\.test\\.tsx?$",
  testEnvironment: "jest-environment-jsdom"
};

module.exports = createJestConfig(jestConfig);
