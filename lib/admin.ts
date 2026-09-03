import { env } from 'cloudflare:workers';
import { getChatGPTUser, requireChatGPTUser } from '@/app/chatgpt-auth';

function emailAllowed(email: string) {
  const configured = (env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return configured.length === 0 || configured.includes(email.toLowerCase());
}
export async function requireAdminPage(returnTo: string) {
  const user = await requireChatGPTUser(returnTo);
  return { user, allowed: emailAllowed(user.email) };
}
export async function getAdminUser() {
  const user = await getChatGPTUser();
  if (!user || !emailAllowed(user.email)) return null;
  return user;
}
export function stripeAccountLabel() {
  return env.STRIPE_ACCOUNT_LABEL || 'La Biblia y Nosotras';
}
export function stripeIsConfigured() {
  return Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET);
}
