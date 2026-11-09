'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FileUser, LayoutGrid, LogOut, PlusCircle } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const links = [
  { href: '/dashboard', label: 'Inicio', icon: LayoutGrid },
  { href: '/pacientes', label: 'Pacientes', icon: FileUser },
  { href: '/pacientes/nuevo', label: 'Registrar paciente', icon: PlusCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  async function signOut() {
    await createSupabaseBrowserClient()?.auth.signOut();
    router.replace('/');
  }
  return <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 lg:flex"><Link href="/dashboard" className="flex items-center gap-3 border-b border-slate-200 px-2 pb-5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-sm font-semibold text-brand-700">RC</span><span><span className="block font-semibold text-slate-800">Rehabilitación</span><span className="block text-xs text-slate-500">Cognitiva</span></span></Link><nav aria-label="Navegación principal" className="mt-7 space-y-1">{links.map(({ href, label, icon: Icon }) => { const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href)); return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${active ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-brand-700'}`}><Icon size={18} />{label}</Link>; })}</nav><div className="mt-auto rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Sesión de especialista</p><button onClick={signOut} className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:text-brand-700"><LogOut size={17} />Cerrar sesión</button></div></aside>;
}
