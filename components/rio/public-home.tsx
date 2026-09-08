'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Check,
  Heart,
  LockKeyhole,
  MapPin,
  Play,
  Sparkles,
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
import { SiteFooter, SiteHeader } from '@/components/rio/site-chrome';

type CheckoutKind = 'attendee' | 'server';

export function PublicHome({
  initialAnnouncements,
  events,
}: {
  initialAnnouncements: Announcement[];
  events: RioEvent[];
}) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
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
        <div className="absolute inset-x-0 top-0 z-30">
          <SiteHeader dark />
        </div>

        <div
          id="inicio"
          className="site-wrap grid flex-1 items-end gap-10 pb-12 pt-36 lg:grid-cols-[1fr_360px] lg:pb-16"
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
              <a href="/grupos" className="inline-flex h-12 items-center gap-2 rounded-full bg-rio-mint px-6 text-sm font-semibold text-rio-navy transition hover:bg-white">Soy nuevo aquí <ArrowRight /></a>
              <a
                href="#anuncios"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold transition hover:bg-white/10"
              >
                <Play className="size-4" /> Ver lo que viene
              </a>
            </div>
          </div>

          {event && (
            <a
              href="/encuentros"
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
                Conocer Encuentros{' '}
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </a>
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
            <a href="https://makers26-inside.riosdigitali.workers.dev/" target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-full border border-white/20 px-5 py-3 text-xs font-bold uppercase tracking-[.16em] text-white transition hover:bg-white hover:text-rio-navy">Conocer Makers <ArrowRight className="ml-2 size-4" /></a>
          </div>
        </div>
      </section>

      <section className="section-space bg-rio-paper">
        <div className="site-wrap grid overflow-hidden rounded-[2.25rem] bg-white shadow-[0_30px_90px_rgba(25,34,81,.10)] lg:grid-cols-[.85fr_1.15fr]">
          <div className="aspect-square min-h-[360px] bg-rio-navy lg:min-h-[560px]">
            <video src="/biblia-nosotras.mp4" autoPlay muted loop playsInline className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <img src="/logobiblia.png" alt="La Biblia y Nosotras" className="h-auto w-44" />
            <p className="eyebrow mt-10 text-rio-coral">15 de agosto de 2026 · Arena CDMX</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-.04em] sm:text-6xl">Una noche para volver a la Palabra.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Una experiencia para mujeres que quieren encontrarse con Dios, fortalecer su fe y caminar acompañadas.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="https://www.superboletos.com/landing-evento/4lstBqD-3YdArDsuzo1SUQ" target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full bg-rio-navy px-6 text-sm font-semibold text-white">Comprar boletos <ArrowRight className="size-4" /></a>
              <a href="https://labibliaynosotras.com" target="_blank" rel="noreferrer" className="inline-flex h-12 items-center rounded-full border border-rio-navy/15 px-6 text-sm font-semibold">Ver sitio oficial</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="site-wrap">
          <p className="eyebrow text-rio-coral">Todo RÍO, bien organizado</p>
          <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <h2 className="display-section max-w-4xl">ENCUENTRA TU SIGUIENTE PASO.</h2>
            <p className="max-w-sm text-sm leading-6 text-slate-500">Cada área tiene su propia página para que la información sea fácil de encontrar.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              ['El Río', 'Conoce nuestra visión y la ruta: ganar, consolidar, discipular y enviar.', '/el-rio', '/comunidad-grupos.png'],
              ['Grupos', 'Haz familia, crece en la fe o solicita abrir un grupo nuevo.', '/grupos', '/mexico-students.jpg'],
              ['Encuentros', 'Consulta categorías, precios y recibe tu boleto individual con QR.', '/encuentros', '/Encuentro.png'],
              ['Academia', 'Fórmate como líder y prepárate para acompañar a otros.', '/academia', '/liderazgo-academia.png'],
              ['Ministerios', 'RÍO Kids, Jóvenes, Champions, matrimonios, Prime y restauración.', '/ministerios', '/mexico-friends.jpg'],
              ['Sedes', 'Encuentra horarios y ubicación de las 12 casas RÍO.', '/sedes', '/mexico-family.jpg'],
            ].map(([title, body, href, image]) => (
              <a href={href} key={href} className="group overflow-hidden rounded-[1.75rem] border border-rio-navy/10 bg-rio-paper transition hover:-translate-y-1 hover:shadow-xl">
                <img src={image} alt="" className="aspect-[16/9] w-full object-cover" />
                <div className="p-7">
                  <h3 className="text-2xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
                  <span className="mt-7 flex items-center gap-2 text-sm font-bold">Explorar <ArrowRight className="size-4 transition group-hover:translate-x-1" /></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-rio-mint/20">
        <div className="site-wrap grid gap-6 lg:grid-cols-3">
          <article className="flex flex-col rounded-[2rem] bg-white p-8">
            <img src="/youversion.png" alt="YouVersion" className="h-28 w-full object-contain object-left" />
            <p className="eyebrow mt-8 text-rio-coral">Devocionales</p>
            <h2 className="mt-4 text-3xl font-semibold">La Biblia cada día.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">Lee, escucha y sigue planes bíblicos junto a la comunidad.</p>
            <a href="https://www.bible.com/es" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm font-bold">Abrir YouVersion <ArrowRight className="size-4" /></a>
          </article>
          <article className="flex flex-col rounded-[2rem] bg-rio-navy p-8 text-white">
            <Sparkles className="size-8 text-rio-gold" />
            <img src="/libro.png" alt="Libro Amor a prueba de todo" className="mx-auto my-8 h-44 object-contain" />
            <h2 className="text-3xl font-semibold">Amor a prueba de todo.</h2>
            <a href="https://www.amazon.com.mx/dp/B0G1994SM1" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-rio-mint">Conocer el libro <ArrowRight className="size-4" /></a>
          </article>
          <article className="relative flex min-h-[430px] flex-col justify-end overflow-hidden rounded-[2rem] p-8 text-white">
            <img src="/rio-kids.png" alt="RÍO Kids" className="absolute inset-0 h-full w-full object-cover" />
            <div className="image-veil absolute inset-0" />
            <div className="relative">
              <p className="eyebrow text-rio-gold">Domingos en RÍO</p>
              <h2 className="mt-4 text-4xl font-semibold">RÍO Kids</h2>
              <p className="mt-3 text-sm text-white/75">Fe, cuidado y diversión para cada etapa.</p>
              <a href="/ministerios" className="mt-6 inline-flex items-center gap-2 text-sm font-bold">Conocer más <ArrowRight className="size-4" /></a>
            </div>
          </article>
        </div>
      </section>

      <section className="section-space bg-rio-coral text-white">
        <div className="site-wrap grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow text-rio-gold">Mensajes RÍO</p>
            <h2 className="display-section mt-5 max-w-5xl">UNA PALABRA PARA TU SEMANA.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">Revive las reuniones, mensajes y conversaciones de la casa desde nuestro canal.</p>
          </div>
          <a href="https://www.youtube.com/channel/UCfKO8cXJBjlq806mAnRFlBA" target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-rio-navy"><Play className="size-4" /> Ver mensajes</a>
        </div>
      </section>

      <SiteFooter />
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
