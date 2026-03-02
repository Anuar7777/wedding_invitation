import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { guestSchema } from '@/lib/validations/guest';
import { GuestSource } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = guestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    await prisma.guest.create({
      data: {
        name: parsed.data.name,
        attendance: parsed.data.attendance,
        source: GuestSource.HUSBAND,
      },
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    console.error('Guest create error:', e);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
