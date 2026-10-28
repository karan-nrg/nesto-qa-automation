# Assumptions

Documented decisions for the nesto signup Playwright suite (`app.qa.nesto.ca`).

## Browsers and projects

- Assessment runs **Chromium only** via projects `chromium-en` and `chromium-fr`.
- Firefox / WebKit are **not** configured as mandatory; they can be added later as extra Playwright projects.

## Locale / language

- The **full shared suite** runs under both EN and FR projects.
- **URL selects language** (`/signup` vs `/fr/signup`). Playwright `locale` is a secondary browser hint only — not the source of truth.
- Request sends `language`; response echoes **`preferredLanguage`**. Mapping is based on observed behaviour and verified before assertions are finalized.

## Account lifecycle and isolation

- **No account teardown API** was observed. Throwaway emails only; no personal addresses.
- Unique signup identities are generated **inside each test attempt** (not at module init or shared suite setup) so retries get a fresh email.
- Tests are independent: fresh browser state, no cross-test data stores or ordering dependencies.
- Duplicate-email coverage is **self-contained** within a single test (create → fresh context → resubmit same email) and runs under both EN and FR.
- Success contract: `POST /api/accounts` → **201** with `{ account, token }`.
- Phone on the wire is **E.164** (e.g. `+1604…`) after the phone widget — observed normalization verified before assertions.
- Password is submitted but **must not** appear in the response; tokens are returned — **never log** passwords or tokens.
- Traces / HTML reports may contain secrets → gitignored; do not publish sensitive artifacts publicly.
- Synthetic accounts persist in QA; cleanup would require a supported deletion contract from the application team.

## Duplicate email (observed)

- Duplicate signup still calls `POST /api/accounts`.
- Observed: **400** + `{ "error": "bad format", "description": "error creating account" }`.
- Likely product defect (misleading message; 409-style conflict would be clearer). Tests assert **observed** behavior, not an invented 409.

## Tooling

- `retries: 1`; `trace: on-first-retry`; `screenshot: only-on-failure`; `video: off`.
- Live E2E in CI is **workflow_dispatch only** (creates synthetic QA accounts; no create cap).
