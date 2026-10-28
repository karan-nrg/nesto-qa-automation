# Assumptions

Documented decisions for the nesto signup Playwright suite (`app.qa.nesto.ca`).

## Live account creation budget (HARD CAP)

**Do not create many QA accounts.** The suite may create **exactly 2 accounts total**:

1. **One English** success signup (`chromium-en`)
2. **One French** success signup (`chromium-fr`)

Rules:

| Scenario                              | Allowed to `POST /api/accounts` → 201?                                 | Notes                                                               |
| ------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------- |
| EN happy path                         | Yes (slot 1)                                                           | Only EN success create                                              |
| FR happy path                         | Yes (slot 2)                                                           | Only FR success create                                              |
| Duplicate email                       | POST allowed, but **must reuse** EN (preferred) or FR email from above | Create-then-retry / shared setup — **no third independent account** |
| Client-side validation negatives      | **No**                                                                 | Must not reach the API                                              |
| Smoke / discoverability / scaffolding | **No**                                                                 | Never register accounts in placeholders                             |

Helpers: `support/signup/accountBudget.ts` (`claimAccountCreateSlot`). Specs must honor this even under parallel workers.

Because the **shared suite runs under both projects**, a single “success signup” spec that creates once per locale naturally yields the two allowed accounts (EN project + FR project). Do **not** also add separate EN-only and FR-only create specs on top of that.

**Duplicate-email** coverage should prefer `chromium-en` only (or create-then-retry inside the EN success flow) so a second project run does not perform another independent create.

## Browsers and projects

- Assessment runs **Chromium only** via projects `chromium-en` and `chromium-fr`.
- Firefox / WebKit are **not** configured as mandatory; they can be added later as extra Playwright projects.

## Locale / language

- The **full shared suite** runs under both EN and FR projects.
- **URL selects language** (`/signup` vs `/fr/signup`). Playwright `locale` is a secondary browser hint only — not the source of truth.

## Account lifecycle

- **No account teardown API** was observed. Throwaway emails only; no personal addresses.
- Success contract: `POST /api/accounts` → **201** with `{ account, token }`.
- Request sends `language`; response echoes **`preferredLanguage`**.
- Phone on the wire is **E.164** (e.g. `+1604…`) after the phone widget.
- Password is submitted but **must not** appear in the response; tokens are returned — **never log** passwords or tokens.
- Traces / HTML reports may contain secrets → gitignored; do not publish sensitive artifacts publicly.

## Duplicate email (observed)

- Duplicate signup still calls `POST /api/accounts`.
- Observed: **400** + `{ "error": "bad format", "description": "error creating account" }`.
- Likely product defect (misleading message; 409-style conflict would be clearer). Tests assert **observed** behavior, not an invented 409.

## Tooling

- `retries: 1`; `trace: on-first-retry`; `screenshot: only-on-failure`; `video: off`.
- Live E2E in CI is **workflow_dispatch only** (creates real QA accounts under the 2-account cap).
