# nesto QA Automation — Signup

Playwright + TypeScript suite for the nesto QA signup flow (`https://app.qa.nesto.ca`).

## Test Isolation, Data Lifecycle & Assumptions

1. **Independence:** Every test runs independently with fresh browser state and no cross-test dependencies.
2. **Data generation:** Account identities are unique per execution attempt, including retries. Unique data is created **inside each test attempt** (e.g. `buildValidSignupData()` at the start of the test body), not at module initialization or shared suite setup.
3. **Cleanup:** No destructive teardown is implemented because the assessment does not provide a supported account-deletion contract.
4. **Repeatability:** Tests remain rerunnable without requiring database resets or existing accounts.
5. **API expectations:** Phone normalization (such as E.164) and language mapping are based on observed behaviour and verified before assertions are finalized.
6. **Reporting:** Traces and screenshots are enabled as agreed but treated as sensitive, gitignored artifacts.
7. **Known limitations:** Synthetic accounts persist in QA; test-data cleanup would be a future collaboration with the application team.

Live tests create synthetic QA accounts (no create cap). Client-side validation negatives must not call `POST /api/accounts`. The duplicate-email case is self-contained per locale: create once, then resubmit the same email in a fresh browser context.

See [ASSUMPTIONS.md](./ASSUMPTIONS.md) for browser, locale, and API assumptions.

## Setup

```bash
npm ci
npx playwright install chromium
```

## Scripts

| Script                 | Purpose                                           |
| ---------------------- | ------------------------------------------------- |
| `npm test`             | Run both projects (`chromium-en` + `chromium-fr`) |
| `npm run test:en`      | English project only                              |
| `npm run test:fr`      | French project only                               |
| `npm run test:ui`      | Playwright UI mode                                |
| `npm run test:report`  | Open last HTML report                             |
| `npm run lint`         | ESLint                                            |
| `npm run format`       | Prettier write                                    |
| `npm run format:check` | Prettier check                                    |
| `npm run typecheck`    | `tsc --noEmit`                                    |
| `npm run check`        | format:check + lint + typecheck                   |

## Projects

Language is selected by **application URL** (not Accept-Language alone):

- `chromium-en` → `https://app.qa.nesto.ca/signup`
- `chromium-fr` → `https://app.qa.nesto.ca/fr/signup`

Firefox / WebKit can be added later via Playwright projects — not required for this assessment.

## Layout

```
pages/signup/          Page object (data-testid primary)
tests/signup/          Specs (Agent 2)
support/signup/        Data, copy, API helpers
fixtures/test.ts       Typed fixtures (locale + SignupPage)
config/locales.ts      EN/FR URL + project mapping
```

## CI

- **PR / push:** `npm ci` + `format:check` + `lint` + `typecheck` (no live signup).
- **Live E2E:** `workflow_dispatch` only — installs Chromium and runs both projects. Tests create synthetic QA accounts (no cap). Traces may contain secrets; do not publish them publicly.

## Docs

- [ASSUMPTIONS.md](./ASSUMPTIONS.md) — required assessment assumptions
- [BUGS.md](./BUGS.md) — observed likely defects
