'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

type GuestRow = {
  id: string;
  name: string;
  attendance: string;
  source: string;
  createdAt: string;
};

const SOURCE_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'HUSBAND', label: 'Husband' },
  { value: 'WIFE', label: 'Wife' },
];

export function GuestsTable() {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const [source, setSource] = useState('');
  const [guests, setGuests] = useState<GuestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const canHusband =
    role === 'SUPERADMIN' ||
    (session?.user as { access?: string[] })?.access?.includes('HUSBAND_GUESTS');
  const canWife =
    role === 'SUPERADMIN' ||
    (session?.user as { access?: string[] })?.access?.includes('WIFE_GUESTS');

  useEffect(() => {
    const params = new URLSearchParams();
    if (source) params.set('source', source);
    fetch(`/api/admin/guests?${params}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load');
        return r.json();
      })
      .then(setGuests)
      .catch(() => setError('Failed to load guests'))
      .finally(() => setLoading(false));
  }, [source]);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <div className="p-2 border-b border-gray-200 flex gap-2 items-center">
        <label htmlFor="source-filter" className="text-sm text-gray-600">
          Filter:
        </label>
        <select
          id="source-filter"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="text-sm border border-gray-300 rounded px-2 py-1"
        >
          {SOURCE_OPTIONS.filter(
            (o) =>
              o.value === '' ||
              (o.value === 'HUSBAND' && canHusband) ||
              (o.value === 'WIFE' && canWife),
          ).map((o) => (
            <option key={o.value || 'all'} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Name
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Attendance
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Source
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Created
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {guests.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                No guests yet
              </td>
            </tr>
          ) : (
            guests.map((g) => (
              <tr key={g.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-800">{g.name}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{g.attendance}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{g.source}</td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {new Date(g.createdAt).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
