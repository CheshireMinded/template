import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./",
  timeout: 30_000,
  use: {
    baseURL: process.env.PW_BASE_URL || "http://localhost:5173",
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" }
    }
  ]
});

