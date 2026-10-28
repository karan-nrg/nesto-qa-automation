import { defineConfig, devices } from '@playwright/test';
import { BASE_URL, LOCALE_CONFIG } from './config/locales';

/**
 * Assessment projects: Chromium EN + FR only.
 * Firefox / WebKit can be added later as extra projects — not required now.
 *
 * Language is selected by application URL (signupPath), not Accept-Language alone.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: LOCALE_CONFIG.en.projectName,
      use: {
        ...devices['Desktop Chrome'],
        locale: LOCALE_CONFIG.en.browserLocale,
        // URL path is source of truth; baseURL + /signup
      },
    },
    {
      name: LOCALE_CONFIG.fr.projectName,
      use: {
        ...devices['Desktop Chrome'],
        locale: LOCALE_CONFIG.fr.browserLocale,
        // URL path is source of truth; baseURL + /fr/signup
      },
    },
  ],
});
