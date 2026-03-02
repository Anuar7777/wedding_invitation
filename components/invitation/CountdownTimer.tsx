'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const EVENT_DATE = process.env.NEXT_PUBLIC_EVENT_DATE ?? '2025-09-07T17:00:00';

function parseRemaining(target: Date) {
  const now = new Date();
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);
  return { days, hours, minutes, seconds };
}

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

export function CountdownTimer() {
  const t = useTranslations('invitation');
  const target = new Date(EVENT_DATE);
  const [rem, setRem] = useState(() => parseRemaining(target));

  useEffect(() => {
    const id = setInterval(() => setRem(parseRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target.getTime()]);

  return (
    <section className="py-8 px-4 text-center">
      <h2 className="text-xl sm:text-2xl font-serif text-wedding-brown mb-4">{t('untilEvent')}</h2>
      <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
        <div className="flex flex-col items-center min-w-[4rem]">
          <span className="text-2xl sm:text-4xl font-bold text-wedding-maroon tabular-nums">
            {pad(rem.days)}
          </span>
          <span className="text-xs sm:text-sm text-wedding-brown">{t('days')}</span>
        </div>
        <span className="text-2xl sm:text-4xl font-bold text-wedding-maroon self-end pb-2">:</span>
        <div className="flex flex-col items-center min-w-[4rem]">
          <span className="text-2xl sm:text-4xl font-bold text-wedding-maroon tabular-nums">
            {pad(rem.hours)}
          </span>
          <span className="text-xs sm:text-sm text-wedding-brown">{t('hours')}</span>
        </div>
        <span className="text-2xl sm:text-4xl font-bold text-wedding-maroon self-end pb-2">:</span>
        <div className="flex flex-col items-center min-w-[4rem]">
          <span className="text-2xl sm:text-4xl font-bold text-wedding-maroon tabular-nums">
            {pad(rem.minutes)}
          </span>
          <span className="text-xs sm:text-sm text-wedding-brown">{t('minutes')}</span>
        </div>
        <span className="text-2xl sm:text-4xl font-bold text-wedding-maroon self-end pb-2">:</span>
        <div className="flex flex-col items-center min-w-[4rem]">
          <span className="text-2xl sm:text-4xl font-bold text-wedding-maroon tabular-nums">
            {pad(rem.seconds)}
          </span>
          <span className="text-xs sm:text-sm text-wedding-brown">{t('seconds')}</span>
        </div>
      </div>
    </section>
  );
}
