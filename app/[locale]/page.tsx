import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('hero');
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 bg-wedding-cream">
      <h1 className="text-3xl md:text-4xl font-serif text-wedding-brown text-center">
        {t('title')}
      </h1>
      <nav className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/invitation/husband"
          className="px-6 py-3 rounded-lg bg-wedding-maroon text-white font-medium hover:opacity-90 transition"
        >
          Жених жағы
        </Link>
        <Link
          href="/invitation/wife"
          className="px-6 py-3 rounded-lg bg-wedding-brown text-white font-medium hover:opacity-90 transition"
        >
          Невеста жағы
        </Link>
      </nav>
    </main>
  );
}
