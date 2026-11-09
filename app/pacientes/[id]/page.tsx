'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type PatientRecord = { id: string; full_name: string; age: number | null; city: string | null; created_at: string };

function PatientProfile({ id }: { id: string }) {
  const router = useRouter();
  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) { setError('Configura Supabase para consultar pacientes.'); setLoading(false); return; }
      const { data, error: queryError } = await supabase.from('patients').select('id, full_name, age, city, created_at').eq('id', id).maybeSingle();
      if (!active) return;
      if (queryError) setError('No se pudo cargar el perfil. Verifica la conexión y los permisos de acceso.');
      else setPatient(data as PatientRecord | null);
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, [id]);

  async function deletePatient() {
    if (!window.confirm('¿Eliminar este registro de paciente? Esta acción no se puede deshacer.')) return;
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    const { error: deleteError } = await supabase.from('patients').delete().eq('id', id);
    if (deleteError) { setError('No se pudo eliminar el registro. Comprueba los permisos.'); return; }
    router.push('/pacientes');
    router.refresh();
  }

  if (loading) return <p className="panel p-8 text-center text-sm text-slate-500">Cargando perfil…</p>;
  if (error || !patient) return <div className="panel p-6"><p role="alert" className="text-sm text-slate-600">{error || 'No se encontró el paciente o no tienes permiso para verlo.'}</p><Link className="mt-4 inline-block text-sm font-medium text-brand-600" href="/pacientes">Volver a pacientes</Link></div>;

  return <div className="space-y-6"><section className="panel p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 font-semibold text-brand-700" aria-hidden="true">{patient.full_name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div><div><h2 className="text-2xl font-semibold text-slate-800">{patient.full_name}</h2><p className="text-sm text-slate-500">Registro de paciente</p></div></div><div className="flex flex-wrap gap-3"><button onClick={deletePatient} className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50">Eliminar registro</button><Link href="/pacientes" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Volver</Link></div></div></section><section className="panel p-5 md:p-6"><h3 className="text-lg font-semibold text-slate-800">Información básica</h3><dl className="mt-5 grid gap-5 sm:grid-cols-2"><div><dt className="text-sm text-slate-500">Edad</dt><dd className="mt-1 font-medium text-slate-800">{patient.age == null ? 'No indicada' : `${patient.age} años`}</dd></div><div><dt className="text-sm text-slate-500">Localidad</dt><dd className="mt-1 font-medium text-slate-800">{patient.city || 'No indicada'}</dd></div><div><dt className="text-sm text-slate-500">Fecha de registro</dt><dd className="mt-1 font-medium text-slate-800">{new Date(patient.created_at).toLocaleDateString('es-ES')}</dd></div></dl><p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">Esta versión guarda únicamente información administrativa básica. No se registran diagnósticos ni notas clínicas.</p></section></div>;
}

export default function PatientProfilePage({ params }: { params: { id: string } }) {
  return <AuthGuard><div className="flex min-h-screen bg-slate-100"><Sidebar /><main className="min-w-0 flex-1"><Topbar title="Perfil del paciente" /><div className="space-y-6 p-4 md:p-6 xl:p-8"><PatientProfile id={params.id} /></div></main></div></AuthGuard>;
}
