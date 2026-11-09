'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function PatientForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const cleanName = name.trim();
    if (!cleanName || cleanName.length > 120) { setError('El nombre es obligatorio y no puede superar 120 caracteres.'); return; }
    const parsedAge = age === '' ? null : Number(age);
    if (parsedAge !== null && (!Number.isInteger(parsedAge) || parsedAge < 0 || parsedAge > 130)) { setError('La edad debe ser un número entero entre 0 y 130.'); return; }
    if (city.trim().length > 120) { setError('La localidad no puede superar 120 caracteres.'); return; }
    const supabase = createSupabaseBrowserClient();
    if (!supabase) { setError('Configura Supabase antes de registrar pacientes.'); return; }

    setSubmitting(true);
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) { setSubmitting(false); setError('Tu sesión expiró. Inicia sesión de nuevo.'); return; }
    const { error: insertError } = await supabase.from('patients').insert({
      created_by: authData.user.id,
      full_name: cleanName,
      age: parsedAge,
      city: city.trim() || null,
    });
    setSubmitting(false);
    if (insertError) { setError('No se pudo guardar el registro. Comprueba los permisos y vuelve a intentarlo.'); return; }
    router.push('/pacientes');
    router.refresh();
  }

  return (
    <form className="panel p-5 md:p-6" onSubmit={handleSubmit} noValidate>
      <p className="muted-label">Registro administrativo</p><h2 className="mt-2 text-2xl font-semibold text-slate-800">Registrar paciente</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">En esta etapa solo se solicitan datos de identificación básicos. No añadas datos clínicos en este formulario.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2"><label htmlFor="full_name" className="mb-2 block text-sm font-medium text-slate-700">Nombre completo <span aria-hidden="true">*</span></label><input id="full_name" autoComplete="name" maxLength={120} required value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 focus:border-brand-500" /></div>
        <div><label htmlFor="age" className="mb-2 block text-sm font-medium text-slate-700">Edad <span className="font-normal text-slate-400">(opcional)</span></label><input id="age" type="number" min="0" max="130" step="1" value={age} onChange={(event) => setAge(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 focus:border-brand-500" /></div>
        <div><label htmlFor="city" className="mb-2 block text-sm font-medium text-slate-700">Localidad <span className="font-normal text-slate-400">(opcional)</span></label><input id="city" maxLength={120} value={city} onChange={(event) => setCity(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 focus:border-brand-500" /></div>
      </div>
      {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div className="mt-6 flex flex-wrap gap-3"><button disabled={submitting} type="submit" className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">{submitting ? 'Guardando…' : 'Guardar paciente'}</button><Link href="/pacientes" className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancelar</Link></div>
    </form>
  );
}
