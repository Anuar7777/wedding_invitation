import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { UserRole, AdminAccessType } from '@prisma/client';

const createAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  husbandAccess: z.boolean().optional(),
  wifeAccess: z.boolean().optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const role = (session.user as { role?: string }).role;
  if (role !== 'SUPERADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const parsed = createAdminSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    return NextResponse.json(
      { error: { email: ['User with this email already exists'] } },
      { status: 400 },
    );
  }

  const passwordHash = await hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  const accessTypes: AdminAccessType[] = [];
  if (parsed.data.husbandAccess) accessTypes.push(AdminAccessType.HUSBAND_GUESTS);
  if (parsed.data.wifeAccess) accessTypes.push(AdminAccessType.WIFE_GUESTS);

  for (const accessType of accessTypes) {
    await prisma.adminAccess.create({
      data: { userId: user.id, accessType },
    });
  }

  return NextResponse.json({ success: true, id: user.id, email: user.email }, { status: 201 });
}
