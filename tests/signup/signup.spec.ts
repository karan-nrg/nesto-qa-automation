import { test, expect } from '@/fixtures/test';
import { BASE_URL, LOCALE_CONFIG } from '@/config/locales';
import { GetAQuotePage } from '@/pages/getaquote/GetAQuotePage';
import {
  type CreateAccountResponseBody,
  waitForAccountCreationResponse,
} from '@/support/signup/accountResponse';
import { buildValidSignupData } from '@/support/signup/signupData';

const GET_A_QUOTE_HEADING = {
  en: 'How can we help you with your mortgage?',
  fr: 'Comment peut-on vous aider avec votre hypothèque?',
} as const;

test.describe('Signup success', () => {
  test('creates an account and opens the mortgage options page', async ({
    appLocale,
    signupPage,
    page,
  }) => {
    const data = buildValidSignupData();

    await test.step('Create account and verify the API response', async () => {
      await signupPage.goto();
      await signupPage.fillSignupForm(data);

      const responsePromise = waitForAccountCreationResponse(page, data.email);
      await signupPage.submit();

      const response = await responsePromise;
      expect(response.status()).toBe(201);

      const body = (await response.json()) as CreateAccountResponseBody;

      expect(body.account).toMatchObject({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: `+1${data.phoneNumber}`,
        region: data.region,
        preferredLanguage: appLocale,
        leadDistributeConsentAgreement: data.leadDistributeConsentAgreement,
      });

      expect(body).not.toHaveProperty('password');
      expect(body.account).not.toHaveProperty('password');
    });

    await test.step('Verify the mortgage options page', async () => {
      const getAQuotePage = new GetAQuotePage(page);
      const { getAQuotePath } = LOCALE_CONFIG[appLocale];

      // Auth redirect (authorize → callback → getaquote) can exceed the default expect timeout.
      await expect(page).toHaveURL(`${BASE_URL}${getAQuotePath}`, {
        timeout: 15_000,
      });
      await expect(getAQuotePage.heading).toHaveText(
        GET_A_QUOTE_HEADING[appLocale],
      );
      await expect(getAQuotePage.myPortfolioButton).toBeVisible();
      await expect(getAQuotePage.newMortgageOption).toBeVisible();
      await expect(getAQuotePage.renewalOption).toBeVisible();
      await expect(getAQuotePage.refinanceOption).toBeVisible();
    });
  });

  test('creates an account with partner consent enabled', async ({
    appLocale,
    signupPage,
    page,
  }) => {
    const data = buildValidSignupData({
      leadDistributeConsentAgreement: true,
    });

    await signupPage.goto();
    await signupPage.fillSignupForm(data);

    const responsePromise = waitForAccountCreationResponse(page, data.email);
    await signupPage.submit();

    const response = await responsePromise;
    expect(response.status()).toBe(201);

    const body = (await response.json()) as CreateAccountResponseBody;
    expect(body.account).toMatchObject({
      email: data.email,
      preferredLanguage: appLocale,
      leadDistributeConsentAgreement: true,
    });
  });
});
