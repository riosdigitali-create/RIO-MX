import { ShieldAlert } from 'lucide-react';
import {
  requireAdminPage,
  stripeAccountLabel,
  stripeIsConfigured,
} from '@/lib/admin';
import { getDashboardData } from '@/lib/rio-db';
import { PanelClient } from '@/components/rio/panel-client';

export const dynamic = 'force-dynamic';

export default async function PanelPage() {
  const { user, allowed } = await requireAdminPage('/panel');
  if (!allowed) {
    return (
      <main className="grid min-h-screen place-items-center bg-rio-paper p-6">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <ShieldAlert className="mx-auto size-10 text-rio-coral" />
          <h1 className="mt-4 text-2xl font-semibold">Acceso restringido</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Tu cuenta está identificada, pero no está incluida en el equipo
            autorizado del panel.
          </p>
          <a
            href="/"
            className="mt-6 inline-block text-sm font-bold text-rio-navy"
          >
            Volver a la portada
          </a>
        </div>
      </main>
    );
  }
  const data = await getDashboardData();
  return (
    <PanelClient
      data={data}
      userName={user.displayName}
      userEmail={user.email}
      stripeLabel={stripeAccountLabel()}
      stripeConfigured={stripeIsConfigured()}
    />
  );
}
