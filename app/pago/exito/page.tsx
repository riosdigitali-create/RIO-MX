import { CheckCircle2, Clock3, Heart, TicketCheck } from 'lucide-react';
import { getOrderBySession, getTicketByOrder } from '@/lib/rio-db';

export const dynamic = 'force-dynamic';
export default async function PaymentSuccess({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const sessionId = (await searchParams).session_id;
  const order = sessionId ? await getOrderBySession(sessionId) : null;
  const ticket =
    order?.payment_status === 'paid' && order.kind === 'event'
      ? await getTicketByOrder(order.id)
      : null;
  if (!order)
    return (
      <StateCard
        icon={Clock3}
        title="Estamos localizando tu pago"
        text="Verifica que abriste el enlace completo que recibiste al terminar en Stripe."
      />
    );
  if (order.payment_status !== 'paid')
    return (
      <StateCard
        icon={Clock3}
        title="Stripe está confirmando tu pago"
        text="Esta pantalla se actualizará cuando recibamos la confirmación. Normalmente toma unos segundos."
        refresh
      />
    );
  if (order.kind === 'donation')
    return (
      <StateCard
        icon={Heart}
        title="Gracias por tu generosidad"
        text={`Recibimos tu donativo de ${new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(order.amount_cents / 100)}.`}
      />
    );
  return (
    <StateCard
      icon={TicketCheck}
      title="Tu boleto está listo"
      text="Guárdalo en tu teléfono. El QR es individual y se valida una sola vez."
      ticketUrl={ticket ? `/boleto/${ticket.token}` : undefined}
    />
  );
}
function StateCard({
  icon: Icon,
  title,
  text,
  refresh,
  ticketUrl,
}: {
  icon: typeof Clock3;
  title: string;
  text: string;
  refresh?: boolean;
  ticketUrl?: string;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-rio-paper p-5">
      <div className="w-full max-w-lg rounded-[2rem] bg-white p-8 text-center shadow-[0_30px_80px_rgb(25_34_81/14%)] sm:p-12">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-rio-mint/25">
          <Icon className="size-7 text-rio-navy" />
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-.04em]">
          {title}
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-500">{text}</p>
        {ticketUrl && (
          <a
            href={ticketUrl}
            className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-rio-navy px-6 text-sm font-bold text-white"
          >
            Ver y descargar mi boleto <TicketCheck className="size-4" />
          </a>
        )}
        {refresh && (
          <a
            href=""
            className="mt-7 inline-flex h-11 items-center justify-center rounded-full border px-5 text-sm font-bold"
          >
            Volver a comprobar
          </a>
        )}
        <div>
          <a
            href="/"
            className="mt-6 inline-block text-xs font-bold text-slate-400"
          >
            Volver a RÍO MX
          </a>
        </div>
      </div>
    </main>
  );
}
