'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';
import { localeNames, type Locale } from '@/i18n';

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const otherLocale = locale === 'kz' ? 'ru' : 'kz';

  return (
    <Link
      href={pathname}
      locale={otherLocale}
      className="text-sm font-medium text-wedding-brown hover:underline underline-offset-2"
    >
      {localeNames[otherLocale as Locale]}
    </Link>
  );
}
