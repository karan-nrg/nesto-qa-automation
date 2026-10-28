import { test, expect } from '../../fixtures/test';
import { signupCopyFor } from '../../support/signup/signupCopy';

/**
 * Locale-aware field chrome — no form submit, no account creates.
 */
test.describe('signup fields', () => {
  test('exposes expected labels, placeholders, consent, and terms', async ({
    appLocale,
    signupPage,
    page,
  }) => {
    const copy = signupCopyFor(appLocale);

    await test.step('open signup for locale', async () => {
      await signupPage.goto();
      await expect(page).toHaveURL(
        new RegExp(signupPage.locale === 'fr' ? '/fr/signup' : '/signup'),
      );
    });

    await test.step('page title matches locale', async () => {
      // Live page uses an h2 title, not h1.
      await expect(page.getByRole('heading', { level: 2 })).toContainText(
        copy.titleContains,
      );
    });

    await test.step('input placeholders match locale copy', async () => {
      await expect(signupPage.firstNameInput).toHaveAttribute(
        'placeholder',
        copy.placeholders.firstName,
      );
      await expect(signupPage.lastNameInput).toHaveAttribute(
        'placeholder',
        copy.placeholders.lastName,
      );
      await expect(signupPage.emailInput).toHaveAttribute(
        'placeholder',
        copy.placeholders.email,
      );
      await expect(signupPage.phoneInput).toHaveAttribute(
        'placeholder',
        copy.placeholders.phone,
      );
      await expect(signupPage.passwordInput).toHaveAttribute(
        'placeholder',
        copy.placeholders.password,
      );
      await expect(signupPage.passwordConfirmationInput).toHaveAttribute(
        'placeholder',
        copy.placeholders.passwordConfirmation,
      );
      await expect(
        signupPage.regionSelect.locator('option').first(),
      ).toHaveText(copy.placeholders.region);
    });

    await test.step('password helper, consent, submit, and terms', async () => {
      await expect(page.getByText(copy.passwordHelper)).toBeVisible();
      await expect(page.getByText(copy.consent)).toBeVisible();
      await expect(signupPage.submitButton).toHaveText(copy.submit);
      await expect(page.getByText(copy.submitHelperContains)).toBeVisible();
    });
  });
});
