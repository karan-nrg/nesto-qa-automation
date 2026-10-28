import fs from 'node:fs';
import path from 'node:path';
import type { AppLocale } from '../../config/locales';

/**
 * Tiny gitignored store so the EN duplicate-email test can reuse the email
 * from the EN success create — 0 extra account creates (see ASSUMPTIONS.md).
 * Never stores passwords or tokens.
 */
export interface LastCreatedAccount {
  email: string;
  locale: AppLocale;
  createdAt: string;
}

const STORE_PATH = path.join(__dirname, 'lastCreatedAccount.json');

export function saveLastCreatedAccount(record: LastCreatedAccount): void {
  fs.writeFileSync(STORE_PATH, JSON.stringify(record, null, 2), 'utf8');
}

export function readLastCreatedAccount(): LastCreatedAccount | null {
  if (!fs.existsSync(STORE_PATH)) {
    return null;
  }
  try {
    return JSON.parse(
      fs.readFileSync(STORE_PATH, 'utf8'),
    ) as LastCreatedAccount;
  } catch {
    return null;
  }
}
