'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, CalendarDays, ClipboardCheck } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function DashboardSummaryCards() {
  const [patientCount, setPatientCount] = useState<number | null>(null);
  useEffect(() => {
    let active = true;
    async function loadCount() {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) return;
      const { count } = await supabase.from('patients').select('id', { count: 'exact', head: true });
      if (active && count !== null) setPatientCount(count);
    }
    void loadCount();
    return () => { active = false; };
  }, []);
  const cards = [
    { title: 'Pacientes registrados', value: patientCount === null ? '—' : String(patientCount), icon: Users },
    { title: 'Sesiones', value: 'No disponible', icon: CalendarDays },
    { title: 'Actividades', value: 'No disponible', icon: ClipboardCheck },
  ];
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(({ title, value, icon: Icon }) => <article key={title} className="panel p-5"><div className="flex items-center justify-between"><span className="text-sm text-slate-500">{title}</span><Icon size={18} className="text-brand-600" /></div><p className="mt-5 text-2xl font-semibold text-slate-800">{value}</p></article>)}</div>;
}

export function DashboardOverview() {
  return <section className="panel flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between"><div><h2 className="text-lg font-semibold text-slate-800">Gestión de pacientes</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">Registra y consulta los datos administrativos de las personas atendidas. Las herramientas de sesiones y actividades se incorporarán cuando se definan sus requisitos.</p></div><Link href="/pacientes" className="shrink-0 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700">Abrir pacientes</Link></section>;
}
