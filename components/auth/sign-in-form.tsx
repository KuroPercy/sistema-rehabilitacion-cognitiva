'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient, getSupabaseConfigError } from '@/lib/supabase/client';

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const configError = getSupabaseConfigError();
    if (configError) {
      setError(configError);
      return;
    }
    if (!email.trim() || !password) {
      setError('Completa el correo y la contraseña.');
      return;
    }

    setSubmitting(true);
    const { error: authError } = await createSupabaseBrowserClient()!.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSubmitting(false);

    if (authError) {
      setError('No se pudo iniciar sesión. Revisa las credenciales o contacta al administrador.');
      return;
    }
    router.replace('/dashboard');
    router.refresh();
  }

  return (
    <div>
      <p className="muted-label">Acceso seguro</p>
      <h2 className="mt-2 text-3xl font-semibold text-slate-800">Iniciar sesión</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">Usa las credenciales de una cuenta autorizada por el administrador.</p>

      <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Correo electrónico</label>
          <input id="email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 focus:border-brand-500 focus:bg-white" />
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Contraseña</label>
          <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 focus:border-brand-500 focus:bg-white" />
        </div>
        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={submitting} className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? 'Verificando…' : 'Entrar'}
        </button>
      </form>
      <p className="mt-6 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">El acceso se valida con Supabase Auth. Esta aplicación no crea cuentas desde la pantalla de inicio.</p>
    </div>
  );
}
