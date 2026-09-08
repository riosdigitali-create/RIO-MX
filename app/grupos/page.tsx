import { Check, Home, Users } from 'lucide-react';
import { PageHero, SiteFooter } from '@/components/rio/site-chrome';
import { GroupPageAction } from '@/components/rio/group-page';

export default function Grupos() {
  return <main>
    <PageHero eyebrow="El corazón de RÍO" title="NO CAMINES SOLO." image="/mexico-students.jpg">
      <p>Más de 350 grupos se reúnen cada semana en casas para crecer en fe, amistad y discipulado.</p>
      <GroupPageAction />
    </PageHero>
    <section className="section-space bg-white"><div className="site-wrap grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
      <div><p className="eyebrow text-rio-coral">Amistad que se vuelve familia</p><h2 className="display-section mt-5">UNA MESA. UNA SEMANA A LA VEZ.</h2><p className="mt-7 text-lg leading-8 text-slate-600">Los grupos de amistad son espacios cercanos en casas donde conversamos la Biblia, oramos y acompañamos la vida real.</p></div>
      <div className="grid gap-5 sm:grid-cols-2">{[['Haz familia','Conoce personas que caminan contigo.'],['Crece en la fe','Conversa la Biblia de forma cercana.'],['Recibe cuidado','No enfrentes solo las temporadas difíciles.'],['Multiplica vida','Abre tu casa y forma un grupo saludable.']].map(([title,body], i) => <article className="rounded-3xl bg-rio-paper p-8" key={title}>{i % 2 ? <Users className="text-rio-coral"/> : <Home className="text-rio-coral"/>}<h3 className="mt-8 text-2xl font-semibold">{title}</h3><p className="mt-3 text-slate-600">{body}</p></article>)}</div>
    </div></section>
    <section className="section-space bg-rio-mint/20"><div className="site-wrap grid gap-10 lg:grid-cols-2 lg:items-center"><img src="/mexico-friends.jpg" alt="Amigas mexicanas compartiendo" className="aspect-[5/4] rounded-[2rem] object-cover"/><div><p className="eyebrow text-rio-coral">Registro de grupos nuevos</p><h2 className="display-section mt-5">ABRE TU CASA. HAZ FAMILIA.</h2><ul className="mt-7 space-y-4 text-slate-600"><li className="flex gap-3"><Check className="mt-1 size-4 shrink-0 text-rio-coral"/>La solicitud llega directamente al CRM.</li><li className="flex gap-3"><Check className="mt-1 size-4 shrink-0 text-rio-coral"/>Un responsable interno revisa y aprueba la información.</li><li className="flex gap-3"><Check className="mt-1 size-4 shrink-0 text-rio-coral"/>El registro público es únicamente para grupos nuevos.</li></ul><GroupPageAction /></div></div></section>
    <SiteFooter />
  </main>;
}
