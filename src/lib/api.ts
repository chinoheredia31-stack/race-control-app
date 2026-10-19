// src/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://race-control-backend-dewc.onrender.com/api';

// Obtener tabla general de posiciones de un campeonato
export async function getChampionshipStandings(championshipId: string) {
  const res = await fetch(`${API_BASE_URL}/standings/${championshipId}`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Error al obtener la tabla de posiciones');
  return res.json();
}

// Obtener todas las carreras/fechas con sus resultados
export async function getChampionshipRaces(championshipId: string) {
  const res = await fetch(`${API_BASE_URL}/races/${championshipId}`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Error al obtener las carreras');
  return res.json();
}

// Configurar o actualizar la escala de puntos
export async function setScoringRules(championshipId: string, scoringRules: { position: number; points: number }[]) {
  const res = await fetch(`${API_BASE_URL}/championships/${championshipId}/scoring`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scoringRules }),
  });
  return res.json();
}

// Subir el JSON de RaceRoom
export async function uploadRaceJson(championshipId: string, roundNumber: number, jsonContent: object) {
  const res = await fetch(`${API_BASE_URL}/races/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ championshipId, roundNumber, jsonContent }),
  });
  return res.json();
}

// Editar manualmente el resultado de un piloto (sanción/recargo)
export async function updateResultManual(resultId: string, newPosition: number, newPoints: number) {
  const res = await fetch(`${API_BASE_URL}/results/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resultId, newPosition, newPoints }),
  });
  return res.json();
}