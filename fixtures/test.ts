import { test as base } from '@playwright/test';
import { localeFromProjectName, type AppLocale } from '../config/locales';
import { SignupPage } from '../pages/signup/SignupPage';

/**
 * Typed fixtures for the signup suite.
 *
 * ACCOUNT CAP (see ASSUMPTIONS.md):
 * - Only two live account creates are allowed for the whole suite:
 *   one EN success + one FR success.
 * - Duplicate-email coverage MUST reuse one of those emails (prefer EN)
 *   via create-then-retry / shared setup — never a third independent create.
 * - Client-side validation negatives MUST NOT trigger POST /api/accounts.
 */
type SignupFixtures = {
  appLocale: AppLocale;
  signupPage: SignupPage;
};

export const test = base.extend<SignupFixtures>({
  appLocale: async ({ page: _page }, use, testInfo) => {
    const locale = localeFromProjectName(testInfo.project.name);
    await use(locale);
  },

  signupPage: async ({ page, appLocale }, use) => {
    await use(new SignupPage(page, appLocale));
  },
});

export { expect } from '@playwright/test';
