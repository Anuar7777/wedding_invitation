'use client';

import { useTranslations } from 'next-intl';

const BAITEREK_LAT = 51.1282;
const BAITEREK_LON = 71.4305;
const BAITEREK_2GIS_URL = `https://2gis.kz/astana/geo/${BAITEREK_LON}%2C${BAITEREK_LAT}`;

export function Map2GIS() {
  const t = useTranslations('invitation');

  return (
    <section className="py-8 px-4">
      <h2 className="text-xl sm:text-2xl font-serif text-wedding-brown text-center mb-4">
        {t('address')}
      </h2>
      <div className="max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg border border-wedding-brown/20">
        <iframe
          title="2GIS Baiterek"
          src={`https://2gis.kz/astana/embed/geo/${BAITEREK_LON},${BAITEREK_LAT}?m=${BAITEREK_LON},${BAITEREK_LAT}/16`}
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full"
        />
        <a
          href={BAITEREK_2GIS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center py-3 text-wedding-maroon font-medium hover:underline"
        >
          {t('openIn2GIS')}
        </a>
      </div>
    </section>
  );
}
