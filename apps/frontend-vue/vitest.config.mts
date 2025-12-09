import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["tests/**/*.test.ts"],
    setupFiles: "./vitest.setup.ts",
    coverage: {
      reporter: ["text", "lcov", "html"],
      reportsDirectory: "./coverage",
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
      exclude: ["vite.config.mts", "vitest.setup.ts"]
    }
  }
});

