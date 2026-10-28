import { test, expect } from '../../fixtures/test';
import {
  assertAccountCreated,
  waitForAccountCreate,
} from '../../support/signup/accountResponse';
import { buildValidSignupData } from '../../support/signup/signupData';

/**
 * Happy-path signup — creates a live QA account per locale project run.
 * Identity is built inside each test attempt (retries get a new email).
 */
test.describe('signup success', () => {
  test('creates an account via POST /api/accounts (201)', async ({
    appLocale,
    signupPage,
    page,
  }, testInfo) => {
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
    });

    await test.step('soft post-nav toward getaquote when stable', async () => {
      // Soft: product may change post-signup routing; do not fail the create contract.
      await expect.soft(page).toHaveURL(/getaquote/i, { timeout: 15_000 });
    });
  });
});
