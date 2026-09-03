'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  BellRing,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  ExternalLink,
  HeartHandshake,
  LayoutDashboard,
  Menu,
  Pencil,
  QrCode,
  ScanLine,
  Search,
  ShieldCheck,
  TicketCheck,
  UserRoundCheck,
  Users,
  Video,
  WalletCards,
  X,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type {
  Announcement,
  GroupRequest,
  OrderRow,
  RioEvent,
  TicketRow,
} from '@/lib/rio-db';

type DashboardData = {
  orders: OrderRow[];
  tickets: TicketRow[];
  groups: GroupRequest[];
  announcements: Announcement[];
  events: RioEvent[];
  totals: {
    revenue: number;
    event_payments: number;
    donations: number;
    donation_count: number;
  };
};
type Section =
  | 'summary'
  | 'payments'
  | 'tickets'
  | 'groups'
  | 'home'
  | 'scanner';

const nav: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'summary', label: 'Resumen', icon: LayoutDashboard },
  { id: 'payments', label: 'Pagos', icon: WalletCards },
  { id: 'tickets', label: 'Boletos', icon: TicketCheck },
  { id: 'scanner', label: 'Escanear QR', icon: ScanLine },
  { id: 'groups', label: 'Grupos nuevos', icon: Users },
  { id: 'home', label: 'Anuncios de portada', icon: BellRing },
];

export function PanelClient({
  data,
  userName,
  userEmail,
  stripeLabel,
  stripeConfigured,
}: {
  data: DashboardData;
  userName: string;
  userEmail: string;
  stripeLabel: string;
  stripeConfigured: boolean;
}) {
  const [section, setSection] = useState<Section>('summary');
  const [mobileNav, setMobileNav] = useState(false);
  const pendingGroups = data.groups.filter(
    (group) => group.status === 'pending',
  ).length;
  return (
    <main className="min-h-screen bg-[#eef1f6] text-rio-navy lg:grid lg:grid-cols-[250px_1fr]">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[270px] bg-rio-navy p-5 text-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:w-auto ${mobileNav ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center justify-between border-b border-white/12 pb-5">
          <a href="/" className="font-display text-2xl tracking-[.08em]">
            RÍO MX
          </a>
          <Button
            size="icon-sm"
            variant="ghost"
            className="text-white hover:bg-white/10 lg:hidden"
            onClick={() => setMobileNav(false)}
          >
            <X />
            <span className="sr-only">Cerrar</span>
          </Button>
        </div>
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[.18em] text-rio-mint">
          Panel de control
        </p>
        <nav className="mt-4 space-y-1" aria-label="Secciones del panel">
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setSection(id);
                setMobileNav(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${section === id ? 'bg-white text-rio-navy shadow-lg' : 'text-white/65 hover:bg-white/8 hover:text-white'}`}
            >
              <Icon className="size-4" />
              <span className="flex-1">{label}</span>
              {id === 'groups' && pendingGroups > 0 && (
                <span className="rounded-full bg-rio-coral px-2 py-0.5 text-[10px] font-bold text-white">
                  {pendingGroups}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/8 p-4">
          <p className="truncate text-sm font-semibold">{userName}</p>
          <p className="mt-1 truncate text-[11px] text-white/45">{userEmail}</p>
          <a
            href="/signout-with-chatgpt?return_to=/"
            className="mt-3 inline-block text-[11px] font-bold text-rio-mint"
          >
            Cerrar sesión
          </a>
        </div>
      </aside>

      <section className="min-w-0">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-rio-navy/8 bg-[#eef1f6]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileNav(true)}
            >
              <Menu />
              <span className="sr-only">Menú</span>
            </Button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">
                RÍO MX
              </p>
              <h1 className="text-xl font-semibold">
                {nav.find((item) => item.id === section)?.label}
              </h1>
            </div>
          </div>
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-sm font-semibold text-slate-500"
          >
            Ver sitio <ExternalLink className="size-4" />
          </a>
        </header>
        <div className="mx-auto max-w-[1500px] p-5 sm:p-8 lg:p-10">
          {section === 'summary' && (
            <Summary
              data={data}
              stripeLabel={stripeLabel}
              stripeConfigured={stripeConfigured}
              go={setSection}
            />
          )}
          {section === 'payments' && (
            <Payments orders={data.orders} events={data.events} />
          )}
          {section === 'tickets' && <Tickets tickets={data.tickets} />}
          {section === 'groups' && <Groups groups={data.groups} />}
          {section === 'home' && (
            <Announcements announcements={data.announcements} />
          )}
          {section === 'scanner' && <Scanner />}
        </div>
      </section>
    </main>
  );
}

function Summary({
  data,
  stripeLabel,
  stripeConfigured,
  go,
}: {
  data: DashboardData;
  stripeLabel: string;
  stripeConfigured: boolean;
  go: (section: Section) => void;
}) {
  const used = data.tickets.filter((ticket) => ticket.status === 'used').length;
  const pending = data.groups.filter(
    (group) => group.status === 'pending',
  ).length;
  const cards = [
    {
      label: 'Ingresos este mes',
      value: money(data.totals.revenue),
      helper: 'Encuentros + donativos',
      icon: CircleDollarSign,
      color: 'bg-rio-mint/25',
    },
    {
      label: 'Encuentros pagados',
      value: String(data.totals.event_payments),
      helper: 'Boletos de este mes',
      icon: TicketCheck,
      color: 'bg-rio-gold/25',
    },
    {
      label: 'Donativos',
      value: money(data.totals.donations),
      helper: `${data.totals.donation_count} aportaciones`,
      icon: HeartHandshake,
      color: 'bg-rio-coral/15',
    },
    {
      label: 'Ingresos validados',
      value: String(used),
      helper: `${data.tickets.length - used} boletos disponibles`,
      icon: UserRoundCheck,
      color: 'bg-blue-100',
    },
  ];
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow text-rio-coral">Hoy en RÍO</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-.04em]">
          Todo lo importante, en una sola vista.
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Datos del mes actual y accesos rápidos para el equipo.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgb(25_34_81/6%)]"
          >
            <div
              className={`grid size-10 place-items-center rounded-xl ${card.color}`}
            >
              <card.icon className="size-5" />
            </div>
            <p className="mt-6 text-3xl font-semibold tracking-[-.04em]">
              {card.value}
            </p>
            <p className="mt-1 text-sm font-semibold">{card.label}</p>
            <p className="mt-1 text-xs text-slate-400">{card.helper}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
        <div className="rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Movimientos recientes</p>
              <p className="mt-1 text-xs text-slate-400">
                Últimos pagos y donativos
              </p>
            </div>
            <Button variant="ghost" onClick={() => go('payments')}>
              Ver todos <ChevronRight />
            </Button>
          </div>
          <RecentOrders orders={data.orders.slice(0, 6)} />
        </div>
        <div className="space-y-5">
          <div
            className={`rounded-2xl p-5 ${stripeConfigured ? 'bg-rio-mint/25' : 'bg-rio-gold/30'}`}
          >
            <div className="flex items-start gap-3">
              {stripeConfigured ? (
                <ShieldCheck className="size-5 text-[#218c82]" />
              ) : (
                <Clock3 className="size-5 text-[#a85f00]" />
              )}
              <div>
                <p className="font-semibold">Stripe · {stripeLabel}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {stripeConfigured
                    ? 'Cuenta conectada y lista para recibir pagos.'
                    : 'Falta agregar las dos claves de Stripe para activar cobros reales.'}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => go('groups')}
            className="flex w-full items-center justify-between rounded-2xl bg-rio-navy p-5 text-left text-white"
          >
            <div>
              <p className="text-3xl font-semibold">{pending}</p>
              <p className="mt-1 text-sm text-white/60">grupos por revisar</p>
            </div>
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

function RecentOrders({ orders }: { orders: OrderRow[] }) {
  if (!orders.length)
    return (
      <Empty
        icon={BarChart3}
        title="Aún no hay movimientos"
        text="Los pagos confirmados y donativos aparecerán aquí."
      />
    );
  return (
    <div className="mt-5 divide-y divide-rio-navy/8">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center gap-3 py-3">
          <span
            className={`grid size-9 place-items-center rounded-full ${order.kind === 'event' ? 'bg-rio-mint/25' : 'bg-rio-coral/12'}`}
          >
            {order.kind === 'event' ? (
              <TicketCheck className="size-4" />
            ) : (
              <HeartHandshake className="size-4" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {order.customer_name}
            </p>
            <p className="truncate text-xs text-slate-400">
              {order.kind === 'event' ? order.event_title : 'Donativo'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">{money(order.amount_cents)}</p>
            <Status value={order.payment_status} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Payments({
  orders,
  events,
}: {
  orders: OrderRow[];
  events: RioEvent[];
}) {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [eventId, setEventId] = useState('all');
  const filtered = useMemo(
    () =>
      orders.filter(
        (order) =>
          (kind === 'all' || order.kind === kind) &&
          (eventId === 'all' || order.event_id === eventId) &&
          `${order.customer_name} ${order.customer_email}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [orders, query, kind, eventId],
  );
  return (
    <PanelSection
      title="Pagos y donativos"
      subtitle="Filtra por tipo, evento o persona para saber quién pagó qué."
    >
      <div className="mb-5 grid gap-3 rounded-2xl bg-white p-4 md:grid-cols-[1fr_190px_230px]">
        <label className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar persona o correo"
            className="h-10 pl-9"
          />
        </label>
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          className="h-10 rounded-lg border bg-white px-3 text-sm"
        >
          <option value="all">Todos los movimientos</option>
          <option value="event">Encuentros</option>
          <option value="donation">Donativos</option>
        </select>
        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="h-10 rounded-lg border bg-white px-3 text-sm"
        >
          <option value="all">Todos los eventos</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-hidden rounded-2xl bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Persona</TableHead>
              <TableHead>Concepto</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Monto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <p className="font-semibold">{order.customer_name}</p>
                  <p className="text-xs text-slate-400">
                    {order.customer_email}
                  </p>
                </TableCell>
                <TableCell>
                  {order.kind === 'event' ? (
                    <>
                      <p>{order.event_title}</p>
                      <p className="text-xs text-slate-400">
                        {order.ticket_type === 'attendee'
                          ? 'Encuentrista'
                          : 'Servidor'}
                      </p>
                    </>
                  ) : (
                    'Donativo'
                  )}
                </TableCell>
                <TableCell>{date(order.created_at)}</TableCell>
                <TableCell>
                  <Status value={order.payment_status} />
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {money(order.amount_cents)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!filtered.length && (
          <Empty
            icon={WalletCards}
            title="Sin resultados"
            text="Prueba otro filtro o espera el primer pago."
          />
        )}
      </div>
    </PanelSection>
  );
}

function Tickets({ tickets }: { tickets: TicketRow[] }) {
  return (
    <PanelSection
      title="Boletos de encuentros"
      subtitle="Cada QR se acepta una sola vez. El primer escaneo válido entrega la pulsera."
    >
      <div className="overflow-hidden rounded-2xl bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Persona</TableHead>
              <TableHead>Evento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>
                  <p className="font-semibold">{ticket.customer_name}</p>
                  <p className="text-xs text-slate-400">
                    {ticket.customer_email}
                  </p>
                </TableCell>
                <TableCell>{ticket.event_title}</TableCell>
                <TableCell>
                  {ticket.ticket_type === 'attendee'
                    ? 'Encuentrista'
                    : 'Servidor'}
                </TableCell>
                <TableCell>
                  <Status value={ticket.status} />
                </TableCell>
                <TableCell>
                  <a
                    href={`/boleto/${ticket.token}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-bold"
                  >
                    Abrir <ExternalLink className="size-3" />
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!tickets.length && (
          <Empty
            icon={QrCode}
            title="Aún no hay boletos"
            text="Se generan automáticamente cuando Stripe confirma un pago de Encuentro."
          />
        )}
      </div>
    </PanelSection>
  );
}

function Groups({ groups }: { groups: GroupRequest[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState('');
  async function review(id: string, status: 'approved' | 'rejected') {
    setBusy(id);
    await fetch(`/api/admin/groups/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setBusy('');
    router.refresh();
  }
  return (
    <PanelSection
      title="Solicitudes de grupos nuevos"
      subtitle="Revisa cada propuesta antes de aprobarla. Aquí ya no aparecen registros de comunidades."
    >
      <div className="grid gap-4">
        {groups.map((group) => (
          <article key={group.id} className="rounded-2xl bg-white p-5">
            <div className="flex flex-col justify-between gap-5 lg:flex-row">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{group.full_name}</h3>
                  <Status value={group.status} />
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {group.zone} · {group.preferred_day || 'Día por definir'}
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                  {group.notes || 'Sin notas adicionales.'}
                </p>
                <p className="mt-3 text-xs text-slate-400">
                  {group.email} · {group.phone} · {date(group.created_at)}
                </p>
              </div>
              {group.status === 'pending' && (
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="outline"
                    disabled={busy === group.id}
                    onClick={() => review(group.id, 'rejected')}
                  >
                    <XCircle /> Rechazar
                  </Button>
                  <Button
                    disabled={busy === group.id}
                    onClick={() => review(group.id, 'approved')}
                  >
                    <Check /> Aprobar
                  </Button>
                </div>
              )}
            </div>
          </article>
        ))}
        {!groups.length && (
          <div className="rounded-2xl bg-white">
            <Empty
              icon={Users}
              title="No hay solicitudes pendientes"
              text="Los registros de grupos nuevos llegarán aquí."
            />
          </div>
        )}
      </div>
    </PanelSection>
  );
}

function Announcements({ announcements }: { announcements: Announcement[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setStatus('');
    const response = await fetch('/api/admin/announcements', {
      method: 'POST',
      body: new FormData(e.currentTarget),
    });
    const data = (await response.json()) as { error?: string };
    setSaving(false);
    if (!response.ok) return setStatus(data.error || 'No fue posible guardar.');
    setStatus('Anuncio publicado. La portada se actualizará en segundos.');
    setEditing(null);
    e.currentTarget.reset();
    router.refresh();
  }
  async function toggle(announcement: Announcement) {
    await fetch('/api/admin/announcements', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: announcement.id,
        published: !announcement.published,
      }),
    });
    router.refresh();
  }
  return (
    <PanelSection
      title="Anuncios de portada"
      subtitle="Este es el único contenido editable del sitio. Puedes publicar tres anuncios o agregar todos los que necesites."
    >
      <div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <form
          key={editing?.id || 'new'}
          onSubmit={submit}
          className="h-fit rounded-2xl bg-white p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">
                {editing ? 'Editar anuncio' : 'Nuevo anuncio'}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                El video o imagen aparece en un cuadro al lado del texto.
              </p>
            </div>
            {editing && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setEditing(null)}
              >
                Cancelar
              </Button>
            )}
          </div>
          <input type="hidden" name="id" value={editing?.id || ''} />
          <input
            type="hidden"
            name="mediaUrl"
            value={editing?.media_url || ''}
          />
          <input
            type="hidden"
            name="mediaType"
            value={editing?.media_type || 'image'}
          />
          <div className="mt-5 grid gap-4">
            <Field label="Etiqueta">
              <Input
                name="eyebrow"
                required
                defaultValue={editing?.eyebrow}
                placeholder="Ej. 26–27 SEP"
              />
            </Field>
            <Field label="Título">
              <Input name="title" required defaultValue={editing?.title} />
            </Field>
            <Field label="Texto">
              <Textarea
                name="body"
                required
                defaultValue={editing?.body}
                className="min-h-24"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Texto del botón">
                <Input
                  name="ctaLabel"
                  required
                  defaultValue={editing?.cta_label}
                />
              </Field>
              <Field label="Enlace">
                <Input
                  name="ctaUrl"
                  required
                  defaultValue={editing?.cta_url || '#'}
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Orden">
                <Input
                  name="sortOrder"
                  type="number"
                  min="0"
                  defaultValue={editing?.sort_order || announcements.length + 1}
                />
              </Field>
              <Field label="Imagen o video">
                <Input
                  name="media"
                  type="file"
                  accept="image/*,video/*"
                  required={!editing?.media_url}
                />
              </Field>
            </div>
            <input type="hidden" name="published" value="true" />
            {status && (
              <p className="rounded-xl bg-rio-mint/20 p-3 text-sm">{status}</p>
            )}
            <Button
              type="submit"
              disabled={saving}
              className="h-11 rounded-full"
            >
              {saving
                ? 'Guardando…'
                : editing
                  ? 'Guardar cambios'
                  : 'Publicar anuncio'}{' '}
              <BellRing />
            </Button>
          </div>
        </form>
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <article
              key={announcement.id}
              className="grid grid-cols-[92px_1fr] gap-4 rounded-2xl bg-white p-3 sm:grid-cols-[120px_1fr]"
            >
              <div className="aspect-square overflow-hidden rounded-xl bg-rio-navy">
                {announcement.media_type === 'video' ? (
                  <video
                    src={announcement.media_url}
                    muted
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={announcement.media_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 py-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="eyebrow truncate text-rio-coral">
                      {announcement.eyebrow}
                    </p>
                    <h3 className="mt-2 truncate font-semibold">
                      {announcement.title}
                    </h3>
                  </div>
                  <Status
                    value={announcement.published ? 'published' : 'hidden'}
                  />
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                  {announcement.body}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing(announcement)}
                  >
                    <Pencil /> Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggle(announcement)}
                  >
                    {announcement.published ? 'Ocultar' : 'Publicar'}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </PanelSection>
  );
}

type Detector = {
  detect(source: HTMLVideoElement): Promise<{ rawValue: string }[]>;
};
type DetectorCtor = new (options: { formats: string[] }) => Detector;
function Scanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lock = useRef(false);
  const [scanning, setScanning] = useState(false);
  const [manual, setManual] = useState('');
  const [message, setMessage] = useState<{
    state: string;
    title: string;
    detail: string;
  } | null>(null);
  const [support, setSupport] = useState(true);
  async function validate(code: string) {
    if (lock.current) return;
    lock.current = true;
    const response = await fetch('/api/tickets/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const data = (await response.json()) as {
      state?: string;
      ticket?: TicketRow;
      error?: string;
    };
    const ticket = data.ticket;
    if (data.state === 'valid' && ticket)
      setMessage({
        state: 'valid',
        title: 'Boleto válido',
        detail: `${ticket.customer_name} · ${ticket.ticket_type === 'attendee' ? 'Encuentrista' : 'Servidor'}. Entrega una pulsera.`,
      });
    else if (data.state === 'used' && ticket)
      setMessage({
        state: 'used',
        title: 'Este boleto ya fue usado',
        detail: `${ticket.customer_name} · validado ${ticket.used_at ? date(ticket.used_at) : 'anteriormente'}. No entregues otra pulsera.`,
      });
    else
      setMessage({
        state: 'invalid',
        title: 'Boleto no válido',
        detail: data.error || 'No existe o fue cancelado.',
      });
    setScanning(false);
    window.setTimeout(() => {
      lock.current = false;
    }, 1200);
  }
  useEffect(() => {
    if (!scanning) return;
    let stream: MediaStream | null = null;
    let frame = 0;
    let stopped = false;
    (async () => {
      const DetectorClass = (
        window as unknown as { BarcodeDetector?: DetectorCtor }
      ).BarcodeDetector;
      if (!DetectorClass) {
        setSupport(false);
        setScanning(false);
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        const detector = new DetectorClass({ formats: ['qr_code'] });
        const scan = async () => {
          if (stopped || !videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes[0]?.rawValue) {
              await validate(codes[0].rawValue);
              return;
            }
          } catch {
            /* El siguiente cuadro vuelve a intentar. */
          }
          frame = requestAnimationFrame(scan);
        };
        scan();
      } catch {
        setSupport(false);
        setScanning(false);
      }
    })();
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [scanning]);
  return (
    <PanelSection
      title="Escáner de acceso"
      subtitle="Escanea el QR al entregar la pulsera. Si alguien presenta una copia, el sistema avisa que ya fue usado."
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="relative min-h-[420px] overflow-hidden rounded-3xl bg-rio-navy text-white">
          {scanning ? (
            <video
              ref={videoRef}
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center p-8 text-center">
              <div>
                <span className="mx-auto grid size-20 place-items-center rounded-full bg-white/10">
                  <ScanLine className="size-9 text-rio-mint" />
                </span>
                <h3 className="mt-5 text-2xl font-semibold">
                  Listo para validar
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/55">
                  Usa la cámara trasera y coloca el código dentro del cuadro.
                </p>
                <Button
                  className="mt-6 h-11 rounded-full bg-rio-mint text-rio-navy hover:bg-white"
                  onClick={() => {
                    setMessage(null);
                    setScanning(true);
                  }}
                >
                  Abrir cámara
                </Button>
              </div>
            </div>
          )}{' '}
          {scanning && (
            <div className="pointer-events-none absolute inset-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-3xl border-2 border-rio-mint shadow-[0_0_0_999px_rgb(0_0_0/30%)]" />
          )}
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-5">
            <p className="font-semibold">Ingresar código manualmente</p>
            <p className="mt-1 text-xs text-slate-400">
              Úsalo si el dispositivo no permite abrir la cámara.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                validate(manual);
              }}
              className="mt-4 space-y-3"
            >
              <Input
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                placeholder="RIO:..."
                className="h-11"
              />
              <Button
                type="submit"
                disabled={!manual.trim()}
                className="h-10 w-full"
              >
                Validar código
              </Button>
            </form>
            {!support && (
              <p className="mt-3 text-xs leading-5 text-rio-coral">
                La cámara QR no está disponible en este navegador. Puedes usar
                el código manual.
              </p>
            )}
          </div>
          {message && (
            <div
              className={`rounded-2xl p-5 ${message.state === 'valid' ? 'bg-rio-mint/30' : message.state === 'used' ? 'bg-rio-gold/35' : 'bg-rio-coral/15'}`}
            >
              {message.state === 'valid' ? (
                <Check className="size-7 text-[#218c82]" />
              ) : (
                <XCircle className="size-7 text-rio-coral" />
              )}
              <h3 className="mt-4 text-xl font-semibold">{message.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {message.detail}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setMessage(null);
                  setManual('');
                  lock.current = false;
                }}
              >
                Siguiente persona
              </Button>
            </div>
          )}
        </div>
      </div>
    </PanelSection>
  );
}

function PanelSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-7">
        <p className="eyebrow text-rio-coral">Administración</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-.04em]">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
function Empty({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof BarChart3;
  title: string;
  text: string;
}) {
  return (
    <div className="grid min-h-52 place-items-center p-8 text-center">
      <div>
        <Icon className="mx-auto size-8 text-slate-300" />
        <p className="mt-3 font-semibold">{title}</p>
        <p className="mt-1 text-sm text-slate-400">{text}</p>
      </div>
    </div>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}
function Status({ value }: { value: string }) {
  const labels: Record<string, string> = {
    paid: 'Pagado',
    pending: 'Pendiente',
    failed: 'Fallido',
    valid: 'Disponible',
    used: 'Usado',
    void: 'Cancelado',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    published: 'Publicado',
    hidden: 'Oculto',
  };
  const styles: Record<string, string> = {
    paid: 'bg-emerald-50 text-emerald-700',
    valid: 'bg-emerald-50 text-emerald-700',
    approved: 'bg-emerald-50 text-emerald-700',
    published: 'bg-emerald-50 text-emerald-700',
    pending: 'bg-amber-50 text-amber-700',
    used: 'bg-slate-100 text-slate-600',
    hidden: 'bg-slate-100 text-slate-600',
    failed: 'bg-red-50 text-red-700',
    rejected: 'bg-red-50 text-red-700',
    void: 'bg-red-50 text-red-700',
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${styles[value] || 'bg-slate-100 text-slate-600'}`}
    >
      {labels[value] || value}
    </span>
  );
}
function money(cents: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
function date(value: string) {
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}
