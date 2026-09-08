import { ArrowRight } from 'lucide-react';
import { PageHero, SiteFooter } from '@/components/rio/site-chrome';

const areas = [
  ['RÍO Kids','Fe, cuidado y diversión para cada etapa.','/rio-kids.png'],
  ['Champions','Un espacio de inclusión, amistad y propósito.','/mexico-friends.jpg'],
  ['Jóvenes','Una generación encendida por Jesús.','/mexico-students.jpg'],
  ['Matrimonios','Herramientas para construir y caminar juntos.','/mexico-family.jpg'],
  ['Prime','Comunidad, propósito y amistad para adultos.','/community.webp'],
  ['Restauración','Acompañamiento seguro para volver a comenzar.','/restauracion-ayuda.png'],
];

export default function Ministerios() {
  return <main>
    <PageHero eyebrow="Comunidades y ministerios" title="HAY UN LUGAR PARA TI." image="/mexico-friends.jpg"><p>Cada edad y temporada encuentra comunidad, cuidado y un siguiente paso dentro de RÍO.</p></PageHero>
    <section className="section-space bg-white"><div className="site-wrap grid gap-5 md:grid-cols-2 lg:grid-cols-3">{areas.map(([title,body,image])=><article key={title} className="overflow-hidden rounded-3xl bg-rio-paper"><img src={image} alt="" className="aspect-[16/10] w-full object-cover"/><div className="p-8"><h2 className="text-3xl font-semibold">{title}</h2><p className="mt-4 leading-7 text-slate-600">{body}</p></div></article>)}</div></section>
    <section className="section-space bg-rio-coral text-white"><div className="site-wrap grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="eyebrow text-rio-gold">¿Necesitas acompañamiento?</p><h2 className="display-section mt-5">NO TIENES QUE HACERLO SOLO.</h2><p className="mt-6 max-w-2xl text-lg text-white/75">Nuestro equipo puede ayudarte a encontrar la comunidad o el espacio de cuidado más adecuado.</p></div><a href="mailto:info@riomx.org?subject=Quiero%20conectarme%20con%20RÍO" className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-rio-navy">Quiero conectarme <ArrowRight className="size-4"/></a></div></section>
    <SiteFooter />
  </main>;
}
