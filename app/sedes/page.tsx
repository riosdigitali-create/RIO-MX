import { ArrowUpRight, Clock, MapPin } from 'lucide-react';
import { PageHero, SiteFooter } from '@/components/rio/site-chrome';

const sedes = [
  ['RÍO Central','Ciudad de México','Av. Gran Canal 6692, Col. San Pedro el Chico, Gustavo A. Madero.','Dom · 8:30, 10:30, 13:00 y 19:00 · Jue · 20:00'],
  ['RÍO Sur','Ciudad de México','Av. Cafetales 1695, Coapa, Coyoacán.','Dom · 9:30'],
  ['RÍO Lindavista','Ciudad de México','Cinépolis Vía Vallejo, Gustavo A. Madero.','Dom · 10:00 y 12:00'],
  ['RÍO Las Américas','Estado de México','Cinépolis Plaza Las Américas, Ecatepec.','Dom · 10:00 · Mié · 18:00'],
  ['RÍO Tecámac','Estado de México','Plaza Soriana, Los Héroes Tecámac.','Dom · 10:00 · Jue · 19:30 · Vie · 10:00'],
  ['RÍO Oriente','Estado de México','Barrio Saraperos, Chimalhuacán.','Dom · 10:00 · Lun · 17:30'],
  ['RÍO Toluca','Estado de México','Metepec · Cinemex Town Square.','Dom · 10:00 y 14:00 · Jue · 19:30'],
  ['RÍO Tollocan','Estado de México','Cinépolis Galerías Toluca.','Dom · 10:00'],
  ['RÍO Progreso','Hidalgo','Progreso de Obregón, Hidalgo.','Dom · 12:00 · Jue · 19:30 · Sáb · 18:00 Youth'],
  ['RÍO Tizayuca','Hidalgo','Ciudad Deportiva, Tizayuca, Hidalgo.','Dom · 12:00 y 17:00 · Mié · 19:00'],
  ['RÍO Calpulalpan','Tlaxcala','Blvd. Emilio Sánchez Piedras 60, Tlaxcala.','Dom · 10:30 · Mar · 19:00'],
  ['RÍO San Luis Potosí','San Luis Potosí','San Luis Potosí, S.L.P.','Dom · 10:00'],
];

export default function Sedes() {
  return <main>
    <PageHero eyebrow="Una iglesia, muchas casas" title="ENCUENTRA TU RÍO." image="/mexico-family.jpg"><p>Una sola familia que fluye por Ciudad de México y más allá. Acércate a la sede RÍO más cercana a ti.</p></PageHero>
    <section className="section-space bg-white"><div className="site-wrap"><div className="mb-10 flex flex-wrap gap-2">{['Todas','CDMX','Edo. Méx','Hidalgo','Tlaxcala','S.L.P.'].map((x,i)=><span key={x} className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider ${i===0?'border-rio-navy bg-rio-navy text-white':'border-rio-navy/15'}`}>{x}</span>)}</div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{sedes.map(([name,state,address,hours],i)=>{const q=encodeURIComponent(`${name} ${address}`);return <article className="flex min-h-[340px] flex-col rounded-3xl bg-rio-paper p-7" key={name}><div className="flex items-start justify-between"><p className="eyebrow text-rio-coral">{state}</p><span className="font-display text-4xl text-rio-navy/15">{String(i+1).padStart(2,'0')}</span></div><h2 className="mt-8 text-3xl font-semibold">{name}</h2><p className="mt-5 flex gap-3 text-sm leading-6 text-slate-600"><MapPin className="mt-1 size-4 shrink-0 text-rio-coral"/>{address}</p><p className="mt-4 flex gap-3 text-sm leading-6 text-slate-600"><Clock className="mt-1 size-4 shrink-0 text-rio-coral"/>{hours}</p><a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noreferrer" className="mt-auto flex items-center gap-2 pt-7 text-sm font-bold">Abrir mapa <ArrowUpRight className="size-4"/></a></article>})}</div></div></section>
    <SiteFooter />
  </main>;
}
