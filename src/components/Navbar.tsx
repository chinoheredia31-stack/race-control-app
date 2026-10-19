// src/components/Navbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Tabla General', href: '/standings' },
    { name: 'Fechas y Resultados', href: '/races' },
    { name: 'Panel Admin', href: '/admin' },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
        
        {/* LOGO / NOMBRE LIGA */}
        <Link href="/standings" className="flex items-center gap-2">
          <span className="bg-red-600 text-white font-black text-xs px-2 py-1 rounded tracking-widest">
            ESRA
          </span>
          <span className="font-extrabold text-slate-100 text-lg uppercase tracking-wider hidden sm:inline">
            Esport Racing Argentina
          </span>
        </Link>

        {/* ENLACES DE NAVEGACIÓN */}
        <div className="flex space-x-1 sm:space-x-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-xs sm:text-sm font-bold uppercase tracking-wider transition ${
                  isActive
                    ? 'bg-red-600/10 text-red-500 border border-red-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

      </div>
    </nav>
  );
};