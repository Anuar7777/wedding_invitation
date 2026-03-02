export const locales = ['kz', 'ru'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'kz';

export const localeNames: Record<Locale, string> = {
  kz: 'Қаз',
  ru: 'Рус',
};
