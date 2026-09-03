import { NextResponse } from 'next/server';
import { markOrderPaidAndIssueTicket } from '@/lib/rio-db';
import { verifyStripeWebhook } from '@/lib/stripe';
type StripeEvent = {
  type?: string;
  data?: {
    object?: {
      id?: string;
      client_reference_id?: string;
      metadata?: { order_id?: string };
    };
  };
};
export async function POST(request: Request) {
  const payload = await request.text();
  if (
    !(await verifyStripeWebhook(
      payload,
      request.headers.get('stripe-signature'),
    ))
  )
    return NextResponse.json(
      { error: 'Firma de Stripe inválida.' },
      { status: 400 },
    );
  const event = JSON.parse(payload) as StripeEvent;
  if (event.type === 'checkout.session.completed') {
    const session = event.data?.object;
    const orderId = session?.client_reference_id || session?.metadata?.order_id;
    if (orderId && session?.id)
      await markOrderPaidAndIssueTicket(orderId, session.id);
  }
  return NextResponse.json({ received: true });
}
