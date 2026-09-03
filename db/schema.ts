import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const events = sqliteTable(
  'events',
  {
    id: text('id').primaryKey(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    startsAt: text('starts_at').notNull(),
    endsAt: text('ends_at').notNull(),
    venue: text('venue').notNull(),
    attendeePrice: integer('attendee_price').notNull(),
    serverPrice: integer('server_price').notNull(),
    active: integer('active', { mode: 'boolean' }).notNull().default(true),
  },
  (table) => [uniqueIndex('idx_events_slug').on(table.slug)],
);

export const orders = sqliteTable(
  'orders',
  {
    id: text('id').primaryKey(),
    kind: text('kind').notNull(),
    eventId: text('event_id'),
    ticketType: text('ticket_type'),
    customerName: text('customer_name').notNull(),
    customerEmail: text('customer_email').notNull(),
    customerPhone: text('customer_phone'),
    amountCents: integer('amount_cents').notNull(),
    currency: text('currency').notNull().default('mxn'),
    paymentStatus: text('payment_status').notNull().default('pending'),
    stripeSessionId: text('stripe_session_id'),
    createdAt: text('created_at').notNull(),
    paidAt: text('paid_at'),
  },
  (table) => [
    index('idx_orders_created_at').on(table.createdAt),
    index('idx_orders_event_status').on(table.eventId, table.paymentStatus),
    uniqueIndex('idx_orders_stripe_session').on(table.stripeSessionId),
  ],
);

export const tickets = sqliteTable(
  'tickets',
  {
    id: text('id').primaryKey(),
    orderId: text('order_id').notNull(),
    token: text('token').notNull(),
    status: text('status').notNull().default('valid'),
    issuedAt: text('issued_at').notNull(),
    usedAt: text('used_at'),
    usedBy: text('used_by'),
  },
  (table) => [
    uniqueIndex('idx_tickets_order').on(table.orderId),
    uniqueIndex('idx_tickets_token').on(table.token),
    index('idx_tickets_status').on(table.status),
  ],
);

export const groupRequests = sqliteTable(
  'group_requests',
  {
    id: text('id').primaryKey(),
    fullName: text('full_name').notNull(),
    email: text('email').notNull(),
    phone: text('phone').notNull(),
    zone: text('zone').notNull(),
    preferredDay: text('preferred_day'),
    notes: text('notes'),
    status: text('status').notNull().default('pending'),
    createdAt: text('created_at').notNull(),
    reviewedAt: text('reviewed_at'),
    reviewedBy: text('reviewed_by'),
  },
  (table) => [
    index('idx_group_requests_status_created').on(
      table.status,
      table.createdAt,
    ),
  ],
);

export const announcements = sqliteTable(
  'announcements',
  {
    id: text('id').primaryKey(),
    eyebrow: text('eyebrow').notNull(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    ctaLabel: text('cta_label').notNull(),
    ctaUrl: text('cta_url').notNull(),
    mediaType: text('media_type').notNull(),
    mediaUrl: text('media_url').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    published: integer('published', { mode: 'boolean' })
      .notNull()
      .default(true),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [
    index('idx_announcements_published_order').on(
      table.published,
      table.sortOrder,
    ),
  ],
);
