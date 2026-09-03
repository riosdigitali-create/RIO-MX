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
  ['Donativos', '/donativos'],
  ['Sedes', '/sedes'],
];

export function SiteHeader({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <header className={dark ? 'text-white' : 'bg-rio-paper text-rio-navy'}>
      <nav className="site-wrap flex h-24 items-center justify-between" aria-label="Navegación principal">
        <a href="/" className="font-display text-3xl tracking-[.08em]">RÍO MX</a>
        <div className="hidden items-center gap-6 text-[10px] font-bold uppercase tracking-[.16em] lg:flex">
          {links.map(([label, href]) => <a className="nav-item" href={href} key={href}>{label}</a>)}
          <a href="/panel" className="rounded-full border border-current/25 px-4 py-2">Panel</a>
        </div>
        <Button variant="ghost" size="icon-lg" className={dark ? 'text-white hover:bg-white/10 hover:text-white lg:hidden' : 'lg:hidden'} onClick={() => setOpen(!open)} aria-label="Abrir menú">{open ? <X /> : <Menu />}</Button>
      </nav>
      {open && <div className="site-wrap absolute left-0 right-0 z-50 grid gap-4 rounded-3xl bg-rio-navy p-7 text-white shadow-2xl lg:hidden">{links.map(([label, href]) => <a href={href} key={href} className="border-b border-white/10 pb-3">{label}</a>)}<a href="/panel">Panel interno</a></div>}
    </header>
  );
}

export function SiteFooter() {
  return <footer className="bg-rio-navy py-14 text-white"><div className="site-wrap grid gap-8 md:grid-cols-3"><div><p className="font-display text-4xl tracking-[.06em]">RÍO MX</p><p className="mt-3 text-sm text-white/55">Una iglesia viva en México. Ven como eres.</p></div><div className="text-sm leading-7 text-white/70"><p className="eyebrow mb-3 text-rio-mint">Reuniones</p>Domingos · 8:30 · 10:30 · 13:00 · 19:00<br/>Jueves · 20:00</div><div className="text-sm leading-7 text-white/70"><p className="eyebrow mb-3 text-rio-mint">RÍO Central</p>Av. Gran Canal 6692<br/>San Pedro el Chico · CDMX</div></div></footer>;
}

export function PageHero({ eyebrow, title, children, image }: { eyebrow: string; title: string; children: React.ReactNode; image?: string }) {
  return <><SiteHeader/><section className="bg-rio-paper pb-20 pt-10"><div className="site-wrap grid items-center gap-10 lg:grid-cols-2"><div><p className="eyebrow text-rio-coral">{eyebrow}</p><h1 className="display-section mt-5">{title}</h1><div className="mt-7 max-w-xl text-lg leading-8 text-slate-600">{children}</div></div>{image && <img src={image} alt="" className="aspect-[5/4] h-full w-full rounded-[2rem] object-cover"/>}</div></section></>;
}
