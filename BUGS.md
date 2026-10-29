# Observed defects (QA signup)

Checked on `https://app.qa.nesto.ca` in Chromium, English (`/signup`) and French (`/fr/signup`). Confirmed observations are separated from items that may need product clarification.

## 1. Misleading duplicate-email API error

- **Status:** Observed response; likely defect.
- **Repro:** Create an account with a valid payload. Open a fresh session and submit signup again with the same email and another valid payload.
- **Expected:** An error that identifies an email that is already registered.
- **Actual:** `POST /api/accounts` returns **400** with `{ "error": "bad format", "description": "error creating account" }`. The UI shows the generic failure message.
- **Impact:** The error doesn't explain that the email is already registered, making it harder for users and API consumers to understand what went wrong.

## 2. Duplicate `field-1` ids in server HTML

- **Status:** Confirmed in the server HTML for `/signup` and `/fr/signup` (**7×** `id="field-1"`).
- **Repro:** View the document source (before client hydration). Count `id="field-1"` on first name, last name, phone, province, email, password, and confirm password.
- **Expected:** Each control has a unique `id` in the HTML, including the server-rendered markup.
- **Actual:** In the server HTML, those seven controls all use `id="field-1"`. Their labels/`aria-labelledby` also point at the same repeated placeholder id. After the page loads, the IDs become unique and the fields have the expected accessible names. However, the initial HTML still contains duplicate IDs.
- **Impact:** The duplicate IDs could cause ambiguous label associations before hydration, although the accessible names resolve correctly once the page loads.

## 3. FR vs EN consent text mismatch

- **Status:** Observed copy difference; needs product confirmation.
- **Repro:** Compare the partner-consent paragraph on `/signup` and `/fr/signup`.
- **Expected:** Equivalent meaning in both languages, unless a locale-specific legal difference is intentional.
- **Actual:** EN states that the user agrees to nesto sharing mortgage information with its partners, with no further qualifier. FR includes an extra condition absent from EN: sharing mortgage-application information only **if nesto cannot provide its services** (`si nous ne sommes pas en mesure de vous fournir nos services`).
- **Impact:** If unintentional, English and French users may be agreeing to different conditions. Product/legal should confirm whether the FR clause is required.
