import { SignInForm } from '@/components/auth/sign-in-form';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft lg:grid-cols-[1fr_0.9fr]">
        <section className="flex flex-col justify-center bg-brand-700 px-8 py-12 text-white md:px-12">
          <div className="mb-8 inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em]">
            Plataforma para especialistas
          </div>
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">Sistema de Rehabilitación Cognitiva</h1>
          <p className="mt-5 max-w-lg leading-7 text-brand-50">
            Espacio de trabajo para administrar pacientes y, progresivamente, acompañar actividades de estimulación cognitiva.
          </p>
          <p className="mt-10 text-sm text-brand-100">Acceso restringido a cuentas autorizadas.</p>
        </section>
        <section className="flex items-center justify-center px-6 py-10 md:px-10">
          <div className="w-full max-w-md"><SignInForm /></div>
        </section>
      </div>
    </main>
  );
}
