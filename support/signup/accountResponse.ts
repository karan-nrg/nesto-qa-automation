import type { Page, Response } from '@playwright/test';
import { BASE_URL } from '@/config/locales';

const ACCOUNTS_PATH = '/api/accounts';
const APP_ORIGIN = new URL(BASE_URL).origin;

export function isCreateAccountUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.origin === APP_ORIGIN && parsed.pathname === ACCOUNTS_PATH;
  } catch {
    return false;
  }
}

export interface AccountPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  region?: string;
  preferredLanguage?: string;
  leadDistributeConsentAgreement?: boolean;
}

export interface CreateAccountResponseBody {
  account?: AccountPayload;
  error?: string;
  description?: string;
}

/**
 * Wait for the account creation response for the given email.
 * This is invoked before submitting the form so the response isn't missed.
 */
export function waitForAccountCreationResponse(
  page: Page,
  email: string,
): Promise<Response> {
  return page.waitForResponse((response) => {
    const request = response.request();

    if (request.method() !== 'POST' || !isCreateAccountUrl(response.url())) {
      return false;
    }

    try {
      const body = request.postDataJSON() as { email?: string } | null;
      return body?.email === email;
    } catch {
      return false;
    }
  });
}
