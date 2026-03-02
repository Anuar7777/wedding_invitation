import { z } from 'zod';

export const guestSchema = z.object({
  name: z.string().min(1, 'Name is required').max(500).trim(),
  attendance: z.enum(['COMING', 'WITH_PARTNER', 'NOT_COMING']),
});

export type GuestPayload = z.infer<typeof guestSchema>;
