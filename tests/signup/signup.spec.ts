import { test, expect } from '../../fixtures/test';
import { claimAccountCreateSlot } from '../../support/signup/accountBudget';
import {
  assertAccountCreated,
  waitForAccountCreate,
} from '../../support/signup/accountResponse';
import { saveLastCreatedAccount } from '../../support/signup/lastCreatedAccount';
import { buildValidSignupData } from '../../support/signup/signupData';

/**
 * Happy-path signup — the only live 201 creates in the suite.
 * Shared across chromium-en + chromium-fr = exactly 2 accounts (see ASSUMPTIONS.md).
 * EN success also writes lastCreatedAccount.json for the duplicate-email test.
 */
test.describe('signup success', () => {
  test('creates an account via POST /api/accounts (201)', async ({
    appLocale,
    signupPage,
    page,
  }, testInfo) => {
    const slot = appLocale === 'en' ? 'en-success' : 'fr-success';
    claimAccountCreateSlot(slot);

    const data = buildValidSignupData(
      appLocale,
      {},
      { workerIndex: testInfo.workerIndex },
    );

    await test.step('open signup', async () => {
      await signupPage.goto();
    });

    await test.step('submit valid form and assert 201 account echo', async () => {
      // Arm the response listener BEFORE submit so the POST is not missed.
      const responsePromise = waitForAccountCreate(page, data.email);
      await signupPage.fillValidSignup(data);
      await signupPage.submit();

      const response = await responsePromise;
      await assertAccountCreated(response, data);

      // Persist EN email for duplicate coverage (0 extra creates).
      if (appLocale === 'en') {
        saveLastCreatedAccount({
          email: data.email,
          locale: 'en',
          createdAt: new Date().toISOString(),
        });
      }
    });

    await test.step('soft post-nav toward getaquote when stable', async () => {
      // Soft: product may change post-signup routing; do not fail the create contract.
      await expect.soft(page).toHaveURL(/getaquote/i, { timeout: 15_000 });
    });
  });
});
