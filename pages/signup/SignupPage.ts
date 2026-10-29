import { expect, type Locator, type Page } from '@playwright/test';
import { LOCALE_CONFIG, type AppLocale } from '@/config/locales';
import type { SignupData } from '@/support/signup/signupData';
import { signupCopyFor } from '@/support/signup/signupCopy';

/** Page Object for the signup form. */
export class SignupPage {
  readonly page: Page;
  readonly locale: AppLocale;

  // Form fields
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly phoneInput: Locator;
  readonly regionSelect: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordConfirmationInput: Locator;
  readonly agreementCheckbox: Locator;
  readonly submitButton: Locator;

  // Field labels
  readonly fieldLabels: {
    firstName: Locator;
    lastName: Locator;
    phone: Locator;
    region: Locator;
    email: Locator;
    password: Locator;
    passwordConfirmation: Locator;
  };

  // Validation errors
  readonly firstNameError: Locator;
  readonly lastNameError: Locator;
  readonly phoneError: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly passwordConfirmationError: Locator;
  readonly genericError: Locator;

  constructor(page: Page, locale: AppLocale) {
    this.page = page;
    this.locale = locale;

    this.firstNameInput = page.getByTestId('first-name-input');
    this.lastNameInput = page.getByTestId('last-name-input');
    this.phoneInput = page.getByTestId('phoneInput');
    this.regionSelect = page.getByTestId('region-select');
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.passwordConfirmationInput = page.getByTestId(
      'passwordConfirmation-input',
    );
    this.agreementCheckbox = page.getByTestId('agreement-checkbox');
    this.submitButton = page.getByTestId('submit-button');

    this.fieldLabels = {
      firstName: page.getByTestId('first-name-input-placeholder'),
      lastName: page.getByTestId('last-name-input-placeholder'),
      phone: page.getByTestId('input-placeholder'),
      region: page.getByTestId('select-placeholder'),
      email: page.getByTestId('email-input-placeholder'),
      password: page.getByTestId('password-input-placeholder'),
      passwordConfirmation: page.getByTestId(
        'passwordConfirmation-input-placeholder',
      ),
    };

    this.firstNameError = page.getByTestId(
      'first-name-error-message-typography',
    );
    this.lastNameError = page.getByTestId('last-name-error-message-typography');
    this.phoneError = page.getByTestId('phone-error-message-typography');
    this.emailError = page.getByTestId('email-error-message-typography');
    this.passwordError = page.getByTestId('password-error-message-typography');
    this.passwordConfirmationError = page.getByTestId(
      'passwordConfirmation-error-message-typography',
    );
    this.genericError = page.getByText(
      signupCopyFor(locale).errors.genericError,
    );
  }

  async goto(): Promise<void> {
    // Geolocation can update the province and reset the form fields.
    const geolocationPromise = this.page.waitForResponse((response) =>
      response.url().includes('/api/geolocation/all'),
    );

    await this.page.goto(LOCALE_CONFIG[this.locale].signupPath);

    const geolocationResponse = await geolocationPromise;
    expect(geolocationResponse.ok()).toBe(true);

    await expect(this.regionSelect).not.toHaveValue('');
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async fillSignupForm(data: SignupData): Promise<void> {
    // Select the province first because changing it can reset the phone input.
    await this.regionSelect.selectOption(data.region);
    await expect(this.regionSelect).toHaveValue(data.region);

    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.phoneInput.fill(data.phoneNumber);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.passwordConfirmationInput.fill(data.passwordConfirmation);
    await this.agreementCheckbox.setChecked(
      data.leadDistributeConsentAgreement,
    );
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
