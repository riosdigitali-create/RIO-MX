import { env } from 'cloudflare:workers';

export type RioEvent = {
  id: string;
  slug: string;
  title: string;
  starts_at: string;
  ends_at: string;
  venue: string;
  attendee_price: number;
  server_price: number;
  active: number;
};
export type Announcement = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  cta_label: string;
  cta_url: string;
  media_type: 'image' | 'video';
  media_url: string;
  sort_order: number;
  published: number;
  updated_at: string;
};
export type OrderRow = {
  id: string;
  kind: 'event' | 'donation';
  event_id: string | null;
  event_title: string | null;
  ticket_type: 'attendee' | 'server' | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  amount_cents: number;
  currency: string;
  payment_status: string;
  stripe_session_id: string | null;
  created_at: string;
  paid_at: string | null;
};
export type TicketRow = {
  id: string;
  order_id: string;
  token: string;
  status: 'valid' | 'used' | 'void';
  issued_at: string;
  used_at: string | null;
  used_by: string | null;
  customer_name: string;
  customer_email: string;
  ticket_type: 'attendee' | 'server';
  event_title: string;
  starts_at: string;
  venue: string;
};
export type GroupRequest = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  zone: string;
  preferred_day: string | null;
  notes: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
};

let schemaPromise: Promise<void> | null = null;
function db() {
  if (!env.DB) throw new Error('La base de datos de RÍO no está disponible.');
  return env.DB;
}

export async function ensureRioSchema() {
  schemaPromise ??= (async () => {
    const database = db();
    await database.batch([
      database.prepare(
        `CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL, starts_at TEXT NOT NULL, ends_at TEXT NOT NULL, venue TEXT NOT NULL, attendee_price INTEGER NOT NULL, server_price INTEGER NOT NULL, active INTEGER NOT NULL DEFAULT 1)`,
      ),
      database.prepare(
        `CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, kind TEXT NOT NULL, event_id TEXT, ticket_type TEXT, customer_name TEXT NOT NULL, customer_email TEXT NOT NULL, customer_phone TEXT, amount_cents INTEGER NOT NULL, currency TEXT NOT NULL DEFAULT 'mxn', payment_status TEXT NOT NULL DEFAULT 'pending', stripe_session_id TEXT UNIQUE, created_at TEXT NOT NULL, paid_at TEXT)`,
      ),
      database.prepare(
        `CREATE TABLE IF NOT EXISTS tickets (id TEXT PRIMARY KEY, order_id TEXT NOT NULL UNIQUE, token TEXT NOT NULL UNIQUE, status TEXT NOT NULL DEFAULT 'valid', issued_at TEXT NOT NULL, used_at TEXT, used_by TEXT)`,
      ),
      database.prepare(
        `CREATE TABLE IF NOT EXISTS group_requests (id TEXT PRIMARY KEY, full_name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, zone TEXT NOT NULL, preferred_day TEXT, notes TEXT, status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL, reviewed_at TEXT, reviewed_by TEXT)`,
      ),
      database.prepare(
        `CREATE TABLE IF NOT EXISTS announcements (id TEXT PRIMARY KEY, eyebrow TEXT NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL, cta_label TEXT NOT NULL, cta_url TEXT NOT NULL, media_type TEXT NOT NULL, media_url TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0, published INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL)`,
      ),
      database.prepare(
        'CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at)',
      ),
      database.prepare(
        'CREATE INDEX IF NOT EXISTS idx_orders_event_status ON orders(event_id, payment_status)',
      ),
      database.prepare(
        'CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status)',
      ),
      database.prepare(
        'CREATE INDEX IF NOT EXISTS idx_group_requests_status_created ON group_requests(status, created_at)',
      ),
      database.prepare(
        'CREATE INDEX IF NOT EXISTS idx_announcements_published_order ON announcements(published, sort_order)',
      ),
    ]);
    const now = new Date().toISOString();
    await database.batch([
      database
        .prepare(
          `INSERT OR IGNORE INTO events (id, slug, title, starts_at, ends_at, venue, attendee_price, server_price, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        )
        .bind(
          'evt-encuentro-sep-2026',
          'encuentro-septiembre-2026',
          'Encuentro RÍO · Septiembre',
          '2026-09-26T09:00:00-06:00',
          '2026-09-27T18:00:00-06:00',
          'Auditorio RÍO MX',
          160000,
          130000,
        ),
      database
        .prepare(
          `INSERT OR IGNORE INTO announcements (id, eyebrow, title, body, cta_label, cta_url, media_type, media_url, sort_order, published, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
        )
        .bind(
          'ann-encuentro',
          '26–27 SEP',
          'Tu Encuentro puede comenzar aquí',
          'Dos días para detenerte, escuchar a Dios y dar un paso nuevo acompañado de una comunidad.',
          'Reservar mi lugar',
          '#encuentros',
          'video',
          '/hero-worship.mp4',
          1,
          now,
        ),
      database
        .prepare(
          `INSERT OR IGNORE INTO announcements (id, eyebrow, title, body, cta_label, cta_url, media_type, media_url, sort_order, published, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
        )
        .bind(
          'ann-grupos',
          'GRUPOS NUEVOS',
          'Haz espacio para que otros encuentren familia',
          'Si quieres abrir un grupo nuevo, envía tu solicitud. El equipo de RÍO la revisará y te acompañará.',
          'Registrar grupo',
          '#grupos',
          'image',
          '/groups.webp',
          2,
          now,
        ),
      database
        .prepare(
          `INSERT OR IGNORE INTO announcements (id, eyebrow, title, body, cta_label, cta_url, media_type, media_url, sort_order, published, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
        )
        .bind(
          'ann-biblia',
          'LA BIBLIA Y NOSOTRAS',
          'Una conversación que también transforma',
          'Contenido, recursos y encuentros para crecer juntas alrededor de la Palabra.',
          'Conocer más',
          '#recursos',
          'image',
          '/bible.webp',
          3,
          now,
        ),
    ]);
    await database.prepare('PRAGMA optimize').run();
  })().catch((error) => {
    schemaPromise = null;
    throw error;
  });
  return schemaPromise;
}

export async function listAnnouncements(includeHidden = false) {
  await ensureRioSchema();
  const result = await db()
    .prepare(
      `SELECT * FROM announcements ${includeHidden ? '' : 'WHERE published = 1'} ORDER BY sort_order ASC, updated_at DESC`,
    )
    .all<Announcement>();
  return result.results;
}
export async function listEvents() {
  await ensureRioSchema();
  const result = await db()
    .prepare('SELECT * FROM events WHERE active = 1 ORDER BY starts_at ASC')
    .all<RioEvent>();
  return result.results;
}
export async function getEvent(id: string) {
  await ensureRioSchema();
  return db()
    .prepare('SELECT * FROM events WHERE id = ? AND active = 1')
    .bind(id)
    .first<RioEvent>();
}

export async function createOrder(input: {
  id: string;
  kind: 'event' | 'donation';
  eventId?: string;
  ticketType?: string;
  name: string;
  email: string;
  phone?: string;
  amountCents: number;
}) {
  await ensureRioSchema();
  await db()
    .prepare(
      `INSERT INTO orders (id, kind, event_id, ticket_type, customer_name, customer_email, customer_phone, amount_cents, currency, payment_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'mxn', 'pending', ?)`,
    )
    .bind(
      input.id,
      input.kind,
      input.eventId ?? null,
      input.ticketType ?? null,
      input.name,
      input.email,
      input.phone ?? null,
      input.amountCents,
      new Date().toISOString(),
    )
    .run();
}
export async function attachStripeSession(orderId: string, sessionId: string) {
  await db()
    .prepare('UPDATE orders SET stripe_session_id = ? WHERE id = ?')
    .bind(sessionId, orderId)
    .run();
}

export async function markOrderPaidAndIssueTicket(
  orderId: string,
  sessionId: string,
) {
  await ensureRioSchema();
  const order = await db()
    .prepare('SELECT id, kind FROM orders WHERE id = ?')
    .bind(orderId)
    .first<{ id: string; kind: string }>();
  if (!order) return null;
  const now = new Date().toISOString();
  const statements = [
    db()
      .prepare(
        `UPDATE orders SET payment_status = 'paid', stripe_session_id = ?, paid_at = COALESCE(paid_at, ?) WHERE id = ?`,
      )
      .bind(sessionId, now, orderId),
  ];
  if (order.kind === 'event')
    statements.push(
      db()
        .prepare(
          `INSERT OR IGNORE INTO tickets (id, order_id, token, status, issued_at) VALUES (?, ?, ?, 'valid', ?)`,
        )
        .bind(makeId('tkt'), orderId, secureToken(), now),
    );
  await db().batch(statements);
  return order.kind === 'event' ? getTicketByOrder(orderId) : null;
}

export async function getOrderBySession(sessionId: string) {
  await ensureRioSchema();
  return db()
    .prepare(
      `SELECT o.*, e.title AS event_title FROM orders o LEFT JOIN events e ON e.id = o.event_id WHERE o.stripe_session_id = ?`,
    )
    .bind(sessionId)
    .first<OrderRow>();
}
export async function getTicketByOrder(orderId: string) {
  await ensureRioSchema();
  return db()
    .prepare(
      `SELECT t.*, o.customer_name, o.customer_email, o.ticket_type, e.title AS event_title, e.starts_at, e.venue FROM tickets t JOIN orders o ON o.id = t.order_id JOIN events e ON e.id = o.event_id WHERE t.order_id = ?`,
    )
    .bind(orderId)
    .first<TicketRow>();
}
export async function getTicket(token: string) {
  await ensureRioSchema();
  return db()
    .prepare(
      `SELECT t.*, o.customer_name, o.customer_email, o.ticket_type, e.title AS event_title, e.starts_at, e.venue FROM tickets t JOIN orders o ON o.id = t.order_id JOIN events e ON e.id = o.event_id WHERE t.token = ?`,
    )
    .bind(token)
    .first<TicketRow>();
}

export async function redeemTicket(token: string, usedBy: string) {
  await ensureRioSchema();
  const ticket = await getTicket(token);
  if (!ticket) return { state: 'invalid' as const, ticket: null };
  if (ticket.status === 'used') return { state: 'used' as const, ticket };
  if (ticket.status !== 'valid') return { state: 'invalid' as const, ticket };
  const result = await db()
    .prepare(
      `UPDATE tickets SET status = 'used', used_at = ?, used_by = ? WHERE token = ? AND status = 'valid'`,
    )
    .bind(new Date().toISOString(), usedBy, token)
    .run();
  if ((result.meta.changes ?? 0) !== 1)
    return { state: 'used' as const, ticket: await getTicket(token) };
  return { state: 'valid' as const, ticket: await getTicket(token) };
}

export async function createGroupRequest(
  input: Omit<
    GroupRequest,
    'id' | 'status' | 'created_at' | 'reviewed_at' | 'reviewed_by'
  >,
) {
  await ensureRioSchema();
  const id = makeId('grp');
  await db()
    .prepare(
      `INSERT INTO group_requests (id, full_name, email, phone, zone, preferred_day, notes, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
    )
    .bind(
      id,
      input.full_name,
      input.email,
      input.phone,
      input.zone,
      input.preferred_day,
      input.notes,
      new Date().toISOString(),
    )
    .run();
  return id;
}
export async function reviewGroupRequest(
  id: string,
  status: 'approved' | 'rejected',
  reviewedBy: string,
) {
  await ensureRioSchema();
  return db()
    .prepare(
      'UPDATE group_requests SET status = ?, reviewed_at = ?, reviewed_by = ? WHERE id = ?',
    )
    .bind(status, new Date().toISOString(), reviewedBy, id)
    .run();
}

export async function saveAnnouncement(
  input: Omit<Announcement, 'updated_at'>,
) {
  await ensureRioSchema();
  await db()
    .prepare(
      `INSERT INTO announcements (id, eyebrow, title, body, cta_label, cta_url, media_type, media_url, sort_order, published, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET eyebrow=excluded.eyebrow, title=excluded.title, body=excluded.body, cta_label=excluded.cta_label, cta_url=excluded.cta_url, media_type=excluded.media_type, media_url=excluded.media_url, sort_order=excluded.sort_order, published=excluded.published, updated_at=excluded.updated_at`,
    )
    .bind(
      input.id,
      input.eyebrow,
      input.title,
      input.body,
      input.cta_label,
      input.cta_url,
      input.media_type,
      input.media_url,
      input.sort_order,
      input.published,
      new Date().toISOString(),
    )
    .run();
}
export async function getAnnouncement(id: string) {
  await ensureRioSchema();
  return db()
    .prepare('SELECT * FROM announcements WHERE id = ?')
    .bind(id)
    .first<Announcement>();
}

export async function getDashboardData() {
  await ensureRioSchema();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const [orders, tickets, groups, announcements, events, totals] =
    await Promise.all([
      db()
        .prepare(
          `SELECT o.*, e.title AS event_title FROM orders o LEFT JOIN events e ON e.id = o.event_id ORDER BY o.created_at DESC LIMIT 200`,
        )
        .all<OrderRow>(),
      db()
        .prepare(
          `SELECT t.*, o.customer_name, o.customer_email, o.ticket_type, e.title AS event_title, e.starts_at, e.venue FROM tickets t JOIN orders o ON o.id=t.order_id JOIN events e ON e.id=o.event_id ORDER BY t.issued_at DESC LIMIT 200`,
        )
        .all<TicketRow>(),
      db()
        .prepare(
          'SELECT * FROM group_requests ORDER BY created_at DESC LIMIT 200',
        )
        .all<GroupRequest>(),
      db()
        .prepare(
          'SELECT * FROM announcements ORDER BY sort_order ASC, updated_at DESC',
        )
        .all<Announcement>(),
      db()
        .prepare('SELECT * FROM events ORDER BY starts_at DESC')
        .all<RioEvent>(),
      db()
        .prepare(
          `SELECT COALESCE(SUM(CASE WHEN payment_status='paid' AND paid_at >= ? THEN amount_cents ELSE 0 END),0) AS revenue, COALESCE(SUM(CASE WHEN payment_status='paid' AND kind='event' AND paid_at >= ? THEN 1 ELSE 0 END),0) AS event_payments, COALESCE(SUM(CASE WHEN payment_status='paid' AND kind='donation' AND paid_at >= ? THEN amount_cents ELSE 0 END),0) AS donations, COALESCE(SUM(CASE WHEN payment_status='paid' AND kind='donation' AND paid_at >= ? THEN 1 ELSE 0 END),0) AS donation_count FROM orders`,
        )
        .bind(
          monthStart.toISOString(),
          monthStart.toISOString(),
          monthStart.toISOString(),
          monthStart.toISOString(),
        )
        .first<{
          revenue: number;
          event_payments: number;
          donations: number;
          donation_count: number;
        }>(),
    ]);
  return {
    orders: orders.results,
    tickets: tickets.results,
    groups: groups.results,
    announcements: announcements.results,
    events: events.results,
    totals: totals ?? {
      revenue: 0,
      event_payments: 0,
      donations: 0,
      donation_count: 0,
    },
  };
}

export function makeId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replaceAll('-', '')}`;
}
function secureToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}
