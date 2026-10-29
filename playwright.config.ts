import { defineConfig, devices } from '@playwright/test';
import { BASE_URL, LOCALE_CONFIG, type AppLocale } from '@/config/locales';

/**
 * Two Chromium projects: English and French.
 * Each project sets appLocale so tests know which language to use without
 * parsing the project name. The signup URL picks the app language; Playwright's
 * locale option only sets the browser language preference.
 */
export default defineConfig<{ appLocale: AppLocale }>({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
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
        appLocale: 'en',
      },
    },
    {
      name: LOCALE_CONFIG.fr.projectName,
      use: {
        ...devices['Desktop Chrome'],
        locale: LOCALE_CONFIG.fr.browserLocale,
        appLocale: 'fr',
      },
    },
  ],
});
