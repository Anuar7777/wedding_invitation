import { getLocale, getTranslations } from 'next-intl/server';

const EVENT_DATE = process.env.NEXT_PUBLIC_EVENT_DATE ?? '2025-09-07T17:00:00';

export async function CalendarSection() {
  const t = await getTranslations('invitation');
  const locale = await getLocale();
  const localeTag = locale === 'kz' ? 'kk-KZ' : 'ru-KZ';
  const d = new Date(EVENT_DATE);
  const dayName = d.toLocaleDateString(localeTag, { weekday: 'long' });
  const dateNum = d.getDate();
  const month = d.toLocaleDateString(localeTag, { month: 'long' });
  const year = d.getFullYear();
  const time = d.toLocaleTimeString(localeTag, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <section className="py-6 px-4">
      <h2 className="text-xl sm:text-2xl font-serif text-wedding-brown text-center mb-4">
        {t('whichDay')}
      </h2>
      <div className="bg-white/80 rounded-xl p-6 shadow-md border border-wedding-brown/10 text-center">
        <p className="text-wedding-maroon font-medium capitalize">{dayName}</p>
        <p className="text-4xl font-bold text-wedding-brown mt-1">{dateNum}</p>
        <p className="text-wedding-brown mt-1">{time}</p>
        <p className="text-lg text-wedding-brown mt-2 capitalize">{month}</p>
        <p className="text-wedding-brown">{year}</p>
      </div>
    </section>
  );
}
