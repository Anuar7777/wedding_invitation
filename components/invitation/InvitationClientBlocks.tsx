'use client';

import dynamic from 'next/dynamic';

const CountdownTimer = dynamic(
  () => import('./CountdownTimer').then((m) => ({ default: m.CountdownTimer })),
  { ssr: false },
);

const Map2GIS = dynamic(() => import('./Map2GIS').then((m) => ({ default: m.Map2GIS })), {
  ssr: false,
});

export function InvitationClientBlocks() {
  return (
    <>
      <CountdownTimer />
      <Map2GIS />
    </>
  );
}
