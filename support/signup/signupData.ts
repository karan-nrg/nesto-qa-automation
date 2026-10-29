import { randomUUID } from 'node:crypto';

const VALID_PASSWORD = 'NestoQaTest123!';
const TEST_PHONE_NUMBER = '6045550100';

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
  email: string;
  phoneNumber: string;
  region: RegionCode;
  password: string;
  passwordConfirmation: string;
  leadDistributeConsentAgreement: boolean;
}

export type SignupDataOverrides = Partial<SignupData>;

/**
 * Generates signup data with valid defaults.
 * Allows overriding individual fields for negative test scenarios.
 */
export function buildValidSignupData(
  overrides: SignupDataOverrides = {},
): SignupData {
  const password = overrides.password ?? VALID_PASSWORD;

  const base: SignupData = {
    firstName: 'Auto',
    lastName: 'Tester',
    email: `kn-nesto-qa-${randomUUID()}@mailinator.com`,
    phoneNumber: overrides.phoneNumber ?? TEST_PHONE_NUMBER,
    region: 'BC',
    password,
    passwordConfirmation: password,
    leadDistributeConsentAgreement: false,
  };

  return { ...base, ...overrides };
}
