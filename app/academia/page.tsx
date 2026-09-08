import { ArrowRight, Check } from 'lucide-react';
import { PageHero, SiteFooter } from '@/components/rio/site-chrome';

export default function Academia() {
  return <main>
    <PageHero eyebrow="Academia de Líderes · México" title="CRECE PARA SERVIR." image="/liderazgo-academia.png"><p>Un recorrido de 12 semanas para formar líderes sanos, firmes en la Palabra y listos para acompañar a otros.</p><a href="mailto:info@riomx.org?subject=Registro%20Academia%20de%20Líderes" className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-rio-navy px-6 text-sm font-semibold text-white">Solicitar registro <ArrowRight className="size-4"/></a></PageHero>
    <section className="section-space bg-white"><div className="site-wrap"><p className="eyebrow text-rio-coral">La ruta de formación</p><div className="mt-10 grid gap-5 md:grid-cols-3">{[['01','Fundamentos','Conoce la Palabra y afirma lo que crees.'],['02','Carácter','Permite que Jesús transforme tu manera de vivir.'],['03','Liderazgo','Aprende a cuidar, servir y multiplicar vida.']].map(([n,title,body])=><article className="rounded-3xl bg-rio-paper p-8" key={title}><span className="eyebrow text-rio-coral">{n}</span><h2 className="mt-12 text-3xl font-semibold">{title}</h2><p className="mt-4 leading-7 text-slate-600">{body}</p></article>)}</div><div className="mt-12 grid gap-4 rounded-3xl bg-rio-mint/20 p-8 md:grid-cols-3">{['12 semanas de formación','Mentoría y comunidad','Aplicación práctica'].map(x=><p className="flex items-center gap-3 font-semibold" key={x}><Check className="size-5 text-rio-coral"/>{x}</p>)}</div></div></section>
    <SiteFooter />
  </main>;
}
