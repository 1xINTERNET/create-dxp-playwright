import {defineConfig, devices, TraceMode, ScreenshotMode, VideoMode} from '@playwright/test';
import * as dotenv from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config();

/* Qaack sets IS_QCK instead of CI, so treat it as CI too. */
const isCI = Boolean(process.env.CI || process.env.IS_QCK);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './{{testDir}}',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: isCI ? 1 : undefined,
  /* Timeout per test. Higher on CI to account for slower/shared runners. */
  timeout: isCI ? 60_000 : 30_000,
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
    /* Use env to steer test artifacts */
    trace: process.env?.PLAYWRIGHT_USE_TRACE ? String(process.env.PLAYWRIGHT_USE_TRACE) as TraceMode : 'on-first-retry',
    screenshot: process.env?.PLAYWRIGHT_USE_SCREENSHOT ? String(process.env?.PLAYWRIGHT_USE_SCREENSHOT) as ScreenshotMode : (isCI ? 'on' : undefined),
    video: process.env?.PLAYWRIGHT_USE_VIDEO ? String(process.env?.PLAYWRIGHT_USE_VIDEO) as VideoMode : (isCI ? 'on' : undefined),
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
