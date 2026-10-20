'use client';

import React, { useEffect, useState } from 'react';
import { getChampionshipStandings } from '@/lib/api';

interface DriverStanding {
  driverName?: string;
  totalPoints?: number;
  positionsCount?: Record<number, number>;
  [key: string]: any;
}

export default function StandingsPage() {
  const [standingsList, setStandingsList] = useState<DriverStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [championshipId, setChampionshipId] = useState('campeonato-2026');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getChampionshipStandings(championshipId);
        setStandingsList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error cargando standings:', err);
        setStandingsList([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [championshipId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* ENCABEZADO */}
        <header className="border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-xs font-extrabold text-red-500 uppercase tracking-widest">
              Esport Racing Argentina
            </span>
            <h1 className="text-3xl font-black uppercase text-slate-100 tracking-tight">
              Tabla General de Posiciones
            </h1>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded px-3 py-1 text-xs text-slate-400">
            Criterio de desempate FIA: <span className="text-slate-200 font-semibold">Puntos → Victorias (P1) → Puestos Altos</span>
          </div>
        </header>

        {/* TABLA PRINCIPAL */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 font-mono text-sm animate-pulse">
            Cargando posiciones del campeonato...
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/90 text-xs uppercase text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="p-4 text-center">Pos</th>
                    <th className="p-4">Piloto / Detalle</th>
                    <th className="p-4 text-center">Victorias (P1)</th>
                    <th className="p-4 text-center">Podios (P2 / P3)</th>
                    <th className="p-4 text-right">Puntos Totales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {standingsList.map((item, idx) => {
                    const pos = idx + 1;
                    const positionsCount = item.positionsCount || {};
                    const p1 = positionsCount[1] || 0;
                    const p2 = positionsCount[2] || 0;
                    const p3 = positionsCount[3] || 0;
                    const driverName = item.driverName || item.name || 'Piloto / Campeonato';
                    const totalPoints = item.totalPoints ?? 0;

                    return (
                      <tr 
                        key={driverName + idx} 
                        className={`hover:bg-slate-800/50 transition ${
                          pos === 1 ? 'bg-amber-500/5' : pos === 2 ? 'bg-slate-400/5' : pos === 3 ? 'bg-amber-700/5' : ''
                        }`}
                      >
                        <td className="p-4 text-center font-extrabold">
                          {pos === 1 && <span className="text-amber-400 text-lg">🥇 1</span>}
                          {pos === 2 && <span className="text-slate-300 text-lg">🥈 2</span>}
                          {pos === 3 && <span className="text-amber-600 text-lg">🥉 3</span>}
                          {pos > 3 && <span className="text-slate-500">{pos}</span>}
                        </td>
                        <td className="p-4 font-bold text-slate-100 text-base">
                          {driverName}
                        </td>
                        <td className="p-4 text-center font-mono font-bold text-amber-400">
                          {p1 > 0 ? p1 : '-'}
                        </td>
                        <td className="p-4 text-center font-mono text-slate-400">
                          {p2 + p3 > 0 ? `${p2} / ${p3}` : '-'}
                        </td>
                        <td className="p-4 text-right font-black text-emerald-400 text-lg font-mono">
                          {totalPoints} <span className="text-xs font-normal text-slate-500">pts</span>
                        </td>
                      </tr>
                    );
                  })}
                  {standingsList.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-500">
                        No hay resultados registrados en este campeonato aún.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}