// src/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://race-control-backend-dewc.onrender.com/api';

// 1. Obtener la tabla general de posiciones
export async function getChampionshipStandings(championshipId?: string) {
  try {
    const url = championshipId 
      ? `${API_BASE_URL}/standings/${championshipId}`
      : `${API_BASE_URL}/standings`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Error HTTP en getChampionshipStandings:', res.status);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error al obtener la tabla de posiciones:', error);
    return []; // Retorna array vacío para evitar que Vercel tire 500
  }
}

// 2. Obtener todas las carreras/fechas
export async function getChampionshipRaces(championshipId?: string) {
  try {
    const url = championshipId 
      ? `${API_BASE_URL}/races/${championshipId}`
      : `${API_BASE_URL}/races`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Error HTTP en getChampionshipRaces:', res.status);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error al obtener las carreras:', error);
    return [];
  }
}

// 3. Configurar o actualizar la escala de puntos
export async function setScoringRules(championshipId: string, scoringRules: { position: number; points: number }[]) {
  try {
    const res = await fetch(`${API_BASE_URL}/championships/${championshipId}/scoring`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scoringRules }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('Error en setScoringRules:', error);
    return { error: 'No se pudieron guardar las reglas de puntaje' };
  }
}

// 4. Subir el JSON de RaceRoom
export async function uploadRaceJson(championshipId: string, roundNumber: number, jsonContent: object) {
  try {
    const res = await fetch(`${API_BASE_URL}/races/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ championshipId, roundNumber, jsonContent }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('Error al subir JSON de carrera:', error);
    return { error: 'Error al procesar el archivo JSON' };
  }
}

// 5. Editar manualmente el resultado de un piloto
export async function updateResultManual(resultId: string, newPosition: number, newPoints: number) {
  try {
    const res = await fetch(`${API_BASE_URL}/results/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resultId, newPosition, newPoints }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('Error en updateResultManual:', error);
    return { error: 'No se pudo actualizar el resultado manualmente' };
  }
}