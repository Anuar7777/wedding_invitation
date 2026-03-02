'use client';

import { useState } from 'react';

export function CreateAdminForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [husbandAccess, setHusbandAccess] = useState(false);
  const [wifeAccess, setWifeAccess] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          husbandAccess,
          wifeAccess,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error?.email?.[0] ?? data.error ?? 'Failed');
        setStatus('error');
        return;
      }
      setStatus('success');
      setMessage(`Admin created: ${data.email}`);
      setEmail('');
      setPassword('');
      setHusbandAccess(false);
      setWifeAccess(false);
    } catch {
      setStatus('error');
      setMessage('Request failed');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white rounded-lg border border-gray-200 space-y-4 max-w-md"
    >
      <div>
        <label htmlFor="new-admin-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="new-admin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-maroon"
        />
      </div>
      <div>
        <label
          htmlFor="new-admin-password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          id="new-admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-maroon"
        />
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={husbandAccess}
            onChange={(e) => setHusbandAccess(e.target.checked)}
            className="rounded text-wedding-maroon"
          />
          <span className="text-sm text-gray-700">Husband guests</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={wifeAccess}
            onChange={(e) => setWifeAccess(e.target.checked)}
            className="rounded text-wedding-maroon"
          />
          <span className="text-sm text-gray-700">Wife guests</span>
        </label>
      </div>
      {message && (
        <p className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-4 py-2 bg-wedding-maroon text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50"
      >
        Create admin
      </button>
    </form>
  );
}
