import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GuestsTable } from '@/components/admin/GuestsTable';
import { CreateAdminForm } from '@/components/admin/CreateAdminForm';
import { SignOutButton } from '@/components/admin/SignOutButton';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isSuperAdmin = role === 'SUPERADMIN';

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">Admin</h1>
          <SignOutButton />
        </header>

        {isSuperAdmin && (
          <section>
            <h2 className="text-lg font-medium text-gray-800 mb-4">Create admin</h2>
            <CreateAdminForm />
          </section>
        )}

        <section>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Guests</h2>
          <GuestsTable />
        </section>
      </div>
    </main>
  );
}
