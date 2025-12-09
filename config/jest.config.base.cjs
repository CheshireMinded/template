/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["text", "lcov", "html"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/build/",
    "/tests/"
  ],
  coverageThreshold: {
    // Global minimums: solid but not brutal
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80
    },
    // Core business logic: keep this VERY well tested (>=90%)
    "./src/controllers/": {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90
    },
    "./src/routes/": {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90
    },
    // Middleware should also be strong, but slightly more forgiving
    "./src/middleware/": {
      branches: 75,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  testMatch: ["**/*.test.ts", "**/*.test.tsx", "**/*.test.js"]
};

