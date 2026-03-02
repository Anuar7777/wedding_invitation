import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['kz', 'ru'],
  defaultLocale: 'kz',
  localePrefix: 'always',
});
