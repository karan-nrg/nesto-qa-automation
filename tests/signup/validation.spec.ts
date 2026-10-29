import type { Request } from '@playwright/test';
import { test, expect } from '@/fixtures/test';
import { BASE_URL, LOCALE_CONFIG } from '@/config/locales';
import { SignupPage } from '@/pages/signup/SignupPage';
import {
  type CreateAccountResponseBody,
  isCreateAccountUrl,
  waitForAccountCreationResponse,
} from '@/support/signup/accountResponse';
import { buildValidSignupData } from '@/support/signup/signupData';
import { signupCopyFor } from '@/support/signup/signupCopy';

test.describe('Signup validation', () => {
  test.describe('Field validation', () => {
    test.beforeEach(async ({ signupPage }) => {
      await signupPage.goto();
    });

    test('shows errors when required fields are empty', async ({
      signupPage,
    }) => {
      await signupPage.submit();

      // Province is pre-selected by geolocation, so it has no required error.
      // Confirm password stays quiet until the password field itself is valid.
      const fields = [
        {
          input: signupPage.firstNameInput,
          error: signupPage.firstNameError,
        },
        {
          input: signupPage.lastNameInput,
          error: signupPage.lastNameError,
        },
        { input: signupPage.phoneInput, error: signupPage.phoneError },
        { input: signupPage.emailInput, error: signupPage.emailError },
        {
          input: signupPage.passwordInput,
          error: signupPage.passwordError,
        },
      ];

      for (const { input, error } of fields) {
        await expect(error).toBeVisible();
        await expect(input).toHaveAttribute('aria-invalid', 'true');
      }
    });

    test('shows an error for an invalid email', async ({
      appLocale,
      page,
      signupPage,
    }) => {
      const copy = signupCopyFor(appLocale);
      const data = buildValidSignupData({ email: 'not-an-email' });

      await signupPage.fillSignupForm(data);

      // Client-side email validation should block POST /api/accounts.
      const accountCreationRequests: Request[] = [];
      page.on('request', (request) => {
        if (request.method() === 'POST' && isCreateAccountUrl(request.url())) {
          accountCreationRequests.push(request);
        }
      });

      await signupPage.submit();

      await expect(signupPage.emailError).toHaveText(copy.errors.invalidEmail);
      expect(accountCreationRequests).toHaveLength(0);
    });

    test('shows an error for an invalid phone number', async ({
      signupPage,
    }) => {
      const data = buildValidSignupData({ phoneNumber: '12' });

      await signupPage.fillSignupForm(data);
      await signupPage.submit();

      await expect(signupPage.phoneError).toBeVisible();
      await expect(signupPage.phoneInput).toHaveAttribute(
        'aria-invalid',
        'true',
      );
    });

    test('rejects a password that is too short', async ({
      appLocale,
      signupPage,
    }) => {
      const copy = signupCopyFor(appLocale);
      const data = buildValidSignupData({ password: 'Ab1!' });

      await signupPage.fillSignupForm(data);
      await signupPage.submit();

      await expect(signupPage.passwordError).toHaveText(
        copy.errors.minCharactersRequired(12),
      );
    });

    test('rejects a password without uppercase letters or numbers', async ({
      appLocale,
      signupPage,
    }) => {
      const copy = signupCopyFor(appLocale);
      const data = buildValidSignupData({ password: 'alllowercaseonly' });

      await signupPage.fillSignupForm(data);
      await signupPage.submit();

      await expect(signupPage.passwordError).toHaveText(
        copy.errors.weakPassword,
      );
    });

    test('shows an error when passwords do not match', async ({
      appLocale,
      signupPage,
    }) => {
      const copy = signupCopyFor(appLocale);
      const data = buildValidSignupData({
        password: 'NestoQaPass12!',
        passwordConfirmation: 'NestoQaPass99!',
      });

      await signupPage.fillSignupForm(data);
      await signupPage.submit();

      await expect(signupPage.passwordConfirmationError).toHaveText(
        copy.errors.passwordMismatch,
      );
    });
  });

  test('rejects registration with an existing email', async ({
    appLocale,
    browser,
    signupPage,
    page,
  }) => {
    const data = buildValidSignupData();

    await test.step('Create an account', async () => {
      await signupPage.goto();
      await signupPage.fillSignupForm(data);

      const responsePromise = waitForAccountCreationResponse(page, data.email);
      await signupPage.submit();
      const response = await responsePromise;

      expect(response.status()).toBe(201);
      const body = (await response.json()) as CreateAccountResponseBody;
      expect(body.account?.email).toBe(data.email);
    });

    await test.step('Reject registration with the same email', async () => {
      const context = await browser.newContext({
        baseURL: BASE_URL,
        locale: LOCALE_CONFIG[appLocale].browserLocale,
      });

      try {
        const duplicatePage = await context.newPage();
        const duplicateSignup = new SignupPage(duplicatePage, appLocale);

        await duplicateSignup.goto();
        await duplicateSignup.fillSignupForm(data);

        const responsePromise = waitForAccountCreationResponse(
          duplicatePage,
          data.email,
        );
        await duplicateSignup.submit();
        const response = await responsePromise;

        expect(response.status()).toBe(400);
        const body = (await response.json()) as CreateAccountResponseBody;
        expect(body).toMatchObject({
          error: 'bad format',
          description: 'error creating account',
        });
        expect(body.account).toBeUndefined();
        await expect(duplicateSignup.genericError).toBeVisible();
      } finally {
        await context.close();
      }
    });
  });
});
