import { defineConfig, devices } from "@playwright/test";

const host = "127.0.0.1";
const port = Number(process.env.PLAYWRIGHT_PORT ?? 3100);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://${host}:${port}`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      testIgnore: /api\.spec\.ts/,
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: `pnpm exec prisma migrate deploy && pnpm exec next start -H ${host} -p ${port}`,
    port,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
