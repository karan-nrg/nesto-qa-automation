# Observed defects (QA signup)

Precise observations from investigation against `https://app.qa.nesto.ca` (Oct 2026). Language: **likely defects** — do not invent required API statuses beyond what was captured.

## 1. Misleading duplicate-email API error

- **Steps:** Create an account, then submit signup again with the same email (valid payload).
- **Observed:** `POST /api/accounts` → **400 Bad Request** with body:
  ```json
  { "error": "bad format", "description": "error creating account" }
  ```
- **Why it matters:** Payload is not malformed; the conflict is almost certainly “email already registered.” “bad format” misleads users, support, and automation.
- **Note:** A conflict-style status (e.g. 409) would also be clearer than 400, but the **wrong error string** is the clearer product defect. Tests assert the **observed** 400 + `bad format` contract.

## 2. Duplicate `field-1` ids / broken label association

- Multiple inputs share the same `id="field-1"` (and similar), so label `for` association is unreliable.
- **Automation impact:** Prefer **`data-testid`** locators (primary strategy in `SignupPage`).

## 3. FR vs EN consent text mismatch

- English partner-consent copy and French copy are not equivalent translations.
- FR adds an extra clause about sharing mortgage application info **if nesto cannot provide services**; EN does not include that condition.
- Likely intentional product difference or localization defect — flag for product/i18n review; do not silently assert EN text on FR.

## 4. FR password helper grammar

- Observed helper: _“Le mot de passe doit contenir **au entre** 12 et 32 caractères…”_
- Expected French would use _“entre”_ (not _“au entre”_).

## 5. Min/max messages say “letters” for character counts

- EN: `Minimum of {{minChar}} letters required` / `Maximum of {{maxChar}} letters required`
- FR: `Minimum de {{minChar}} lettres requises` / …
- These messages refer to **character** length constraints but say **letters**, which is misleading for passwords/names that allow digits/symbols.
