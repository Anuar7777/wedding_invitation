'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
type Source = 'HUSBAND' | 'WIFE';
type Attendance = 'COMING' | 'WITH_PARTNER' | 'NOT_COMING';

export function RsvpForm({ source }: { source: Source }) {
  const t = useTranslations('invitation');
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState<Attendance>('COMING');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const endpoint = source === 'HUSBAND' ? '/api/guests/husband' : '/api/guests/wife';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), attendance }),
      });
      if (!res.ok) throw new Error('Submit failed');
      setStatus('success');
      setName('');
      setAttendance('COMING');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="py-8 px-4">
      <h2 className="text-xl sm:text-2xl font-serif text-wedding-brown text-center mb-6">
        {t('rsvpTitle')}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 rounded-xl p-6 shadow-md border border-wedding-brown/10 space-y-6"
      >
        <div>
          <label htmlFor="guest-name" className="block text-sm font-medium text-wedding-brown mb-1">
            {t('nameLabel')}
          </label>
          <input
            id="guest-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('namePlaceholder')}
            required
            className="w-full px-4 py-2 rounded-lg border border-wedding-brown/30 focus:ring-2 focus:ring-wedding-gold focus:border-wedding-gold outline-none"
            disabled={status === 'loading'}
          />
        </div>
        <fieldset>
          <legend className="block text-sm font-medium text-wedding-brown mb-2">
            {t('attendance.coming')} / {t('attendance.withPartner')} / {t('attendance.notComing')}
          </legend>
          <div className="space-y-2">
            {(
              [
                ['COMING', t('attendance.coming')],
                ['WITH_PARTNER', t('attendance.withPartner')],
                ['NOT_COMING', t('attendance.notComing')],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="attendance"
                  value={value}
                  checked={attendance === value}
                  onChange={() => setAttendance(value)}
                  className="text-wedding-maroon focus:ring-wedding-gold"
                  disabled={status === 'loading'}
                />
                <span className="text-wedding-brown">{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {status === 'success' && (
          <p className="text-green-700 text-sm font-medium">{t('success')}</p>
        )}
        {status === 'error' && <p className="text-red-700 text-sm font-medium">{t('error')}</p>}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-3 rounded-lg bg-wedding-maroon text-white font-medium hover:opacity-90 disabled:opacity-50 transition"
        >
          {status === 'loading' ? '...' : t('submit')}
        </button>
      </form>
    </section>
  );
}
