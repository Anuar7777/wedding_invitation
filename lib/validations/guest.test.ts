import { describe, expect, it } from 'vitest';
import { guestSchema } from './guest';

describe('guestSchema', () => {
  it('accepts valid name and attendance', () => {
    const result = guestSchema.safeParse({
      name: 'Иван Иванов',
      attendance: 'COMING',
    });

    expect(result.success).toBe(true);
  });

  it('trims name but allows technically empty strings (no extra strictness)', () => {
    const result = guestSchema.safeParse({
      name: '   ',
      attendance: 'COMING',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('');
    }
  });

  it('rejects too long name', () => {
    const longName = 'a'.repeat(501);
    const result = guestSchema.safeParse({
      name: longName,
      attendance: 'COMING',
    });

    expect(result.success).toBe(false);
  });

  it('allows names with special characters and potential scripts', () => {
    const trickyName = '<script>alert("xss")</script> 😄 أحمد';
    const result = guestSchema.safeParse({
      name: trickyName,
      attendance: 'WITH_PARTNER',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toContain('<script>');
    }
  });
});
