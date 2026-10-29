# Observed defects (QA signup)

Checked on `https://app.qa.nesto.ca` in Chromium, October 2026, English (`/signup`) and French (`/fr/signup`). Items are marked **observed** (captured response or DOM) or **likely** (needs a product decision). Status codes below are the ones that were captured.

## 1. Misleading duplicate-email API error

- **Status:** Observed response; likely defect. Re-checked October 2026.
- **Repro:** Create an account with a valid payload. Open a fresh session and submit signup again with the same email and another valid payload.
- **Expected:** An error that identifies an email that is already registered.
- **Actual:** `POST /api/accounts` returns **400** with `{ "error": "bad format", "description": "error creating account" }`. The UI shows the generic failure message.
- **Impact:** Support and clients treat a duplicate as a malformed request. The suite asserts this observed 400 body.

## 2. Duplicate `field-1` ids in server HTML

- **Status:** Confirmed in the server HTML for `/signup` and `/fr/signup` (re-checked October 2026: **7×** `id="field-1"`). After hydration the rendered ids are unique and computed names resolve.
- **Repro:** View the document source (before client hydration). Count `id="field-1"` on first name, last name, phone, province, email, password, and confirm password.
- **Expected:** Each control has a unique `id` in the HTML, including the server-rendered markup.
- **Actual:** Those seven controls are all `id="field-1"` in the SSR HTML. Placeholder labels repeat `id="form-placeholder-field-1"`, and `aria-labelledby` points at that repeated id. After hydration in Chromium the ids become distinct (`field-2`, `field-4`, …) and each control’s computed accessible name resolves via `aria-labelledby` (the name source is the placeholder element). Duplicate ids remain invalid HTML. Generated ids are not a stable contract.
- **Impact:** Invalid HTML in the initial document. Names can still resolve via `aria-labelledby` after hydration. Tests fill through `data-testid` and assert visible labels plus accessible names on those controls in the fields spec.

## 3. FR vs EN consent text mismatch

- **Status:** Observed copy difference; needs product confirmation. Re-checked October 2026.
- **Repro:** Compare the partner-consent paragraph on `/signup` and `/fr/signup`.
- **Expected:** Equivalent consent in both languages.
- **Actual:** EN always allows sharing mortgage information with partners. FR only allows sharing mortgage-application info **if nesto cannot provide its services** (`si nous ne sommes pas en mesure de vous fournir nos services`).
- **Impact:** English and French users agree to different conditions. The suite checks a shared consent substring per locale, not the full legal paragraph.

## 4. FR password helper grammar

- **Status:** Observed copy; likely localization defect. Re-checked October 2026.
- **Repro:** Open `/fr/signup` and read the password helper under the password field.
- **Expected:** “entre 12 et 32 caractères”.
- **Actual:** “Le mot de passe doit contenir **au entre** 12 et 32 caractères…”.
- **Impact:** French users see broken grammar on the password rule. Not asserted in the suite (helper text only).

## 5. Min/max messages say “letters” for character counts

- **Status:** Observed copy; likely defect. Re-checked October 2026 (minimum message).
- **Repro:** Submit a password shorter than 12 characters (or longer than 32) on `/signup` and `/fr/signup`.
- **Expected:** A message about character length, matching the 12–32 character rule.
- **Actual:** EN `Minimum of 12 letters required`. FR `Minimum de 12 lettres requises`. (Max equivalents still use “letters” / “lettres” in copy.)
- **Impact:** The message says “letters” for a limit that also counts digits and symbols. The short-password test asserts the live minimum wording.
