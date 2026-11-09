import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sistema de Rehabilitación Cognitiva',
  description: 'Gestión segura de pacientes para especialistas.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
