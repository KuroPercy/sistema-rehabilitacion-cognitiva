'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Patient } from '@/lib/mock-data';

export function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadPatients() {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) { setError('Configura Supabase para consultar pacientes.'); setLoading(false); return; }
      const { data, error: queryError } = await supabase.from('patients').select('id, full_name, age, city, created_at').order('created_at', { ascending: false });
      if (!active) return;
      if (queryError) setError('No se pudieron cargar los pacientes. Verifica la conexión y los permisos de acceso.');
      else setPatients((data ?? []) as Patient[]);
      setLoading(false);
    }
    void loadPatients();
    return () => { active = false; };
  }, []);

  const filtered = patients.filter((patient) => `${patient.full_name} ${patient.city ?? ''}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="panel p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div><p className="muted-label">Gestión</p><h2 className="mt-1 text-2xl font-semibold text-slate-800">Pacientes</h2><p className="mt-1 text-sm text-slate-500">Los registros se consultan desde la base de datos configurada.</p></div>
        <Link href="/pacientes/nuevo" className="inline-flex justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700">Registrar paciente</Link>
      </div>
      <label className="mb-4 flex max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-500">
        <Search size={17} /><span className="sr-only">Buscar por nombre o localidad</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre o localidad" className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400" />
      </label>
      {loading ? <p className="py-10 text-center text-sm text-slate-500">Cargando pacientes…</p> : error ? <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center"><p className="font-medium text-slate-700">{search ? 'No hay resultados para esa búsqueda.' : 'Todavía no hay pacientes registrados.'}</p><p className="mt-2 text-sm text-slate-500">{search ? 'Prueba con otro nombre o localidad.' : 'Cuando registres un paciente aparecerá en esta lista.'}</p></div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200"><table className="w-full min-w-[620px] text-left text-sm text-slate-600"><thead className="bg-slate-50 text-slate-700"><tr><th className="px-4 py-3 font-medium">Nombre</th><th className="px-4 py-3 font-medium">Edad</th><th className="px-4 py-3 font-medium">Localidad</th><th className="px-4 py-3 font-medium">Acción</th></tr></thead><tbody>{filtered.map((patient) => <tr key={patient.id} className="border-t border-slate-200 bg-white"><td className="px-4 py-3 font-medium text-slate-800">{patient.full_name}</td><td className="px-4 py-3">{patient.age == null ? '—' : `${patient.age} años`}</td><td className="px-4 py-3">{patient.city || '—'}</td><td className="px-4 py-3"><Link href={`/pacientes/${patient.id}`} className="font-medium text-brand-600 hover:text-brand-700">Ver perfil</Link></td></tr>)}</tbody></table></div>
      )}
    </section>
  );
}
