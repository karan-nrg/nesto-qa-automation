import { type Locator, type Page } from '@playwright/test';

/** Locators for the mortgage options page shown after signup. */
export class GetAQuotePage {
  readonly heading: Locator;
  readonly myPortfolioButton: Locator;
  readonly newMortgageOption: Locator;
  readonly renewalOption: Locator;
  readonly refinanceOption: Locator;

  constructor(page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.myPortfolioButton = page.getByTestId('my-portfolio-button');
    this.newMortgageOption = page.getByTestId('new-mortgage');
    this.renewalOption = page.getByTestId('renewal');
    this.refinanceOption = page.getByTestId('refinance');
  }
}
