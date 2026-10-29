/**
 * The signup URL controls the app language.
 * Playwright's locale setting only controls browser language preferences.
 */
export type AppLocale = 'en' | 'fr';

export interface LocaleConfig {
  projectName: string;
  signupPath: string;
  getAQuotePath: string;
  browserLocale: string;
}

export const BASE_URL = 'https://app.qa.nesto.ca';

export const LOCALE_CONFIG: Record<AppLocale, LocaleConfig> = {
  en: {
    projectName: 'chromium-en',
    signupPath: '/signup',
    getAQuotePath: '/getaquote',
    browserLocale: 'en-CA',
  },
  fr: {
    projectName: 'chromium-fr',
    signupPath: '/fr/signup',
    getAQuotePath: '/getaquote/fr',
    browserLocale: 'fr-CA',
  },
};
