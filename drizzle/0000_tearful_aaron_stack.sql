CREATE TABLE `announcements` (
	`id` text PRIMARY KEY NOT NULL,
	`eyebrow` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`cta_label` text NOT NULL,
	`cta_url` text NOT NULL,
	`media_type` text NOT NULL,
	`media_url` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_announcements_published_order` ON `announcements` (`published`,`sort_order`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`starts_at` text NOT NULL,
	`ends_at` text NOT NULL,
	`venue` text NOT NULL,
	`attendee_price` integer NOT NULL,
	`server_price` integer NOT NULL,
	`active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_events_slug` ON `events` (`slug`);--> statement-breakpoint
CREATE TABLE `group_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`zone` text NOT NULL,
	`preferred_day` text,
	`notes` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	`reviewed_at` text,
	`reviewed_by` text
);
--> statement-breakpoint
CREATE INDEX `idx_group_requests_status_created` ON `group_requests` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`event_id` text,
	`ticket_type` text,
	`customer_name` text NOT NULL,
	`customer_email` text NOT NULL,
	`customer_phone` text,
	`amount_cents` integer NOT NULL,
	`currency` text DEFAULT 'mxn' NOT NULL,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`stripe_session_id` text,
	`created_at` text NOT NULL,
	`paid_at` text
);
--> statement-breakpoint
CREATE INDEX `idx_orders_created_at` ON `orders` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_orders_event_status` ON `orders` (`event_id`,`payment_status`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_orders_stripe_session` ON `orders` (`stripe_session_id`);--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`token` text NOT NULL,
	`status` text DEFAULT 'valid' NOT NULL,
	`issued_at` text NOT NULL,
	`used_at` text,
	`used_by` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_tickets_order` ON `tickets` (`order_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_tickets_token` ON `tickets` (`token`);--> statement-breakpoint
CREATE INDEX `idx_tickets_status` ON `tickets` (`status`);