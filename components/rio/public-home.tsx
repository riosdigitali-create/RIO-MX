'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Heart,
  LockKeyhole,
  MapPin,
  Menu,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Announcement, RioEvent } from '@/lib/rio-db';

type CheckoutKind = 'attendee' | 'server';

export function PublicHome({
  initialAnnouncements,
  events,
}: {
  initialAnnouncements: Announcement[];
  events: RioEvent[];
}) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [checkout, setCheckout] = useState<CheckoutKind | null>(null);
  const [groupOpen, setGroupOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const event = events[0];

  useEffect(() => {
    const timer = window.setInterval(async () => {
      try {
        const response = await fetch('/api/announcements', {
          cache: 'no-store',
        });
        const data = (await response.json()) as {
          announcements?: Announcement[];
        };
        if (data.announcements) setAnnouncements(data.announcements);
      } catch {
        /* La portada conserva el contenido más reciente si no hay red. */
      }
    }, 15000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <section className="hero-shell relative isolate flex min-h-[100svh] flex-col overflow-hidden text-white">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero-worship.webp"
          className="absolute inset-0 -z-30 h-full w-full object-cover"
        >
          <source src="/hero-worship.mp4" type="video/mp4" />
        </video>
        <div className="hero-wash absolute inset-0 -z-20" />
        <div className="grain absolute inset-0 -z-10 opacity-25" />

        <nav
          className="site-wrap flex h-24 items-center justify-between"
          aria-label="Navegación principal"
        >
          <a href="#inicio" className="font-display text-3xl tracking-[.08em]">
            RÍO MX
          </a>
          <div className="hidden items-center gap-8 text-[11px] font-bold uppercase tracking-[.18em] md:flex">
            <a href="/encuentros" className="nav-item">
              Encuentros
            </a>
            <a href="/grupos" className="nav-item">
              Grupos nuevos
            </a>
            <a href="/donativos" className="nav-item">
              Dar
            </a>
            <a
              href="/panel"
              className="rounded-full border border-white/30 px-5 py-3 transition hover:bg-white hover:text-rio-navy"
            >
              Panel
            </a>
          </div>
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="text-white hover:bg-white/10 hover:text-white md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </nav>

        {menuOpen && (
          <div className="site-wrap absolute inset-x-0 top-24 z-20 rounded-3xl border border-white/15 bg-rio-navy/95 p-7 shadow-2xl backdrop-blur-xl md:hidden">
            <div className="grid gap-5 text-lg font-semibold">
              {[
                ['Encuentros', '/encuentros'],
                ['Grupos nuevos', '/grupos'],
                ['Academia', '/academia'],
                ['Donativos', '/donativos'],
                ['Panel interno', '/panel'],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between border-b border-white/10 pb-4"
                >
                  {label}
                  <ChevronRight className="size-4" />
                </a>
              ))}
            </div>
          </div>
        )}

        <div
          id="inicio"
          className="site-wrap grid flex-1 items-end gap-10 pb-12 pt-16 lg:grid-cols-[1fr_360px] lg:pb-16"
        >
          <div className="max-w-4xl">
            <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[.22em] text-rio-mint">
              <span className="h-px w-10 bg-rio-mint" /> Todo lo que entre al
              río vivirá
            </p>
            <h1 className="font-display text-[clamp(4.7rem,13vw,10.5rem)] leading-[.78] tracking-[-.025em]">
              VEN
              <br />
              COMO ERES.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/76 sm:text-xl">
              Una iglesia para encontrar a Jesús, hacer familia y caminar con
              propósito en Ciudad de México.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/encuentros" className="inline-flex h-12 items-center gap-2 rounded-full bg-rio-mint px-6 text-sm font-semibold text-rio-navy transition hover:bg-white">Ver encuentros <ArrowRight /></a>
              <a
                href="#anuncios"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold transition hover:bg-white/10"
              >
                <Play className="size-4" /> Ver lo que viene
              </a>
            </div>
          </div>

          {event && (
            <button
              type="button"
              onClick={() => setCheckout('attendee')}
              className="event-peek group mb-2 block w-full rounded-[1.75rem] border border-white/20 bg-white/10 p-5 text-left backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15"
            >
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-rio-gold">
                Próximo paso
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Encuentro RÍO
              </h2>
              <div className="mt-5 space-y-3 text-sm text-white/75">
                <p className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-rio-mint" /> 26–27 de
                  septiembre
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="size-4 text-rio-mint" /> {event.venue}
                </p>
              </div>
              <span className="mt-6 flex items-center justify-between border-t border-white/15 pt-4 text-sm font-semibold">
                Ver boletos{' '}
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </button>
          )}
        </div>
        <div className="site-wrap flex flex-col justify-between gap-2 border-t border-white/15 py-5 text-[10px] font-semibold uppercase tracking-[.14em] text-white/55 sm:flex-row">
          <span>CDMX · México</span>
          <span>Domingos · 8:30 · 10:30 · 13:00 · 19:00</span>
        </div>
      </section>

      <section className="section-space bg-rio-paper">
        <div className="site-wrap grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="eyebrow text-rio-coral">
              Esta casa también es para ti
            </p>
            <h2 className="display-section mt-5">
              NO TIENES QUE CAMINAR SOLO.
            </h2>
            <p className="mt-7 max-w-lg text-lg leading-8 text-slate-600">
              Llegas como eres. Aquí encuentras un lugar para respirar, conocer
              a Jesús y tener gente real cerca cuando la vida pesa y cuando hay
              algo que celebrar.
            </p>
            <div className="mt-9 grid gap-5 border-t border-rio-navy/12 pt-7 sm:grid-cols-2">
              <p className="flex gap-3 text-sm leading-6 text-slate-600">
                <Check className="mt-1 size-4 shrink-0 text-rio-coral" />{' '}
                Servicios pensados para toda la familia.
              </p>
              <p className="flex gap-3 text-sm leading-6 text-slate-600">
                <Check className="mt-1 size-4 shrink-0 text-rio-coral" /> Grupos
                que caminan contigo cada semana.
              </p>
            </div>
          </div>
          <div className="relative lg:col-span-7">
            <div className="image-frame ml-auto aspect-[4/3] w-[88%] overflow-hidden rounded-[2rem]">
              <img
                src="/mexico-students.jpg"
                alt="Jóvenes mexicanos compartiendo en comunidad"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 left-0 aspect-square w-[38%] overflow-hidden rounded-[1.5rem] border-[10px] border-rio-paper">
              <img
                src="/mexico-friends.jpg"
                alt="Amigas mexicanas compartiendo juntas"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="anuncios" className="section-space bg-white">
        <div className="site-wrap">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-rio-coral">Ahora en RÍO</p>
              <h2 className="display-section mt-4">LO QUE ESTÁ PASANDO.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">
              Anuncios actualizados por el equipo de RÍO. Aquí siempre
              encontrarás el siguiente paso más claro.
            </p>
          </div>
          <div className="space-y-5">
            {announcements.map((announcement, index) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-rio-navy text-white">
        <div className="site-wrap grid items-center gap-8 overflow-hidden rounded-[2rem] border border-white/15 bg-white/[.05] p-6 sm:p-10 lg:grid-cols-[360px_1fr]">
          <div className="aspect-square overflow-hidden rounded-[1.5rem] bg-black">
            <video src="/hero-worship.mp4" autoPlay muted loop playsInline className="h-full w-full object-cover" />
          </div>
          <div className="lg:pl-8">
            <p className="eyebrow text-rio-gold">México + Estados Unidos</p>
            <h2 className="mt-4 font-display text-6xl leading-none sm:text-8xl">MAKERS</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">Una generación que crea, sirve y abre camino. Muy pronto compartiremos fechas y registro.</p>
            <span className="mt-8 inline-flex rounded-full border border-white/20 px-5 py-3 text-xs font-bold uppercase tracking-[.16em] text-white/55">Próximamente</span>
          </div>
        </div>
      </section>

      <section
        id="encuentros"
        className="section-space relative overflow-hidden bg-rio-navy text-white"
      >
        <div className="grain absolute inset-0 opacity-15" />
        <div className="site-wrap relative grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-10">
            <p className="eyebrow text-rio-mint">Encuentro RÍO</p>
            <h2 className="display-section mt-5">
              DOS DÍAS.
              <br />
              UNA HISTORIA NUEVA.
            </h2>
            <p className="mt-7 max-w-lg text-lg leading-8 text-white/68">
              Al confirmar el pago, cada persona recibe su boleto individual con
              un QR único. En la entrada se valida una sola vez y se entrega la
              pulsera.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[.12em] text-white/60">
              <span className="rounded-full border border-white/15 px-4 py-2">
                26–27 septiembre
              </span>
              <span className="rounded-full border border-white/15 px-4 py-2">
                CDMX
              </span>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <PriceCard
              label="Encuentrista"
              price={1600}
              accent="mint"
              description="Para quien vivirá su Encuentro por primera vez."
              onClick={() => setCheckout('attendee')}
            />
            <PriceCard
              label="Servidor"
              price={1300}
              accent="gold"
              description="Para el equipo que sirve y acompaña durante el Encuentro."
              onClick={() => setCheckout('server')}
            />
            <div className="sm:col-span-2 rounded-[1.5rem] border border-white/15 bg-white/[.06] p-5">
              <div className="grid gap-4 text-sm text-white/70 sm:grid-cols-3">
                <span className="flex items-center gap-2">
                  <LockKeyhole className="size-4 text-rio-mint" /> Pago con
                  Stripe
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-rio-mint" /> QR de un solo
                  uso
                </span>
                <span className="flex items-center gap-2">
                  <Users className="size-4 text-rio-mint" /> Una pulsera por
                  boleto
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="grupos" className="section-space bg-rio-mint/20">
        <div className="site-wrap grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="aspect-[5/4] overflow-hidden rounded-[2rem]">
            <img
              src="/groups.webp?v=2"
              alt="Grupo de amigos conversando y creciendo juntos"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="lg:pl-8">
            <p className="eyebrow text-rio-coral">Solo grupos nuevos</p>
            <h2 className="display-section mt-5">
              ABRE TU CASA.
              <br />
              HAZ FAMILIA.
            </h2>
            <p className="mt-7 max-w-lg text-lg leading-8 text-slate-600">
              El registro público queda únicamente para propuestas de grupos
              nuevos. Cada solicitud llega al CRM y debe ser aceptada por
              alguien del equipo antes de publicarse.
            </p>
            <Button
              className="mt-8 h-12 rounded-full px-6"
              onClick={() => setGroupOpen(true)}
            >
              Registrar un grupo nuevo <ArrowRight />
            </Button>
          </div>
        </div>
      </section>

      <section id="recursos" className="section-space bg-white">
        <div className="site-wrap grid gap-6 lg:grid-cols-12">
          <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] lg:col-span-7">
            <img
              src="/bible.webp"
              alt="Biblia abierta iluminada por el sol"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="image-veil absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-10">
              <p className="eyebrow text-rio-gold">La Biblia y Nosotras</p>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-.04em] sm:text-5xl">
                Fe que también se conversa.
              </h2>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-[2rem] bg-rio-coral p-7 text-white sm:p-10 lg:col-span-5">
            <Sparkles className="size-8" />
            <div>
              <p className="mt-16 text-2xl leading-10">
                “Todo lo que entre al río vivirá.”
              </p>
              <p className="mt-3 text-sm text-white/65">Ezequiel 47:9</p>
            </div>
            <a
              href="#dar"
              className="mt-12 flex items-center justify-between border-t border-white/20 pt-5 font-semibold"
            >
              Sostener esta misión <ArrowDownRight />
            </a>
          </div>
        </div>
      </section>

      <section id="dar" className="section-space bg-rio-paper">
        <div className="site-wrap grid overflow-hidden rounded-[2.25rem] bg-rio-navy text-white lg:grid-cols-2">
          <div className="relative min-h-[380px]">
            <img
              src="/family.webp?v=2"
              alt="Familias y amigos reunidos al atardecer"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="image-veil absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="eyebrow text-rio-mint">Generosidad</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-.04em]">
                Damos porque hemos recibido.
              </h2>
            </div>
          </div>
          <DonationForm />
        </div>
      </section>

      <footer className="bg-rio-navy pb-10 pt-20 text-white">
        <div className="site-wrap grid gap-12 border-b border-white/12 pb-16 md:grid-cols-[1.3fr_.7fr_.7fr]">
          <div>
            <p className="font-display text-5xl tracking-[.06em]">RÍO MX</p>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/55">
              Una iglesia viva en Ciudad de México. Ven como eres y encuentra tu
              siguiente paso.
            </p>
          </div>
          <div>
            <p className="eyebrow text-rio-mint">Reuniones</p>
            <p className="mt-5 text-sm leading-7 text-white/70">
              Domingos
              <br />
              8:30 · 10:30 · 13:00 · 19:00
              <br />
              Jueves · 20:00
            </p>
          </div>
          <div>
            <p className="eyebrow text-rio-mint">Explora</p>
            <div className="mt-5 grid gap-3 text-sm text-white/70">
              <a href="#encuentros">Encuentros</a>
              <a href="#grupos">Grupos nuevos</a>
              <a href="#dar">Donativos</a>
              <a href="/panel">Panel interno</a>
            </div>
          </div>
        </div>
        <div className="site-wrap mt-8 flex flex-col justify-between gap-3 text-[10px] uppercase tracking-[.14em] text-white/35 sm:flex-row">
          <span>© 2026 RÍO MX</span>
          <span>Ve y haz discípulos</span>
        </div>
      </footer>

      {event && (
        <CheckoutDialog
          event={event}
          kind={checkout}
          onClose={() => setCheckout(null)}
        />
      )}
      <GroupDialog open={groupOpen} onClose={() => setGroupOpen(false)} />
    </main>
  );
}

function AnnouncementCard({
  announcement,
  index,
}: {
  announcement: Announcement;
  index: number;
}) {
  return (
    <article
      className={`grid gap-0 overflow-hidden rounded-[1.75rem] border border-rio-navy/10 ${index % 2 ? 'bg-rio-paper' : 'bg-white'} md:grid-cols-[320px_1fr]`}
    >
      <div className="aspect-square overflow-hidden bg-rio-navy">
        {announcement.media_type === 'video' ? (
          <video
            src={announcement.media_url}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={announcement.media_url}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-10">
        <p className="eyebrow text-rio-coral">{announcement.eyebrow}</p>
        <h3 className="mt-4 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
          {announcement.title}
        </h3>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
          {announcement.body}
        </p>
        <a
          href={announcement.cta_url === '#encuentros' ? '/encuentros' : announcement.cta_url === '#grupos' ? '/grupos' : announcement.cta_url === '#recursos' ? '/ministerios' : announcement.cta_url}
          className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-rio-navy"
        >
          {announcement.cta_label} <ArrowRight className="size-4" />
        </a>
      </div>
    </article>
  );
}

function PriceCard({
  label,
  price,
  accent,
  description,
  onClick,
}: {
  label: string;
  price: number;
  accent: 'mint' | 'gold';
  description: string;
  onClick: () => void;
}) {
  return (
    <div className="flex min-h-[330px] flex-col rounded-[1.75rem] bg-white p-7 text-rio-navy">
      <p
        className={`eyebrow ${accent === 'mint' ? 'text-[#218c82]' : 'text-[#c37000]'}`}
      >
        {label}
      </p>
      <p className="mt-8 text-5xl font-semibold tracking-[-.05em]">
        ${price.toLocaleString('es-MX')}
        <span className="ml-2 text-sm font-medium text-slate-400">MXN</span>
      </p>
      <p className="mt-5 text-sm leading-6 text-slate-500">{description}</p>
      <ul className="mt-6 space-y-2 text-sm text-slate-600">
        <li className="flex gap-2">
          <Check className="size-4 text-rio-coral" /> Boleto digital individual
        </li>
        <li className="flex gap-2">
          <Check className="size-4 text-rio-coral" /> QR único de un solo acceso
        </li>
      </ul>
      <Button
        className={`mt-auto h-11 rounded-full ${accent === 'mint' ? 'bg-rio-mint text-rio-navy hover:bg-rio-mint/80' : 'bg-rio-gold text-rio-navy hover:bg-rio-gold/80'}`}
        onClick={onClick}
      >
        Elegir boleto <ArrowRight />
      </Button>
    </div>
  );
}

export function CheckoutDialog({
  event,
  kind,
  onClose,
}: {
  event: RioEvent;
  kind: CheckoutKind | null;
  onClose: () => void;
}) {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    const form = new FormData(e.currentTarget);
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kind: 'event',
        eventId: event.id,
        ticketType: kind,
        name: form.get('name'),
        email: form.get('email'),
        phone: form.get('phone'),
      }),
    });
    const data = (await response.json()) as { url?: string; error?: string };
    setLoading(false);
    if (data.url) window.location.href = data.url;
    else setStatus(data.error || 'No fue posible iniciar el pago.');
  }
  const price = kind === 'attendee' ? event.attendee_price : event.server_price;
  return (
    <Dialog open={Boolean(kind)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-[1.5rem] p-6 sm:max-w-lg">
        <DialogHeader>
          <p className="eyebrow text-rio-coral">Pago seguro</p>
          <DialogTitle className="text-2xl">
            Boleto de {kind === 'attendee' ? 'encuentrista' : 'servidor'}
          </DialogTitle>
          <DialogDescription>
            Recibirás tu boleto con QR al confirmarse el pago.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between rounded-xl bg-rio-mint/20 p-4">
          <span className="font-semibold">{event.title}</span>
          <span className="text-lg font-bold">
            ${(price / 100).toLocaleString('es-MX')}
          </span>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <label className="grid gap-2 text-sm font-medium">
            Nombre completo
            <Input name="name" required className="h-11" autoComplete="name" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Correo para recibir tu boleto
            <Input
              name="email"
              type="email"
              required
              className="h-11"
              autoComplete="email"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            WhatsApp
            <Input name="phone" required className="h-11" autoComplete="tel" />
          </label>
          {status && (
            <p
              role="alert"
              className="rounded-xl bg-rio-gold/25 p-3 text-sm text-rio-navy"
            >
              {status}
            </p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-full"
          >
            {loading ? 'Abriendo Stripe…' : 'Continuar a Stripe'}{' '}
            <LockKeyhole />
          </Button>
          <p className="text-center text-xs leading-5 text-slate-400">
            La compra queda ligada a una persona. El QR solo puede validarse una
            vez.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function GroupDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const response = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    const data = (await response.json()) as {
      message?: string;
      error?: string;
    };
    setLoading(false);
    setStatus(
      data.message || data.error || 'No fue posible enviar la solicitud.',
    );
    if (response.ok) setDone(true);
  }
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-[1.5rem] p-6 sm:max-w-lg">
        <DialogHeader>
          <p className="eyebrow text-rio-coral">Solicitud interna</p>
          <DialogTitle className="text-2xl">
            Registrar un grupo nuevo
          </DialogTitle>
          <DialogDescription>
            El equipo revisará los datos antes de aprobar y publicar el grupo.
          </DialogDescription>
        </DialogHeader>
        {done ? (
          <div className="rounded-2xl bg-rio-mint/25 p-6 text-center">
            <Check className="mx-auto size-8 text-[#218c82]" />
            <p className="mt-4 font-semibold">Solicitud recibida</p>
            <p className="mt-2 text-sm text-slate-600">{status}</p>
            <Button className="mt-5 rounded-full" onClick={onClose}>
              Listo
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium sm:col-span-2">
              Nombre completo
              <Input name="fullName" required className="h-11" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Correo
              <Input name="email" type="email" required className="h-11" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              WhatsApp
              <Input name="phone" required className="h-11" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Zona o código postal
              <Input name="zone" required className="h-11" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Día propuesto
              <Input
                name="preferredDay"
                placeholder="Ej. miércoles"
                className="h-11"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium sm:col-span-2">
              Cuéntanos sobre el grupo
              <Textarea name="notes" className="min-h-24" />
            </label>
            {status && (
              <p role="alert" className="text-sm text-rio-coral sm:col-span-2">
                {status}
              </p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="h-12 rounded-full sm:col-span-2"
            >
              {loading ? 'Enviando…' : 'Enviar para revisión'} <ArrowRight />
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function DonationForm() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    const form = new FormData(e.currentTarget);
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kind: 'donation',
        amount: Number(form.get('amount')),
        name: form.get('name'),
        email: form.get('email'),
      }),
    });
    const data = (await response.json()) as { url?: string; error?: string };
    setLoading(false);
    if (data.url) window.location.href = data.url;
    else setStatus(data.error || 'No fue posible iniciar el donativo.');
  }
  return (
    <div className="p-7 sm:p-10">
      <p className="eyebrow text-rio-gold">Tu donativo</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-.04em]">
        Elige la cantidad que quieres dar.
      </h2>
      <p className="mt-4 text-sm leading-6 text-white/60">
        El pago se procesará en la misma cuenta de Stripe de La Biblia y
        Nosotras.
      </p>
      <form onSubmit={submit} className="mt-8 grid gap-4">
        <label className="grid gap-2 text-sm text-white/80">
          Cantidad en MXN
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rio-mint">
              $
            </span>
            <Input
              name="amount"
              type="number"
              min="100"
              step="50"
              required
              placeholder="500"
              className="h-12 border-white/20 bg-white/10 pl-8 text-white placeholder:text-white/35"
            />
          </div>
        </label>
        <label className="grid gap-2 text-sm text-white/80">
          Nombre
          <Input
            name="name"
            required
            className="h-12 border-white/20 bg-white/10 text-white"
          />
        </label>
        <label className="grid gap-2 text-sm text-white/80">
          Correo
          <Input
            name="email"
            type="email"
            required
            className="h-12 border-white/20 bg-white/10 text-white"
          />
        </label>
        {status && (
          <p
            role="alert"
            className="rounded-xl bg-white/10 p-3 text-sm text-rio-gold"
          >
            {status}
          </p>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="mt-2 h-12 rounded-full bg-rio-mint text-rio-navy hover:bg-white"
        >
          {loading ? 'Abriendo Stripe…' : 'Dar con Stripe'} <Heart />
        </Button>
      </form>
    </div>
  );
}
