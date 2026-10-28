import { test, expect } from '../../fixtures/test';
import {
  assertDuplicateAccountError,
  trackAccountsPosts,
  waitForAccountCreate,
} from '../../support/signup/accountResponse';
import { readLastCreatedAccount } from '../../support/signup/lastCreatedAccount';
import { buildValidSignupData } from '../../support/signup/signupData';
import { signupCopyFor } from '../../support/signup/signupCopy';

/**
 * Client-side negatives must NOT POST /api/accounts.
 * Duplicate email is EN-only and reuses the EN success email from
 * lastCreatedAccount.json (0 new creates) — see ASSUMPTIONS.md / BUGS.md.
 */
test.describe('signup validation', () => {
  test('empty required fields show errors and do not POST', async ({
    appLocale,
    signupPage,
    page,
  }) => {
    const copy = signupCopyFor(appLocale);
    const posts = trackAccountsPosts(page);

    await test.step('open and submit empty form', async () => {
      await signupPage.goto();
      await page.waitForLoadState('networkidle');
      // Touch a field so client validators are definitely mounted before submit.
      await signupPage.firstNameInput.click();
      await signupPage.submit();
    });

    await test.step('required errors visible; no accounts POST', async () => {
      await expect(signupPage.firstNameInput).toHaveAttribute(
        'aria-invalid',
        'true',
      );
      await expect(page.getByText(copy.errors.required).first()).toBeVisible();
      expect(posts.wasPosted(), 'empty submit must not POST /api/accounts').toBe(
        false,
      );
    });
  });

  test('invalid email shows error and does not POST', async ({
    appLocale,
    signupPage,
    page,
  }, testInfo) => {
    const copy = signupCopyFor(appLocale);
    const data = buildValidSignupData(
      appLocale,
      { email: 'not-an-email' },
      { workerIndex: testInfo.workerIndex },
    );
    const posts = trackAccountsPosts(page);

    await test.step('fill invalid email and submit', async () => {
      await signupPage.goto();
      await signupPage.fillValidSignup(data);
      await signupPage.submit();
    });

    await test.step('invalid email error; no accounts POST', async () => {
      await expect(page.getByText(copy.errors.invalidEmail)).toBeVisible();
      expect(
        posts.wasPosted(),
        'invalid email must not POST /api/accounts',
      ).toBe(false);
    });
  });

  test('invalid phone shows error and does not POST', async ({
    appLocale,
    signupPage,
    page,
  }, testInfo) => {
    const data = buildValidSignupData(
      appLocale,
      { phoneNational: '12', phoneE164: '+112' },
      { workerIndex: testInfo.workerIndex },
    );
    const posts = trackAccountsPosts(page);

    await test.step('fill invalid phone and submit', async () => {
      await signupPage.goto();
      await signupPage.fillValidSignup(data);
      await signupPage.submit();
    });

    await test.step('phone validation blocks submit; no accounts POST', async () => {
      // Phone widget / form should block API; assert no POST + stay on signup.
      await expect(page).toHaveURL(/signup/);
      await expect(signupPage.phoneInput).toHaveAttribute(
        'aria-invalid',
        'true',
      );
      expect(
        posts.wasPosted(),
        'invalid phone must not POST /api/accounts',
      ).toBe(false);
    });
  });

  test('short password shows min-length error and does not POST', async ({
    appLocale,
    signupPage,
    page,
  }, testInfo) => {
    const copy = signupCopyFor(appLocale);
    const shortPassword = 'Ab1!';
    const data = buildValidSignupData(
      appLocale,
      {
        password: shortPassword,
        passwordConfirmation: shortPassword,
      },
      { workerIndex: testInfo.workerIndex },
    );
    const posts = trackAccountsPosts(page);

    await test.step('fill short password and submit', async () => {
      await signupPage.goto();
      await signupPage.fillValidSignup(data);
      await signupPage.submit();
    });

    await test.step('min length error; no accounts POST', async () => {
      await expect(
        page.getByText(copy.errors.minCharactersRequired(12)),
      ).toBeVisible();
      expect(
        posts.wasPosted(),
        'short password must not POST /api/accounts',
      ).toBe(false);
    });
  });

  test('weak password shows complexity error and does not POST', async ({
    appLocale,
    signupPage,
    page,
  }, testInfo) => {
    const copy = signupCopyFor(appLocale);
    // Long enough but missing uppercase / number complexity rules.
    const weakPassword = 'alllowercaseonly';
    const data = buildValidSignupData(
      appLocale,
      {
        password: weakPassword,
        passwordConfirmation: weakPassword,
      },
      { workerIndex: testInfo.workerIndex },
    );
    const posts = trackAccountsPosts(page);

    await test.step('fill weak password and submit', async () => {
      await signupPage.goto();
      await signupPage.fillValidSignup(data);
      await signupPage.submit();
    });

    await test.step('weak password error; no accounts POST', async () => {
      await expect(
        page.getByText(copy.errors.weakPassword, { exact: true }),
      ).toBeVisible();
      expect(
        posts.wasPosted(),
        'weak password must not POST /api/accounts',
      ).toBe(false);
    });
  });

  test('password mismatch shows error and does not POST', async ({
    appLocale,
    signupPage,
    page,
  }, testInfo) => {
    const copy = signupCopyFor(appLocale);
    const data = buildValidSignupData(
      appLocale,
      {
        password: 'NestoQaPass12!',
        passwordConfirmation: 'NestoQaPass99!',
      },
      { workerIndex: testInfo.workerIndex },
    );
    const posts = trackAccountsPosts(page);

    await test.step('fill mismatched passwords and submit', async () => {
      await signupPage.goto();
      await signupPage.fillValidSignup(data);
      await signupPage.submit();
    });

    await test.step('mismatch error; no accounts POST', async () => {
      await expect(page.getByText(copy.errors.passwordMismatch)).toBeVisible();
      expect(
        posts.wasPosted(),
        'password mismatch must not POST /api/accounts',
      ).toBe(false);
    });
  });

  /**
   * EN-only. Reuses email written by chromium-en success in signup.spec.ts.
   * Does POST (expect observed 400) but must NOT create a new account (no 201).
   * "bad format" is a likely product defect — see BUGS.md; do not invent 409.
   */
  test('duplicate email returns observed 400 and generic UI error', async ({
    appLocale,
    signupPage,
    page,
  }, testInfo) => {
    test.skip(
      appLocale !== 'en',
      'Duplicate coverage is EN-only so FR does not burn another create slot',
    );

    const stored = readLastCreatedAccount();
    test.skip(
      !stored?.email,
      'Run chromium-en signup success first to write support/signup/lastCreatedAccount.json',
    );

    const copy = signupCopyFor(appLocale);
    const data = buildValidSignupData(
      appLocale,
      { email: stored!.email },
      { workerIndex: testInfo.workerIndex },
    );

    await test.step('open signup and resubmit known EN email', async () => {
      await signupPage.goto();
      const responsePromise = waitForAccountCreate(page, data.email);
      await signupPage.fillValidSignup(data);
      await signupPage.submit();
      const response = await responsePromise;

      // Observed contract: 400 + misleading "bad format" (not 409).
      await assertDuplicateAccountError(response);
    });

    await test.step('generic UI error shown', async () => {
      await expect(page.getByText(copy.errors.genericError)).toBeVisible();
    });
  });
});
