import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { UserRole } from '@prisma/client';
import { AdminAccessType } from '@prisma/client';

export async function getSession() {
  return getServerSession(authOptions);
}

export function canAccessHusbandGuests(
  role: UserRole | undefined,
  access: string[] | undefined,
): boolean {
  if (role === 'SUPERADMIN') return true;
  return access?.includes(AdminAccessType.HUSBAND_GUESTS) ?? false;
}

export function canAccessWifeGuests(
  role: UserRole | undefined,
  access: string[] | undefined,
): boolean {
  if (role === 'SUPERADMIN') return true;
  return access?.includes(AdminAccessType.WIFE_GUESTS) ?? false;
}
