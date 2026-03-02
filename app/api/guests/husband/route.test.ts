import { describe, expect, it, vi, beforeEach } from 'vitest';
import { POST } from './route';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    guest: {
      create: vi.fn(),
    },
  },
}));

const prismaMock = (await import('@/lib/prisma')).prisma;

describe('POST /api/guests/husband', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 201 and success on valid payload', async () => {
    const request = new Request('http://localhost/api/guests/husband', {
      method: 'POST',
      body: JSON.stringify({ name: 'Guest', attendance: 'WITH_PARTNER' }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json).toEqual({ success: true });
    expect(prismaMock.guest.create).toHaveBeenCalledTimes(1);
  });

  it('returns 400 on invalid payload', async () => {
    const request = new Request('http://localhost/api/guests/husband', {
      method: 'POST',
      body: JSON.stringify({ name: '', attendance: 'COMING' }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toHaveProperty('error');
    expect(prismaMock.guest.create).not.toHaveBeenCalled();
  });

  it('returns 500 when prisma throws', async () => {
    prismaMock.guest.create.mockRejectedValueOnce(new Error('DB error'));

    const request = new Request('http://localhost/api/guests/husband', {
      method: 'POST',
      body: JSON.stringify({ name: 'Guest', attendance: 'COMING' }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ error: 'Failed to submit' });
  });
});
