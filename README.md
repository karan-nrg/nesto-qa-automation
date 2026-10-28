# nesto QA Automation — Signup

Playwright + TypeScript suite for the nesto QA signup flow (`https://app.qa.nesto.ca`).

## Live account budget (HARD CAP)

**Exactly 2 QA accounts** may be created by the whole suite:

1. One **English** success signup
2. One **French** success signup

- Duplicate-email coverage **reuses** one of those emails (prefer EN) — create-then-retry / shared setup.
- Client-side validation negatives **must not** call `POST /api/accounts`.
- Do **not** add smoke tests that register accounts.

See [ASSUMPTIONS.md](./ASSUMPTIONS.md) and `support/signup/accountBudget.ts`.

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
support/signup/        Data, copy, API helpers, account budget
fixtures/test.ts       Typed fixtures (locale + SignupPage)
config/locales.ts      EN/FR URL + project mapping
```

## CI

- **PR / push:** `npm ci` + `format:check` + `lint` + `typecheck` (no live signup).
- **Live E2E:** `workflow_dispatch` only — installs Chromium and runs both projects under the 2-account cap. Traces may contain secrets; do not publish them publicly.

## Docs

- [ASSUMPTIONS.md](./ASSUMPTIONS.md) — required assessment assumptions
- [BUGS.md](./BUGS.md) — observed likely defects
