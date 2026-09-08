import { ArrowRight } from 'lucide-react';
import { PageHero, SiteFooter } from '@/components/rio/site-chrome';

const flow = [
  ['01', 'Ganar', 'Acercamos a las personas a Jesús con amor, verdad y una invitación clara.'],
  ['02', 'Consolidar', 'Cuidamos cada historia para que nadie tenga que caminar solo.'],
  ['03', 'Discipular', 'Crecemos en la Palabra, el carácter y una fe que se vive cada día.'],
  ['04', 'Enviar', 'Formamos personas listas para servir, liderar y abrir camino.'],
];

const steps = [
  ['Grupos de amistad', 'Encuentra familia y acompañamiento cada semana.', '/grupos', '/comunidad-grupos.png'],
  ['Encuentros', 'Haz una pausa, sana y comienza una historia nueva.', '/encuentros', '/Encuentro.png'],
  ['Academia de Líderes', 'Fórmate para servir y acompañar a otros.', '/academia', '/liderazgo-academia.png'],
  ['Servir', 'Pon tus dones al servicio de la casa y la ciudad.', '/ministerios', '/servir-voluntariado.png'],
];

export default function ElRio() {
  return <main>
    <PageHero eyebrow="Nuestra casa" title="TODO LO QUE ENTRE AL RÍO VIVIRÁ." image="/hero-worship.webp">
      <p>Somos una iglesia para encontrar a Jesús, hacer familia y caminar con propósito desde México hacia las naciones.</p>
      <a href="/grupos" className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-rio-navy px-6 text-sm font-semibold text-white">Empieza tu recorrido <ArrowRight className="size-4" /></a>
    </PageHero>
    <section className="section-space bg-white"><div className="site-wrap">
      <p className="eyebrow text-rio-coral">Así caminamos</p>
      <h2 className="display-section mt-5 max-w-5xl">UNA RUTA SIMPLE PARA UNA FE PROFUNDA.</h2>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{flow.map(([number, title, body]) => <article className="flex min-h-[310px] flex-col rounded-3xl bg-rio-paper p-7" key={title}><span className="eyebrow text-rio-coral">{number}</span><h3 className="mt-auto text-3xl font-semibold">{title}</h3><p className="mt-4 text-sm leading-6 text-slate-600">{body}</p></article>)}</div>
    </div></section>
    <section className="section-space bg-rio-navy text-white"><div className="site-wrap grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
      <div><p className="eyebrow text-rio-mint">Visión 2035</p><h2 className="display-section mt-5">UNA CASA QUE SIGUE FLUYENDO.</h2></div>
      <div><p className="text-xl leading-9 text-white/70">Soñamos con una iglesia saludable: 10,000 personas en RÍO Central y 50 iglesias RÍO en México, Estados Unidos, Latinoamérica y Europa.</p><div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">{[['12K','vidas'],['350+','grupos'],['48','líderes'],['9','generaciones']].map(([n,l]) => <div key={l} className="border-t border-white/15 pt-4"><strong className="text-3xl text-rio-gold">{n}</strong><p className="mt-1 text-xs uppercase tracking-wider text-white/45">{l}</p></div>)}</div></div>
    </div></section>
    <section className="section-space bg-rio-paper"><div className="site-wrap"><p className="eyebrow text-rio-coral">Tu paso</p><h2 className="display-section mt-5">HAY UN LUGAR PARA EMPEZAR.</h2><div className="mt-12 grid gap-5 md:grid-cols-2">{steps.map(([title, body, href, image]) => <a href={href} key={title} className="group grid overflow-hidden rounded-3xl bg-white sm:grid-cols-[180px_1fr]"><img src={image} alt="" className="h-full min-h-44 w-full object-cover"/><div className="p-7"><h3 className="text-2xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{body}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-bold">Conocer más <ArrowRight className="size-4 transition group-hover:translate-x-1"/></span></div></a>)}</div></div></section>
    <SiteFooter />
  </main>;
}
