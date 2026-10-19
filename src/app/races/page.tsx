// app/races/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { getChampionshipRaces } from '@/lib/api';

interface Result {
  id: string;
  driverName: string;
  raceNumber: number;
  position: number;
  points: number;
  isManual: boolean;
}

interface Race {
  id: string;
  roundNumber: number;
  trackName: string;
  results: Result[];
}

export default function RacesPage() {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRaces() {
      try {
        const data = await getChampionshipRaces('campeonato-2026');
        setRaces(data);
      } catch (err) {
        console.error('Error cargando fechas:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRaces();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="border-b border-slate-800 pb-4">
          <span className="text-xs font-extrabold text-red-500 uppercase tracking-widest">
            Esport Racing Argentina
          </span>
          <h1 className="text-3xl font-black uppercase text-slate-100 tracking-tight">
            Calendario y Resultados por Fecha
          </h1>
        </header>

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-mono text-sm animate-pulse">
            Cargando fechas de carreras...
          </div>
        ) : (
          <div className="space-y-8">
            {races.map((race) => {
              const c1 = race.results.filter(r => r.raceNumber === 1).sort((a, b) => a.position - b.position);
              const c2 = race.results.filter(r => r.raceNumber === 2).sort((a, b) => a.position - b.position);

              return (
                <div key={race.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
                  
                  {/* TÍTULO DE LA FECHA */}
                  <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Fecha {race.roundNumber}</span>
                      <h2 className="text-2xl font-black uppercase text-slate-100">{race.trackName}</h2>
                    </div>
                  </div>

                  {/* TABLAS DE RESULTADOS (Carrera 1 / Carrera 2) */}
                  <div className={`grid gap-6 ${c2.length > 0 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                    
                    {/* Carrera 1 */}
                    <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800">
                      <h3 className="text-sm font-bold text-red-400 mb-3 uppercase tracking-wide">Carrera 1</h3>
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-800/80 uppercase text-slate-400">
                          <tr>
                            <th className="p-2 text-center">Pos</th>
                            <th className="p-2">Piloto</th>
                            <th className="p-2 text-right">Pts</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {c1.map((r) => (
                            <tr key={r.id} className="hover:bg-slate-800/30">
                              <td className="p-2 text-center font-bold text-slate-200">{r.position}</td>
                              <td className="p-2 font-medium">
                                {r.driverName} {r.isManual && <span className="text-[10px] text-amber-400 ml-1">(Sanción/Ajuste)</span>}
                              </td>
                              <td className="p-2 text-right font-extrabold text-emerald-400">+{r.points}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Carrera 2 (Si aplica) */}
                    {c2.length > 0 && (
                      <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800">
                        <h3 className="text-sm font-bold text-red-400 mb-3 uppercase tracking-wide">Carrera 2</h3>
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-slate-800/80 uppercase text-slate-400">
                            <tr>
                              <th className="p-2 text-center">Pos</th>
                              <th className="p-2">Piloto</th>
                              <th className="p-2 text-right">Pts</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/50">
                            {c2.map((r) => (
                              <tr key={r.id} className="hover:bg-slate-800/30">
                                <td className="p-2 text-center font-bold text-slate-200">{r.position}</td>
                                <td className="p-2 font-medium">
                                  {r.driverName} {r.isManual && <span className="text-[10px] text-amber-400 ml-1">(Sanción/Ajuste)</span>}
                                </td>
                                <td className="p-2 text-right font-extrabold text-emerald-400">+{r.points}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                  </div>

                </div>
              );
            })}
            {races.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                No hay carreras disputadas registradas en el sistema.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}