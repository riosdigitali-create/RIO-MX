declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    FILES: R2Bucket;
    STRIPE_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
    STRIPE_ACCOUNT_LABEL?: string;
    ADMIN_EMAILS?: string;
    PUBLIC_SITE_URL?: string;
  }
}
