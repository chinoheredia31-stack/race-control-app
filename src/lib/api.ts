const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function setScoringRules(championshipId: string, scoringRules: { position: number; points: number }[]) {
  const res = await fetch(`${API_BASE_URL}/championships/${championshipId}/scoring`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scoringRules }),
  });
  return res.json();
}

export async function uploadRaceJson(championshipId: string, roundNumber: number, jsonContent: object) {
  const res = await fetch(`${API_BASE_URL}/races/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ championshipId, roundNumber, jsonContent }),
  });
  return res.json();
}

export async function updateResultManual(resultId: string, newPosition: number, newPoints: number) {
  const res = await fetch(`${API_BASE_URL}/results/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resultId, newPosition, newPoints }),
  });
  return res.json();
}

export async function getChampionshipStandings(championshipId: string) {
  const res = await fetch(`${API_BASE_URL}/standings/${championshipId}`);
  return res.json();
}