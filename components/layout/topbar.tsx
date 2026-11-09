'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '/dashboard', label: 'Inicio' },
  { href: '/pacientes', label: 'Pacientes' },
  { href: '/pacientes/nuevo', label: 'Registrar paciente' },
];

export function Topbar({ title }: { title: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="sticky top-0 z-20 border-b border-slate-200 bg-white"><div className="flex min-h-[76px] items-center justify-between gap-4 px-4 py-3 md:px-6 xl:px-8"><div className="flex items-center gap-3"><button aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button><div><p className="text-xs text-slate-500">Panel de especialista</p><h1 className="text-xl font-semibold text-slate-800">{title}</h1></div></div><span className="hidden rounded-full bg-mint-50 px-3 py-1.5 text-xs font-medium text-green-800 sm:inline-flex">Conexión protegida por Supabase</span></div>{menuOpen && <nav aria-label="Navegación móvil" className="grid gap-1 border-t border-slate-200 p-3 lg:hidden">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100">{link.label}</Link>)}</nav>}</header>;
}
