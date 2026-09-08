'use client';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const links = [
  ['Inicio', '/'],
  ['El Río', '/el-rio'],
  ['Grupos', '/grupos'],
  ['Encuentros', '/encuentros'],
  ['Academia', '/academia'],
  ['Ministerios', '/ministerios'],
  ['Sedes', '/sedes'],
  ['Donar', '/donativos'],
];

export function SiteHeader({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <header className={dark ? 'text-white' : 'bg-rio-paper text-rio-navy'}>
      <nav className="site-wrap flex h-24 items-center justify-between" aria-label="Navegación principal">
        <a href="/" className="font-display text-3xl tracking-[.08em]" aria-label="RÍO MX, inicio">RÍO MX</a>
        <div className="hidden items-center gap-5 text-[9px] font-bold uppercase tracking-[.14em] xl:flex">
          {links.map(([label, href]) => <a className="nav-item" href={href} key={href}>{label}</a>)}
          <a href="/panel" className="rounded-full border border-current/25 px-4 py-2">Panel</a>
        </div>
        <Button variant="ghost" size="icon-lg" className={dark ? 'text-white hover:bg-white/10 hover:text-white xl:hidden' : 'xl:hidden'} onClick={() => setOpen(!open)} aria-label={open ? 'Cerrar menú' : 'Abrir menú'}>{open ? <X /> : <Menu />}</Button>
      </nav>
      {open && <div className="site-wrap absolute left-0 right-0 z-50 grid gap-4 rounded-3xl border border-white/10 bg-rio-navy p-7 text-white shadow-2xl xl:hidden">{links.map(([label, href]) => <a href={href} key={href} className="border-b border-white/10 pb-3" onClick={() => setOpen(false)}>{label}</a>)}<a href="/panel" onClick={() => setOpen(false)}>Panel interno</a></div>}
    </header>
  );
}

export function SiteFooter() {
  return <footer className="bg-rio-navy pb-10 pt-16 text-white"><div className="site-wrap grid gap-10 border-b border-white/10 pb-12 md:grid-cols-[1.2fr_.8fr_.8fr_.8fr]"><div><p className="font-display text-5xl tracking-[.06em]">RÍO MX</p><p className="mt-4 max-w-xs text-sm leading-6 text-white/55">Una iglesia viva en México. Ven como eres y encuentra tu siguiente paso.</p></div><div className="text-sm leading-7 text-white/70"><p className="eyebrow mb-3 text-rio-mint">Reuniones</p>Domingos<br/>8:30 · 10:30 · 13:00 · 19:00<br/>Jueves · 20:00</div><div className="text-sm leading-7 text-white/70"><p className="eyebrow mb-3 text-rio-mint">RÍO Central</p>Av. Gran Canal 6692<br/>San Pedro el Chico · GAM · CDMX<br/>55 3874 0000 · 55 5748 3645</div><div className="text-sm leading-7 text-white/70"><p className="eyebrow mb-3 text-rio-mint">Conecta</p><a href="https://www.instagram.com/rio_mex/" target="_blank" rel="noreferrer">Instagram</a><br/><a href="https://www.youtube.com/channel/UCfKO8cXJBjlq806mAnRFlBA" target="_blank" rel="noreferrer">YouTube</a><br/><a href="/grupos">Grupos nuevos</a><br/><a href="/panel">Panel interno</a></div></div><div className="site-wrap mt-8 flex flex-col justify-between gap-3 text-[10px] uppercase tracking-[.14em] text-white/35 sm:flex-row"><span>© 2026 RÍO MX</span><span>Todo lo que entre al río vivirá</span></div></footer>;
}

export function PageHero({ eyebrow, title, children, image }: { eyebrow: string; title: string; children: React.ReactNode; image?: string }) {
  return <><SiteHeader/><section className="bg-rio-paper pb-20 pt-10"><div className="site-wrap grid items-center gap-10 lg:grid-cols-2"><div><p className="eyebrow text-rio-coral">{eyebrow}</p><h1 className="display-section mt-5">{title}</h1><div className="mt-7 max-w-xl text-lg leading-8 text-slate-600">{children}</div></div>{image && <img src={image} alt="" className="aspect-[5/4] h-full w-full rounded-[2rem] object-cover shadow-[0_30px_80px_rgba(25,34,81,.16)]"/>}</div></section></>;
}
