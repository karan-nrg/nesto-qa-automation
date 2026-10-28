import type { AppLocale } from '../../config/locales';

/** Canadian province / territory codes used by the region select. */
export type RegionCode =
  | 'AB'
  | 'BC'
  | 'MB'
  | 'NB'
  | 'NL'
  | 'NT'
  | 'NS'
  | 'NU'
  | 'ON'
  | 'PE'
  | 'QC'
  | 'SK'
  | 'YT';

export interface SignupData {
  firstName: string;
  lastName: string;
  /** Throwaway unique email — never a personal address. */
  email: string;
  /**
   * National digits for the phone widget (no country code).
   * After the intl-tel widget, the wire format is E.164 (e.g. +1604555xxxx).
   */
  phoneNational: string;
  /** Expected E.164 value after the phone widget normalizes input. */
  phoneE164: string;
  region: RegionCode;
  password: string;
  passwordConfirmation: string;
  leadDistributeConsentAgreement: boolean;
  /** Maps to request `language` and response `preferredLanguage`. */
  preferredLanguage: AppLocale;
}

export type SignupDataOverrides = Partial<SignupData>;

const VALID_PASSWORD = 'NestoQaPass12!';

/**
 * Unique throwaway identity for signup.
 * Email embeds timestamp + Playwright worker index so parallel runs do not collide.
 *
 * ACCOUNT CAP: building data does not create an account, but submitting it does.
 * Only two live creates are allowed suite-wide (EN success + FR success).
 * Duplicate tests must reuse one of those emails; validation negatives must not POST.
 * See support/signup/accountBudget.ts and ASSUMPTIONS.md.
 */
export function buildValidSignupData(
  locale: AppLocale,
  overrides: SignupDataOverrides = {},
  options?: { workerIndex?: number },
): SignupData {
  const workerIndex = options?.workerIndex ?? 0;
  const stamp = Date.now();
  const phoneNational = uniquePhoneNational(stamp, workerIndex);

  const base: SignupData = {
    firstName: 'Auto',
    lastName: 'Tester',
    email: `nesto.qa+${stamp}.w${workerIndex}@example.com`,
    phoneNational,
    phoneE164: `+1${phoneNational}`,
    region: 'BC',
    password: VALID_PASSWORD,
    passwordConfirmation: VALID_PASSWORD,
    leadDistributeConsentAgreement: false,
    preferredLanguage: locale,
  };

  return { ...base, ...overrides };
}

/**
 * Build a Canadian 10-digit national number that is unique per run/worker.
 * Avoids well-known fictional 555 patterns that some widgets reject.
 */
function uniquePhoneNational(stamp: number, workerIndex: number): string {
  // Area code 604 (BC) + 7 digits derived from stamp/worker
  const suffix = String((stamp + workerIndex * 17) % 10_000_000).padStart(
    7,
    '0',
  );
  return `604${suffix}`;
}

/** Convenience for negative cases — start from valid data and override fields. */
export function buildSignupDataWithOverrides(
  locale: AppLocale,
  overrides: SignupDataOverrides,
  options?: { workerIndex?: number },
): SignupData {
  return buildValidSignupData(locale, overrides, options);
}
