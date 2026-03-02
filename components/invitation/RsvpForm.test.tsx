import React from 'react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RsvpForm } from './RsvpForm';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('RsvpForm', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.clearAllMocks();
  });

  it('renders name input, attendance options and submit button', () => {
    render(<RsvpForm source="WIFE" />);

    expect(screen.getByLabelText('nameLabel')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'submit' })).toBeInTheDocument();
  });

  it('submits successfully and resets form for wife source', async () => {
    (global.fetch as unknown as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(<RsvpForm source="WIFE" />);

    const nameInput = screen.getByLabelText('nameLabel') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: 'submit' });

    fireEvent.change(nameInput, { target: { value: ' Guest ' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/guests/wife',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Guest', attendance: 'COMING' }),
        }),
      );
    });

    await waitFor(() => {
      expect(screen.getByText('success')).toBeInTheDocument();
    });

    expect(nameInput.value).toBe('');
  });

  it('submits to husband endpoint when source is HUSBAND', async () => {
    (global.fetch as unknown as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(<RsvpForm source="HUSBAND" />);

    const nameInput = screen.getByLabelText('nameLabel') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: 'submit' });

    fireEvent.change(nameInput, { target: { value: 'Guest' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/guests/husband', expect.any(Object));
    });
  });

  it('shows error message and keeps data on failed submit', async () => {
    (global.fetch as unknown as vi.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    render(<RsvpForm source="WIFE" />);

    const nameInput = screen.getByLabelText('nameLabel') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: 'submit' });

    fireEvent.change(nameInput, { target: { value: 'Guest' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('error')).toBeInTheDocument();
    });

    expect(nameInput.value).toBe('Guest');
  });

  it('disables inputs while loading to avoid double submits', async () => {
    let resolveFetch: (() => void) | null = null;

    (global.fetch as unknown as vi.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = () =>
            resolve({
              ok: true,
              json: async () => ({}),
            });
        }),
    );

    render(<RsvpForm source="WIFE" />);

    const nameInput = screen.getByLabelText('nameLabel') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: 'submit' });

    fireEvent.change(nameInput, { target: { value: 'Guest' } });
    fireEvent.click(submitButton);

    expect(nameInput).toBeDisabled();
    expect(submitButton).toBeDisabled();

    resolveFetch && resolveFetch();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
