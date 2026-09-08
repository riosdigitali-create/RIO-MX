import { Heart, Sparkles } from 'lucide-react';
import { DonationForm } from '@/components/rio/public-home';
import { PageHero, SiteFooter } from '@/components/rio/site-chrome';

export default function Donativos() {
  return <main>
    <PageHero eyebrow="Generosidad" title="DAR TAMBIÉN ES ADORAR." image="/mexico-friends.jpg"><p>Tu generosidad sostiene la casa, ayuda a personas y lleva el mensaje más lejos. “Dios ama al que da con alegría.”</p></PageHero>
    <section className="section-space bg-white"><div className="site-wrap grid gap-5 md:grid-cols-3">{[['Diezmo','Honramos a Dios con fidelidad y gratitud.'],['Ofrenda','Damos libremente para fortalecer la casa.'],['Misiones','Llevamos esperanza a nuevas ciudades y naciones.']].map(([title,body],i)=><article className="rounded-3xl bg-rio-paper p-8" key={title}>{i===1?<Heart className="text-rio-coral"/>:<Sparkles className="text-rio-coral"/>}<h2 className="mt-8 text-3xl font-semibold">{title}</h2><p className="mt-4 leading-7 text-slate-600">{body}</p></article>)}</div></section>
    <section className="section-space bg-rio-navy text-white"><div className="site-wrap grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow text-rio-mint">Elige tu forma de dar</p><h2 className="display-section mt-5">TÚ DECIDES LA CANTIDAD.</h2><p className="mt-6 max-w-lg text-lg leading-8 text-white/65">El donativo se procesa de forma segura y queda registrado dentro del CRM interno.</p></div><DonationForm/></div></section>
    <SiteFooter />
  </main>;
}
