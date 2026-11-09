import { AuthGuard } from '@/components/auth/auth-guard';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { PatientForm } from '@/components/pacientes/patient-form';

export default function NewPatientPage() {
  return <AuthGuard><div className="flex min-h-screen bg-slate-100"><Sidebar /><main className="min-w-0 flex-1"><Topbar title="Registrar paciente" /><div className="p-4 md:p-6 xl:p-8"><PatientForm /></div></main></div></AuthGuard>;
}
