<tbody className="divide-y divide-slate-800/60">
  {standings.map((driver, idx) => {
    const pos = idx + 1;
    
    // Extracción segura para evitar fallos si positionsCount es undefined
    const positionsCount = driver.positionsCount || {};
    const p1 = positionsCount[1] || 0;
    const p2 = positionsCount[2] || 0;
    const p3 = positionsCount[3] || 0;
    
    const driverName = driver.driverName || (driver as any).name || 'Piloto';
    const totalPoints = driver.totalPoints ?? 0;

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
  {standings.length === 0 && (
    <tr>
      <td colSpan={5} className="p-12 text-center text-slate-500">
        No hay resultados registrados en este campeonato aún.
      </td>
    </tr>
  )}
</tbody>