import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60 * 1000,
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
  use: {
    baseURL: "http://localhost:3000",
    navigationTimeout: 60 * 1000,
    launchOptions: {
      args: ["--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage"],
    },
  },
});