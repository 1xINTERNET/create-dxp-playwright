import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './{{testDir}}',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process?.env?.IS_QCK ? process?.env?.QCK_TESTER_BASE_URL : process?.env?.SITE_URL ? process.env.SITE_URL : (
      (process?.env?.DDEV_HOSTNAME ? `https://${process.env?.DDEV_HOSTNAME}` : `http://127.0.0.1:3000`)
    ),
    ignoreHTTPSErrors: process?.env?.DDEV_HOSTNAME ? true : undefined,
    httpCredentials: (Boolean(process.env.BASIC_AUTH_USER) && Boolean(process.env.BASIC_AUTH_PASS)) ? {
      username: String(process.env.BASIC_AUTH_USER),
      password: String(process.env.BASIC_AUTH_PASS),
    } : undefined,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // @todo: this should be configurable as this obviously creates plenty of artifacts.
    trace: process.env?.PLAYWRIGHT_USE_TRACE ? process.env.PW_TRACE : 'on-first-retry',
    screenshot: process.env?.PLAYWRIGHT_USE_SCREENSHOT ? process.env?.PLAYWRIGHT_USE_SCREENSHOT : (process.env.CI ? 'on' : undefined),
    video: process.env?.PLAYWRIGHT_USE_VIDEO ? process.env?.PLAYWRIGHT_USE_VIDEO : (process.env.CI ? 'on' : undefined),
  },

  /* Configure projects for major browsers */
  projects: [
    //--begin-chromium
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    //--end-chromium
  ],
});
