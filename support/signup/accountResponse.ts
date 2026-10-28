import { expect, type Page, type Response } from '@playwright/test';
import type { SignupData } from './signupData';

const ACCOUNTS_PATH = '/api/accounts';

export interface AccountPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  region?: string;
  preferredLanguage?: string;
  leadDistributeConsentAgreement?: boolean;
  password?: unknown;
  [key: string]: unknown;
}

export interface CreateAccountResponseBody {
  account?: AccountPayload;
  token?: {
    accessToken?: string;
    refreshToken?: string;
    tokenType?: string;
    expires?: string;
  };
  error?: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Register a waiter for POST /api/accounts matching the expected email in the
 * request body. Call this BEFORE triggering submit so the request is not missed.
 * Returns the response even when status is not 201.
 *
 * ACCOUNT CAP: a 201 from this waiter consumes one of the two allowed live
 * creates (EN success or FR success). Duplicate coverage should wait on a
 * retry with a reused email (expect 400), not a third 201. Client validation
 * negatives should never arm this waiter — those must not POST /api/accounts.
 * See accountBudget.ts and ASSUMPTIONS.md.
 */
export function waitForAccountCreate(
  page: Page,
  email: string,
): Promise<Response> {
  return page.waitForResponse(async (response) => {
    if (response.request().method() !== 'POST') {
      return false;
    }
    if (!response.url().includes(ACCOUNTS_PATH)) {
      return false;
    }
    try {
      const raw = response.request().postData() ?? '';
      if (!raw) {
        return false;
      }
      const body = JSON.parse(raw) as { email?: string };
      return body.email === email;
    } catch {
      // Do not log request body — may contain password.
      return false;
    }
  });
}

export async function parseAccountResponse(
  response: Response,
): Promise<CreateAccountResponseBody> {
  return (await response.json()) as CreateAccountResponseBody;
}

/**
 * Assert successful account creation (201) and safe field echo.
 * Never logs tokens or passwords.
 */
export async function assertAccountCreated(
  response: Response,
  expected: SignupData,
): Promise<AccountPayload> {
  expect(response.status(), 'POST /api/accounts should return 201').toBe(201);

  const body = await parseAccountResponse(response);
  const account = body.account;
  expect(account, '201 response should include account object').toBeTruthy();

  assertPasswordAbsent(body);
  assertPasswordAbsent(account as AccountPayload);

  expect(account!.firstName).toBe(expected.firstName);
  expect(account!.lastName).toBe(expected.lastName);
  expect(account!.email).toBe(expected.email);
  expect(account!.phone).toBe(expected.phoneE164);
  expect(account!.region).toBe(expected.region);
  expect(account!.preferredLanguage).toBe(expected.preferredLanguage);
  expect(account!.leadDistributeConsentAgreement).toBe(
    expected.leadDistributeConsentAgreement,
  );

  // Token may be present — assert shape only, never print values.
  if (body.token) {
    expect(body.token.tokenType).toBe('Bearer');
    expect(typeof body.token.accessToken).toBe('string');
  }

  return account as AccountPayload;
}

/** Assert password is not echoed in a response/account object. */
export function assertPasswordAbsent(
  obj: CreateAccountResponseBody | AccountPayload | undefined,
): void {
  if (!obj) {
    return;
  }
  expect(
    Object.prototype.hasOwnProperty.call(obj, 'password'),
    'password must not appear in API response',
  ).toBe(false);
}

/**
 * Observed duplicate-email contract: 400 + misleading "bad format".
 * Tests assert observed behavior; see BUGS.md.
 */
export async function assertDuplicateAccountError(
  response: Response,
): Promise<CreateAccountResponseBody> {
  expect(response.status(), 'duplicate email observed as 400').toBe(400);
  const body = await parseAccountResponse(response);
  expect(body.error).toBe('bad format');
  expect(body.description).toBe('error creating account');
  expect(body.account).toBeUndefined();
  return body;
}

/**
 * Track whether POST /api/accounts fires. Use for client-side validation
 * negatives that must never reach the API.
 */
export function trackAccountsPosts(page: Page): {
  wasPosted: () => boolean;
} {
  let posted = false;
  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url().includes(ACCOUNTS_PATH)) {
      posted = true;
    }
  });
  return {
    wasPosted: () => posted,
  };
}
