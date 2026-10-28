/**
 * App language is selected by URL path, not Accept-Language alone.
 * Playwright `locale` is set as a secondary browser hint only.
 */
export type AppLocale = 'en' | 'fr';

export interface LocaleConfig {
  /** Playwright project name */
  projectName: string;
  /** Application locale encoded in the signup URL */
  locale: AppLocale;
  /** Path appended to baseURL */
  signupPath: string;
  /** Secondary browser locale hint */
  browserLocale: string;
}

export const BASE_URL = 'https://app.qa.nesto.ca';

export const LOCALE_CONFIG: Record<AppLocale, LocaleConfig> = {
  en: {
    projectName: 'chromium-en',
    locale: 'en',
    signupPath: '/signup',
    browserLocale: 'en-CA',
  },
  fr: {
    projectName: 'chromium-fr',
    locale: 'fr',
    signupPath: '/fr/signup',
    browserLocale: 'fr-CA',
  },
};

export function localeFromProjectName(projectName: string): AppLocale {
  if (projectName === LOCALE_CONFIG.fr.projectName) {
    return 'fr';
  }
  if (projectName === LOCALE_CONFIG.en.projectName) {
    return 'en';
  }
  throw new Error(
    `Unknown Playwright project "${projectName}". Expected chromium-en or chromium-fr.`,
  );
}
