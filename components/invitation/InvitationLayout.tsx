import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { MusicButton } from './MusicButton';
import { InvitationClientBlocks } from './InvitationClientBlocks';

export function InvitationLayout({
  heroTitle,
  invitationContent,
  calendarSection,
  rsvpSection,
}: {
  heroTitle: React.ReactNode;
  invitationContent: React.ReactNode;
  calendarSection: React.ReactNode;
  rsvpSection: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-wedding-cream text-wedding-brown">
      <header className="sticky top-0 z-10 flex justify-end p-4 bg-wedding-cream/95 backdrop-blur">
        <LocaleSwitcher />
      </header>

      <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="absolute top-1/2 right-4 sm:right-8 transform -translate-y-1/2 z-10">
          <MusicButton />
        </div>
        {heroTitle}
        <span className="mt-6 text-wedding-brown/80 text-sm animate-bounce" aria-hidden>
          ↓
        </span>
      </section>

      <section className="py-8 px-4 max-w-2xl mx-auto">{invitationContent}</section>

      <section className="py-6 px-4 max-w-2xl mx-auto">{calendarSection}</section>

      <InvitationClientBlocks />

      <section className="py-8 px-4 max-w-2xl mx-auto">{rsvpSection}</section>
    </main>
  );
}
