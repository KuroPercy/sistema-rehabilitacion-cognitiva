import { AuthGuard } from '@/components/auth/auth-guard';
import { DashboardOverview, DashboardSummaryCards } from '@/components/dashboard/summary-cards';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';

export default function DashboardPage() {
  return <AuthGuard><div className="flex min-h-screen bg-slate-100"><Sidebar /><main className="min-w-0 flex-1"><Topbar title="Inicio" /><div className="space-y-6 p-4 md:p-6 xl:p-8"><DashboardSummaryCards /><DashboardOverview /></div></main></div></AuthGuard>;
}
