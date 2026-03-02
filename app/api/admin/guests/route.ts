import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GuestSource } from '@prisma/client';

export type GuestRow = {
  id: string;
  name: string;
  attendance: string;
  source: string;
  createdAt: string;
};

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role;
  const access = (session.user as { access?: string[] }).access ?? [];

  const canHusband = role === 'SUPERADMIN' || access.includes('HUSBAND_GUESTS');
  const canWife = role === 'SUPERADMIN' || access.includes('WIFE_GUESTS');

  const searchParams = new URL(request.url).searchParams;
  const sourceParam = searchParams.get('source');

  let sources: GuestSource[] = [];
  if (sourceParam === 'HUSBAND' && canHusband) sources = [GuestSource.HUSBAND];
  else if (sourceParam === 'WIFE' && canWife) sources = [GuestSource.WIFE];
  else {
    if (canHusband) sources.push(GuestSource.HUSBAND);
    if (canWife) sources.push(GuestSource.WIFE);
  }

  if (sources.length === 0) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const guests = await prisma.guest.findMany({
    where: { source: { in: sources } },
    orderBy: { createdAt: 'desc' },
  });

  const rows: GuestRow[] = guests.map((g) => ({
    id: g.id,
    name: g.name,
    attendance: g.attendance,
    source: g.source,
    createdAt: g.createdAt.toISOString(),
  }));

  return NextResponse.json(rows);
}
