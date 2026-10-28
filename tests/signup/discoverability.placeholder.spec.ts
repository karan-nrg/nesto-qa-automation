import { test, expect } from '../../fixtures/test';

/**
 * TEMPORARY discoverability placeholder for Milestone 1.
 * Agent 2 MUST replace this with the real signup suite.
 *
 * ACCOUNT CAP: this file MUST NOT submit the form or create QA accounts.
 * It only verifies fixtures + projects resolve so `playwright test --list` works.
 */
test.describe('signup foundation (placeholder)', () => {
  test('exposes locale and SignupPage from project', async ({
    appLocale,
    signupPage,
  }) => {
    expect(appLocale === 'en' || appLocale === 'fr').toBe(true);
    expect(signupPage.locale).toBe(appLocale);
    expect(signupPage.submitButton).toBeTruthy();
  });
});
