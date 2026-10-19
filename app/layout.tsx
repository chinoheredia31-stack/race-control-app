// app/layout.tsx
import './globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata = {
  title: 'ESRA — Esport Racing Argentina',
  description: 'Sistema de gestión de campeonatos y cómputos para sim racing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="bg-slate-950 text-slate-100">
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}