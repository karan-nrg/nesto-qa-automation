import type { Locator, Page } from '@playwright/test';
import { LOCALE_CONFIG, type AppLocale } from '../../config/locales';
import type { RegionCode, SignupData } from '../../support/signup/signupData';

/**
 * Signup page object — locators and interactions only.
 * No business assertions here (Agent 2 owns expectations in specs).
 *
 * Prefer data-testid: label/id wiring on this form is broken (duplicate field-1 ids).
 *
 * ACCOUNT CAP: fillValidSignup + submit create real QA accounts.
 * Live creates are limited to EN + FR happy paths only (2 total). See ASSUMPTIONS.md.
 */
export class SignupPage {
  readonly page: Page;
  readonly locale: AppLocale;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly phoneInput: Locator;
  readonly regionSelect: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordConfirmationInput: Locator;
  readonly agreementCheckbox: Locator;
  readonly submitButton: Locator;

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
  }

  /** Navigate using the locale URL path (source of truth for language). */
  async goto(): Promise<void> {
    const { signupPath } = LOCALE_CONFIG[this.locale];
    await this.page.goto(signupPath);
  }

  async fillFirstName(value: string): Promise<void> {
    await this.firstNameInput.fill(value);
  }

  async fillLastName(value: string): Promise<void> {
    await this.lastNameInput.fill(value);
  }

  async fillPhone(nationalDigits: string): Promise<void> {
    await this.phoneInput.fill(nationalDigits);
  }

  async fillEmail(value: string): Promise<void> {
    await this.emailInput.fill(value);
  }

  async fillPassword(value: string): Promise<void> {
    await this.passwordInput.fill(value);
  }

  async fillPasswordConfirmation(value: string): Promise<void> {
    await this.passwordConfirmationInput.fill(value);
  }

  async selectProvince(region: RegionCode): Promise<void> {
    await this.regionSelect.selectOption(region);
  }

  async setConsent(checked: boolean): Promise<void> {
    const isChecked = await this.agreementCheckbox.isChecked();
    if (isChecked !== checked) {
      await this.agreementCheckbox.click();
    }
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Fill a complete valid signup form. Does NOT submit.
   * Submitting this data creates a real QA account — only EN + FR happy paths
   * may do so (2 creates total for the suite). Duplicate coverage must reuse
   * one of those emails; validation negatives must not POST /api/accounts.
   */
  async fillValidSignup(data: SignupData): Promise<void> {
    await this.fillFirstName(data.firstName);
    await this.fillLastName(data.lastName);
    await this.fillPhone(data.phoneNational);
    await this.selectProvince(data.region);
    await this.fillEmail(data.email);
    await this.fillPassword(data.password);
    await this.fillPasswordConfirmation(data.passwordConfirmation);
    await this.setConsent(data.leadDistributeConsentAgreement);
  }
}
