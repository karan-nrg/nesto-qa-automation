import { test, expect } from '@/fixtures/test';
import { signupCopyFor } from '@/support/signup/signupCopy';

test.describe('Signup fields', () => {
  test('displays the signup fields and labels in the selected language', async ({
    appLocale,
    signupPage,
    page,
  }) => {
    const copy = signupCopyFor(appLocale);

    await signupPage.goto();

    await test.step('All signup controls are visible', async () => {
      await expect(signupPage.firstNameInput).toBeVisible();
      await expect(signupPage.lastNameInput).toBeVisible();
      await expect(signupPage.phoneInput).toBeVisible();
      await expect(signupPage.regionSelect).toBeVisible();
      await expect(signupPage.emailInput).toBeVisible();
      await expect(signupPage.passwordInput).toBeVisible();
      await expect(signupPage.passwordConfirmationInput).toBeVisible();
      await expect(signupPage.agreementCheckbox).toBeVisible();
      await expect(signupPage.submitButton).toBeVisible();
    });

    await test.step('Field labels and accessible names match the selected language', async () => {
      const fields = [
        {
          input: signupPage.firstNameInput,
          label: signupPage.fieldLabels.firstName,
          text: copy.fieldLabels.firstName,
        },
        {
          input: signupPage.lastNameInput,
          label: signupPage.fieldLabels.lastName,
          text: copy.fieldLabels.lastName,
        },
        {
          input: signupPage.phoneInput,
          label: signupPage.fieldLabels.phone,
          text: copy.fieldLabels.phone,
        },
        {
          input: signupPage.regionSelect,
          label: signupPage.fieldLabels.region,
          text: copy.fieldLabels.region,
        },
        {
          input: signupPage.emailInput,
          label: signupPage.fieldLabels.email,
          text: copy.fieldLabels.email,
        },
        {
          input: signupPage.passwordInput,
          label: signupPage.fieldLabels.password,
          text: copy.fieldLabels.password,
        },
        {
          input: signupPage.passwordConfirmationInput,
          label: signupPage.fieldLabels.passwordConfirmation,
          text: copy.fieldLabels.passwordConfirmation,
        },
      ];

      for (const { input, label, text } of fields) {
        await expect(label).toBeVisible();
        await expect(label).toHaveText(text);
        await expect(input).toHaveAccessibleName(text);
      }
    });

    await test.step('Consent is unchecked and the submit button is translated', async () => {
      await expect(
        page.getByRole('checkbox', {
          name: copy.consentLabelContains,
        }),
      ).toBeVisible();
      await expect(signupPage.agreementCheckbox).not.toBeChecked();
      await expect(signupPage.submitButton).toHaveText(copy.submit);
    });
  });
});
