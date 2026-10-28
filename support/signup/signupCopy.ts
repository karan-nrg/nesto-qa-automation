import type { AppLocale } from '../../config/locales';

/**
 * Expected UI strings for assertions — only what the suite needs, not a full i18n dump.
 * Sourced from live `__NEXT_DATA__` on app.qa.nesto.ca (Oct 2026).
 */
export interface SignupCopy {
  /** Visible page title text (tenant slug interpolated at runtime — match substring). */
  titleContains: string;
  placeholders: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    region: string;
    password: string;
    passwordConfirmation: string;
  };
  passwordHelper: string;
  consent: string;
  submit: string;
  submitHelperContains: string;
  errors: {
    required: string;
    invalidEmail: string;
    invalidName: string;
    passwordMismatch: string;
    weakPassword: string;
    /** Observed wording uses "letters" for character counts — likely defect. */
    minCharactersRequired: (minChar: number) => string;
    maxCharactersRequired: (maxChar: number) => string;
    genericError: string;
  };
  /** Observed API body for duplicate email — misleading "bad format". */
  duplicateApiError: {
    error: string;
    description: string;
  };
}

const EN: SignupCopy = {
  titleContains: 'Create a',
  placeholders: {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    phone: 'Phone number',
    region: 'Province of purchase',
    password: 'Password',
    passwordConfirmation: 'Confirm password',
  },
  passwordHelper:
    'Password must be between 12 and 32 characters and contain one uppercase letter, one lowercase letter and one number.',
  consent:
    'By checking this box, you agree to be contacted by nesto’s partners for the purposes of offering you financial products. You agree to nesto sharing your mortgage information with its partners. You can opt-out at any time.',
  submit: 'Create your account',
  submitHelperContains: 'Terms of Service',
  errors: {
    required: 'The field is required',
    invalidEmail: 'Invalid email',
    invalidName: 'Invalid name',
    passwordMismatch: 'Passwords do not match',
    weakPassword:
      'Password must contain at least one uppercase letter, one lowercase letter and one number',
    minCharactersRequired: (minChar) =>
      `Minimum of ${minChar} letters required`,
    maxCharactersRequired: (maxChar) =>
      `Maximum of ${maxChar} letters required`,
    genericError:
      'Something went wrong! Please try again and if you continue to have trouble feel free to contact your advisor',
  },
  duplicateApiError: {
    error: 'bad format',
    description: 'error creating account',
  },
};

const FR: SignupCopy = {
  titleContains: 'Créez un compte',
  placeholders: {
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Courriel',
    phone: 'Téléphone',
    region: "Province de l'achat",
    password: 'Mot de passe',
    passwordConfirmation: 'Confirmation du mot de passe',
  },
  // Observed FR grammar defect: "au entre" (should be "entre").
  passwordHelper:
    'Le mot de passe doit contenir au entre 12 et 32 caractères et contenir au moins une lettre majuscule, une lettre minuscule et un chiffre.',
  // FR consent adds an extra clause vs EN about inability to provide services.
  consent:
    'En cochant cette case, vous acceptez d’être contacté par les partenaires de nesto dans le but de vous proposer des produits financiers. Vous acceptez que nesto partage vos informations de demande hypothécaire avec ses partenaires, si nous ne sommes pas en mesure de vous fournir nos services. Vous pouvez vous désinscrire à tout moment.',
  submit: 'Créez votre compte',
  submitHelperContains: "Conditions d'utilisation",
  errors: {
    required: 'Ce champ est obligatoire.',
    invalidEmail: 'Courriel invalide',
    invalidName: 'Nom invalide',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    weakPassword:
      'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre',
    minCharactersRequired: (minChar) =>
      `Minimum de ${minChar} lettres requises`,
    maxCharactersRequired: (maxChar) =>
      `Maximum de ${maxChar} lettres requises`,
    genericError:
      "Quelque chose n'a pas fonctionné! Veuillez réessayer et si vous avez toujours des problèmes, n'hésitez pas à contacter votre conseiller",
  },
  duplicateApiError: {
    error: 'bad format',
    description: 'error creating account',
  },
};

const COPY: Record<AppLocale, SignupCopy> = {
  en: EN,
  fr: FR,
};

export function signupCopyFor(locale: AppLocale): SignupCopy {
  return COPY[locale];
}
