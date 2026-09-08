import { LockKeyhole, ShieldCheck, Users } from 'lucide-react';
import { PageHero, SiteFooter } from '@/components/rio/site-chrome';
import { listEvents } from '@/lib/rio-db';
import { EncounterAction } from '@/components/rio/encounter-page';

export const dynamic = 'force-dynamic';
const categories = [['RÍO Kids','5 a 11 años'],['Youth','12 a 18 años'],['Pro','18 a 26 años'],['Matrimonios','Para caminar juntos'],['Prime','Adultos']];

export default async function Encuentros() {
  const event = (await listEvents())[0];
  return <main>
    <PageHero eyebrow="Tu siguiente paso" title="DOS DÍAS. UNA HISTORIA NUEVA." image="/Encuentro.png"><p>Un espacio para hacer una pausa, sanar, encontrarte con Dios y comenzar de nuevo acompañado por la familia RÍO.</p></PageHero>
    <section className="section-space bg-white"><div className="site-wrap"><p className="eyebrow text-rio-coral">Encuentros para cada etapa</p><h2 className="display-section mt-5">ELIGE TU CATEGORÍA.</h2><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{categories.map(([name,age],i)=><article key={name} className="rounded-3xl bg-rio-paper p-6"><span className="text-xs font-bold text-rio-coral">0{i+1}</span><h3 className="mt-10 text-2xl font-semibold">{name}</h3><p className="mt-2 text-sm text-slate-500">{age}</p></article>)}</div></div></section>
    <section className="section-space bg-rio-navy text-white"><div className="site-wrap"><div className="mb-10 max-w-3xl"><p className="eyebrow text-rio-mint">Registro y boleto</p><h2 className="display-section mt-5">TU LUGAR, PERSONAL Y SEGURO.</h2><p className="mt-6 text-lg leading-8 text-white/65">Al confirmarse el pago, cada persona recibe un boleto individual con QR único. En la entrada se valida una sola vez y se entrega su pulsera.</p></div><div className="grid gap-6 md:grid-cols-2">{event&&<><article className="rounded-[2rem] bg-white p-8 text-rio-navy"><p className="eyebrow text-[#218c82]">Encuentrista</p><p className="mt-6 text-5xl font-semibold">$1,600 <span className="text-sm font-medium text-slate-400">MXN</span></p><p className="mt-4 text-slate-600">Para quien vivirá su Encuentro por primera vez.</p><EncounterAction event={event} type="attendee" label="Apartar mi lugar"/></article><article className="rounded-[2rem] bg-white p-8 text-rio-navy"><p className="eyebrow text-[#c37000]">Servidor</p><p className="mt-6 text-5xl font-semibold">$1,300 <span className="text-sm font-medium text-slate-400">MXN</span></p><p className="mt-4 text-slate-600">Para el equipo que sirve y acompaña durante el Encuentro.</p><EncounterAction event={event} type="server" label="Registrarme para servir"/></article></>}<div className="md:col-span-2 grid gap-4 rounded-3xl border border-white/15 bg-white/[.06] p-6 text-sm text-white/70 sm:grid-cols-3"><span className="flex items-center gap-2"><LockKeyhole className="size-4 text-rio-mint"/>Pago seguro con Stripe</span><span className="flex items-center gap-2"><ShieldCheck className="size-4 text-rio-mint"/>QR de una sola validación</span><span className="flex items-center gap-2"><Users className="size-4 text-rio-mint"/>Una pulsera por boleto</span></div></div></div></section>
    <SiteFooter />
  </main>;
}
