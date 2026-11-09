'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createSupabaseBrowserClient, getSupabaseConfigError } from '@/lib/supabase/client';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'allowed' | 'denied' | 'config-error'>('checking');

  useEffect(() => {
    const configError = getSupabaseConfigError();
    if (configError) {
      setStatus('config-error');
      return;
    }

    const supabase = createSupabaseBrowserClient()!;
    let mounted = true;

    async function checkUser(user: User | null) {
      if (!user) {
        if (mounted) router.replace('/');
        return;
      }
      const { data, error } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (!mounted) return;
      setStatus(!error && data?.role === 'specialist' ? 'allowed' : 'denied');
    }

    void supabase.auth.getUser().then(({ data }) => checkUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.replace('/');
      } else {
        void checkUser(session.user);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [router]);

  if (status === 'allowed') return <>{children}</>;

  const message = status === 'config-error'
    ? 'Falta configurar la conexión con Supabase. Consulta el archivo README.'
    : status === 'denied'
      ? 'Esta cuenta no tiene un perfil de especialista habilitado. Solicita acceso al administrador.'
      : 'Comprobando acceso…';

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="panel max-w-lg p-6 text-center">
        <p className="font-medium text-slate-800">{message}</p>
        {status === 'denied' && <button className="mt-4 text-sm font-medium text-brand-600" onClick={async () => { await createSupabaseBrowserClient()?.auth.signOut(); router.replace('/'); }}>Cerrar sesión</button>}
      </div>
    </main>
  );
}
