# Nesto QA Automation Exercise - Signup

Playwright + TypeScript automation suite for the [nesto QA signup page](https://app.qa.nesto.ca/signup).

**Prepared by:** Karan Narang  
**Date:** October 28, 2026

## Test Coverage

| Area              | Coverage                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------ |
| Positive signup   | Successful registration, API `201`, submitted account details, and post-signup navigation                    |
| Consent           | Successful signup with partner consent both enabled and disabled                                             |
| Negative signup   | Required fields, invalid email and phone, password validation, password mismatch, and duplicate registration |
| Fields and labels | Field visibility, English/French labels, accessible names, consent checkbox, and submit button               |
| Localization      | The same tests run in English and French using separate Playwright projects                                  |

The tests are organized into three spec files:

- `tests/signup/signup.spec.ts` — Successful signup scenarios
- `tests/signup/validation.spec.ts` — Negative signup scenarios
- `tests/signup/fields.spec.ts` — Field, label, and accessibility-related checks

## Setup

**Prerequisites:** Node.js and Yarn.

Install dependencies and the Chromium browser:

```bash
yarn install --frozen-lockfile
yarn playwright install chromium
```

## Running the Tests

```bash
# Run the full suite in English and French
yarn test

# Run one language
yarn test:en
yarn test:fr

# Open Playwright UI mode
yarn test:ui

# Open the HTML report
yarn test:report

# Run formatting, linting, and TypeScript checks
yarn check
```

## Language Configuration

The application URL determines the language:

- `chromium-en` → `/signup`
- `chromium-fr` → `/fr/signup`

Both projects execute the same specs. The custom `appLocale` fixture provides the expected language to the tests.

Chromium was selected to keep the assessment focused. Additional browser coverage is listed under future improvements.

## Test Data and Isolation

Each test uses an isolated browser session. Registration attempts generate unique synthetic email addresses, allowing tests to run independently and in parallel.

The duplicate-email test creates an account as part of its setup, then attempts registration again using a fresh browser context.

Test accounts remain in the QA environment because a supported cleanup API wasn't provided.

See [ASSUMPTIONS.md](./ASSUMPTIONS.md) for the testing decisions and trade-offs.

## Reports and Debugging

Playwright generates an HTML report in `playwright-report/`. Open it using:

```bash
yarn test:report
```

Screenshots are captured on failure, and traces are recorded on the first retry. These files are excluded from Git because they may contain submitted credentials or authentication tokens.

## CI

The GitHub Actions workflow separates code-quality checks from live signup tests:

- **Push / pull request:** Run formatting, linting, and TypeScript checks without creating QA accounts.
- **Manual execution (`workflow_dispatch`):** Run E2E with optional inputs:
  - `test_file` — e.g. `tests/signup/fields.spec.ts` (empty = full suite)
  - `project` — `both`, `chromium-en`, or `chromium-fr`

Live E2E tests are triggered manually to avoid creating unnecessary accounts. On failure, Playwright `test-results/` and `playwright-report/` are uploaded as artifacts (7-day retention) for debugging; they may contain credentials or tokens.

## Project Structure

```
config/           Language and project configuration
fixtures/         Playwright fixtures
pages/            Signup and post-signup Page Objects
support/signup/   Test data, localized text, and API helpers
tests/signup/     Playwright test specs
```

## What I'd Add With More Time

- Extend browser coverage to Firefox and WebKit.
- Add component-level tests for field validation, accessibility, and localization, including boundary cases.
- Introduce automated accessibility checks using axe-core, along with keyboard navigation testing.
- Add dedicated API tests for account creation and error responses, and use APIs for test data setup and cleanup where supported.

## Documentation

- [ASSUMPTIONS.md](./ASSUMPTIONS.md) — Assumptions and testing trade-offs
- [BUGS.md](./BUGS.md) — Issues observed during testing
