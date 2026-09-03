import { env } from 'cloudflare:workers';

export async function createStripeCheckout(fields: Record<string, string>) {
  if (!env.STRIPE_SECRET_KEY) throw new Error('STRIPE_NOT_CONFIGURED');
  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(fields),
  });
  const payload = (await response.json()) as {
    id?: string;
    url?: string;
    error?: { message?: string };
  };
  if (!response.ok || !payload.id || !payload.url)
    throw new Error(
      payload.error?.message || 'No fue posible iniciar el pago.',
    );
  return { id: payload.id, url: payload.url };
}
export async function verifyStripeWebhook(
  payload: string,
  signatureHeader: string | null,
) {
  if (!env.STRIPE_WEBHOOK_SECRET || !signatureHeader) return false;
  const parts = signatureHeader.split(',').map((part) => part.split('='));
  const timestamp = parts.find(([key]) => key === 't')?.[1];
  const signatures = parts
    .filter(([key]) => key === 'v1')
    .map(([, value]) => value);
  if (
    !timestamp ||
    !signatures.length ||
    Math.abs(Date.now() / 1000 - Number(timestamp)) > 300
  )
    return false;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(env.STRIPE_WEBHOOK_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${timestamp}.${payload}`),
  );
  const expected = [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
  return signatures.some((signature) => safeEqual(expected, signature));
}
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i += 1)
    difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}
