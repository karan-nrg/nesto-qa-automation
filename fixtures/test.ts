import { test as base } from '@playwright/test';
import type { AppLocale } from '@/config/locales';
import { SignupPage } from '@/pages/signup/SignupPage';

type SignupFixtures = {
  /** Which language this Playwright project is running (en or fr). */
  appLocale: AppLocale;
  /** Fresh signup page object for this test. */
  signupPage: SignupPage;
};

/**
 * Playwright test plus signup fixtures. Build a fresh email inside each
submitting test so retries don't collide.
 */
export const test = base.extend<SignupFixtures>({
  appLocale: ['en', { option: true }],

  signupPage: async ({ page, appLocale }, use) => {
    await use(new SignupPage(page, appLocale));
  },
});

export { expect } from '@playwright/test';
