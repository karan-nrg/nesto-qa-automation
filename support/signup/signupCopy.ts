import type { AppLocale } from '@/config/locales';

export interface SignupCopy {
  fieldLabels: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    region: string;
    password: string;
    passwordConfirmation: string;
  };
  consentLabelContains: string;
  submit: string;
  errors: {
    required: string;
    invalidValue: string;
    invalidEmail: string;
    passwordMismatch: string;
    weakPassword: string;
    minCharactersRequired: (minLength: number) => string;
    genericError: string;
  };
}

const EN: SignupCopy = {
  fieldLabels: {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    phone: 'Phone number',
    region: 'Province of purchase',
    password: 'Password',
    passwordConfirmation: 'Confirm password',
  },
  consentLabelContains: 'contacted by nesto’s partners',
  submit: 'Create your account',
  errors: {
    required: 'The field is required',
    invalidValue: 'Invalid value',
    invalidEmail: 'Invalid email',
    passwordMismatch: 'Passwords do not match',
    weakPassword:
      'Password must contain at least one uppercase letter, one lowercase letter and one number',
    minCharactersRequired: (minLength) =>
      `Minimum of ${minLength} letters required`,
    genericError:
      'Something went wrong! Please try again and if you continue to have trouble feel free to contact your advisor',
  },
};

const FR: SignupCopy = {
  fieldLabels: {
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Courriel',
    phone: 'Téléphone',
    region: "Province de l'achat",
    password: 'Mot de passe',
    passwordConfirmation: 'Confirmation du mot de passe',
  },
  consentLabelContains: 'contacté par les partenaires de nesto',
  submit: 'Créez votre compte',
  errors: {
    required: 'Ce champ est obligatoire.',
    invalidValue: 'Valeur invalide.',
    invalidEmail: 'Courriel invalide',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    weakPassword:
      'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre',
    minCharactersRequired: (minLength) =>
      `Minimum de ${minLength} lettres requises`,
    genericError:
      "Quelque chose n'a pas fonctionné! Veuillez réessayer et si vous avez toujours des problèmes, n'hésitez pas à contacter votre conseiller",
  },
};

const COPY: Record<AppLocale, SignupCopy> = {
  en: EN,
  fr: FR,
};

export function signupCopyFor(locale: AppLocale): SignupCopy {
  return COPY[locale];
}
