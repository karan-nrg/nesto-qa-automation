/**
 * Hard cap on live QA account creation for this assessment suite.
 *
 * Exactly TWO accounts may be created across the entire suite:
 *   1. One English success signup
 *   2. One French success signup
 *
 * Rules for Agent 2 (and anyone extending tests):
 * - Cap account-creating happy paths at EN + FR only.
 * - Duplicate-email test MUST reuse one of those two emails (prefer EN) —
 *   create-then-retry in the same flow / shared setup. Do NOT create a third
 *   independent account just for duplicate coverage.
 * - Client-side validation negatives must NOT call POST /api/accounts.
 * - Do not add smoke / discoverability tests that register accounts.
 *
 * Helpers below are documentation + lightweight guardrails, not a global lock
 * (Playwright workers are separate processes). Specs must still honor the cap.
 */

export const MAX_LIVE_ACCOUNT_CREATES = 2 as const;

export type AccountCreateSlot = 'en-success' | 'fr-success';

/** Documented slots — the only allowed POST /api/accounts success creates. */
export const ACCOUNT_CREATE_SLOTS: readonly AccountCreateSlot[] = [
  'en-success',
  'fr-success',
] as const;

/**
 * Call at the start of a test that intentionally creates a live account.
 * Documents intent; throws if an unknown slot is requested.
 */
export function claimAccountCreateSlot(slot: AccountCreateSlot): void {
  if (!ACCOUNT_CREATE_SLOTS.includes(slot)) {
    throw new Error(
      `Refusing account create for unknown slot "${String(slot)}". ` +
        `Only ${ACCOUNT_CREATE_SLOTS.join(' and ')} are allowed ` +
        `(max ${MAX_LIVE_ACCOUNT_CREATES} live creates).`,
    );
  }
}
