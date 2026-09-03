import type { Metadata } from 'next';
import {
  CalendarDays,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  TicketCheck,
} from 'lucide-react';
import { notFound } from 'next/navigation';
import QRCode from 'qrcode';
import { getTicket } from '@/lib/rio-db';
import { TicketActions } from '@/components/rio/ticket-actions';

export const dynamic = 'force-dynamic';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const ticket = await getTicket((await params).token);
  if (!ticket) return { title: 'Boleto no encontrado · RÍO MX' };
  return {
    title: `${ticket.event_title} · ${ticket.customer_name}`,
    description: `Boleto individual de ${ticket.customer_name} para ${ticket.event_title}.`,
    openGraph: {
      title: `${ticket.event_title} · ${ticket.customer_name}`,
      description: 'Boleto individual RÍO MX',
      images: [],
    },
    twitter: {
      title: `${ticket.event_title} · ${ticket.customer_name}`,
      description: 'Boleto individual RÍO MX',
      images: [],
    },
  };
}
export default async function TicketPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const ticket = await getTicket(token);
  if (!ticket) notFound();
  const qr = await QRCode.toString(`RIO:${ticket.token}`, {
    type: 'svg',
    margin: 1,
    width: 360,
    color: { dark: '#192251', light: '#ffffff' },
    errorCorrectionLevel: 'H',
  });
  return (
    <main className="min-h-screen bg-rio-paper p-4 py-10 sm:p-8">
      <div className="mx-auto mb-5 flex max-w-4xl items-center justify-between print:hidden">
        <a href="/" className="font-display text-2xl tracking-[.08em]">
          RÍO MX
        </a>
        <TicketActions />
      </div>
      <article className="ticket mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_90px_rgb(25_34_81/16%)]">
        <div className="grid lg:grid-cols-[1fr_390px]">
          <div className="relative overflow-hidden bg-rio-navy p-8 text-white sm:p-12">
            <div className="grain absolute inset-0 opacity-20" />
            <div className="relative">
              <div className="flex items-center gap-2 text-rio-mint">
                <TicketCheck className="size-5" />
                <p className="eyebrow">Boleto individual</p>
              </div>
              <h1 className="mt-8 font-display text-6xl leading-[.85] sm:text-7xl">
                ENCUENTRO
                <br />
                RÍO
              </h1>
              <p className="mt-7 text-xl font-semibold">
                {ticket.customer_name}
              </p>
              <p className="mt-1 text-sm text-white/55">
                {ticket.ticket_type === 'attendee'
                  ? 'Encuentrista'
                  : 'Servidor'}
              </p>
              <div className="mt-10 grid gap-4 border-t border-white/15 pt-7 text-sm text-white/70 sm:grid-cols-2">
                <p className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-rio-mint" />{' '}
                  {new Intl.DateTimeFormat('es-MX', {
                    dateStyle: 'long',
                  }).format(new Date(ticket.starts_at))}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="size-4 text-rio-mint" /> {ticket.venue}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div
              className="w-full max-w-[300px]"
              dangerouslySetInnerHTML={{ __html: qr }}
            />
            <div
              className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${ticket.status === 'valid' ? 'bg-rio-mint/25 text-[#16756c]' : 'bg-rio-gold/30 text-[#925700]'}`}
            >
              {ticket.status === 'valid' ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <ShieldCheck className="size-4" />
              )}
              {ticket.status === 'valid'
                ? 'LISTO PARA USAR'
                : ticket.status === 'used'
                  ? 'BOLETO YA UTILIZADO'
                  : 'BOLETO CANCELADO'}
            </div>
            <p className="mt-5 max-w-xs text-xs leading-5 text-slate-400">
              Este código corresponde a una sola persona y se valida una sola
              vez. Preséntalo para recibir tu pulsera.
            </p>
            <p className="mt-5 font-mono text-[10px] tracking-[.14em] text-slate-300">
              {ticket.id.toUpperCase()}
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
