'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

export function MusicButton() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const t = useTranslations('hero');

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/audio/melody.mp3');
      audioRef.current.onplay = () => setPlaying(true);
      audioRef.current.onpause = () => setPlaying(false);
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex flex-col items-center justify-center gap-1 rounded-full w-14 h-14 sm:w-16 sm:h-16 bg-wedding-gold/90 text-white hover:bg-wedding-gold transition shadow-lg focus:outline-none focus:ring-2 focus:ring-wedding-brown"
      aria-label={t('musicHint')}
    >
      <span className="text-2xl" aria-hidden>
        {playing ? '⏸' : '▶'}
      </span>
      <span className="text-[10px] sm:text-xs leading-tight max-w-[4rem] text-center">
        {t('musicHint')}
      </span>
    </button>
  );
}
