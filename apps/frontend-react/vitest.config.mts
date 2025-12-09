import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/**/*.test.tsx", "tests/**/*.test.ts"],
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

