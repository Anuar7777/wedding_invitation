import { getTranslations } from 'next-intl/server';
import { InvitationLayout } from '@/components/invitation/InvitationLayout';
import { CalendarSection } from '@/components/invitation/CalendarSection';
import { RsvpForm } from '@/components/invitation/RsvpForm';

export function generateStaticParams() {
  return [{ locale: 'kz' }, { locale: 'ru' }];
}

export default async function WifeInvitationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const t = await getTranslations('invitation');

  return (
    <InvitationLayout
      heroTitle={
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-wedding-brown px-4">
          Қыз ұзату — Невеста жағы
        </h1>
      }
      invitationContent={
        <div className="bg-white/80 rounded-xl p-6 shadow-md border border-wedding-brown/10 space-y-4">
          <h2 className="text-xl font-serif text-wedding-maroon">{t('greeting')}</h2>
          <p className="text-wedding-brown leading-relaxed">{t('body')}</p>
        </div>
      }
      calendarSection={<CalendarSection />}
      rsvpSection={<RsvpForm source="WIFE" />}
    />
  );
}
