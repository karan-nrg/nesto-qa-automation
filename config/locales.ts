/**
 * The signup flow picks the locale via the signup URL (/signup vs /fr/signup).
 * Playwright `locale` only sets the browser language preference, and it does
 * not switch the app language.
 */
export type AppLocale = 'en' | 'fr';

export interface LocaleConfig {
  /** Name shown in Playwright reports (e.g. chromium-en) */
  projectName: string;
  /** App language this config represents */
  locale: AppLocale;
  /** Signup path for this language (/signup or /fr/signup) */
  signupPath: string;
  /** Post-signup get-a-quote path (/getaquote or /getaquote/fr) */
  getAQuotePath: string;
  /** Browser language preference (e.g. en-CA / fr-CA) */
  browserLocale: string;
}

export const BASE_URL = 'https://app.qa.nesto.ca';

export const LOCALE_CONFIG: Record<AppLocale, LocaleConfig> = {
  en: {
    projectName: 'chromium-en',
    locale: 'en',
    signupPath: '/signup',
    getAQuotePath: '/getaquote',
    browserLocale: 'en-CA',
  },
  fr: {
    projectName: 'chromium-fr',
    locale: 'fr',
    signupPath: '/fr/signup',
    getAQuotePath: '/getaquote/fr',
    browserLocale: 'fr-CA',
  },
};
