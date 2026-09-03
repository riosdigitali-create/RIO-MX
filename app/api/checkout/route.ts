import { NextResponse } from 'next/server';
import {
  attachStripeSession,
  createOrder,
  getEvent,
  makeId,
} from '@/lib/rio-db';
import { createStripeCheckout } from '@/lib/stripe';

type CheckoutInput = {
  kind?: 'event' | 'donation';
  eventId?: string;
  ticketType?: 'attendee' | 'server';
  name?: string;
  email?: string;
  phone?: string;
  amount?: number;
};
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutInput;
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    if (!name || !email || !/^\S+@\S+\.\S+$/.test(email))
      return NextResponse.json(
        { error: 'Completa tu nombre y un correo válido.' },
        { status: 400 },
      );
    let amountCents = 0;
    let productName = '';
    let eventId: string | undefined;
    let ticketType: 'attendee' | 'server' | undefined;
    if (body.kind === 'event') {
      if (!body.eventId || !body.ticketType)
        return NextResponse.json(
          { error: 'Selecciona el tipo de boleto.' },
          { status: 400 },
        );
      const event = await getEvent(body.eventId);
      if (!event)
        return NextResponse.json(
          { error: 'Este encuentro no está disponible.' },
          { status: 404 },
        );
      eventId = event.id;
      ticketType = body.ticketType;
      amountCents =
        ticketType === 'attendee' ? event.attendee_price : event.server_price;
      productName = `${event.title} · ${ticketType === 'attendee' ? 'Encuentrista' : 'Servidor'}`;
    } else if (body.kind === 'donation') {
      amountCents = Math.round(Number(body.amount) * 100);
      if (
        !Number.isFinite(amountCents) ||
        amountCents < 10000 ||
        amountCents > 100000000
      )
        return NextResponse.json(
          { error: 'El donativo mínimo es de $100 MXN.' },
          { status: 400 },
        );
      productName = 'Donativo a RÍO MX';
    } else
      return NextResponse.json(
        { error: 'Solicitud de pago inválida.' },
        { status: 400 },
      );
    const orderId = makeId('ord');
    await createOrder({
      id: orderId,
      kind: body.kind,
      eventId,
      ticketType,
      name,
      email,
      phone: body.phone?.trim(),
      amountCents,
    });
    const origin = new URL(request.url).origin;
    const checkout = await createStripeCheckout({
      mode: 'payment',
      success_url: `${origin}/pago/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?pago=cancelado#${body.kind === 'event' ? 'encuentros' : 'dar'}`,
      customer_email: email,
      client_reference_id: orderId,
      'metadata[order_id]': orderId,
      'metadata[kind]': body.kind,
      'line_items[0][quantity]': '1',
      'line_items[0][price_data][currency]': 'mxn',
      'line_items[0][price_data][unit_amount]': String(amountCents),
      'line_items[0][price_data][product_data][name]': productName,
      'line_items[0][price_data][product_data][description]':
        body.kind === 'event'
          ? `Acceso individual para ${name}. QR válido una sola vez.`
          : `Donativo de ${name}`,
    });
    await attachStripeSession(orderId, checkout.id);
    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    if (error instanceof Error && error.message === 'STRIPE_NOT_CONFIGURED')
      return NextResponse.json(
        {
          error:
            'La cuenta de Stripe de La Biblia y Nosotras está pendiente de vincularse.',
        },
        { status: 503 },
      );
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'No fue posible iniciar el pago.',
      },
      { status: 500 },
    );
  }
}
