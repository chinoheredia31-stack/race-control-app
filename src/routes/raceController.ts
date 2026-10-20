import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/standings - Obtener la tabla general de posiciones
router.get('/standings', async (_req: Request, res: Response) => {
  try {
    // Si tu modelo en schema.prisma se llama diferente (ej: standing, driverStanding), ajústalo aquí
    const standings = await prisma.standings.findMany();
    res.json(standings);
  } catch (error) {
    console.error('Error al obtener la tabla de posiciones:', error);
    res.status(500).json({ error: 'Error interno al consultar las posiciones' });
  }
});

// GET /api/races - Obtener el listado de carreras
router.get('/races', async (_req: Request, res: Response) => {
  try {
    const races = await prisma.race.findMany();
    res.json(races);
  } catch (error) {
    console.error('Error al obtener las carreras:', error);
    res.status(500).json({ error: 'Error interno al consultar las carreras' });
  }
});

// POST /api/championships/:championshipId/scoring - Configurar la escala de puntos
router.post('/championships/:championshipId/scoring', async (req: Request, res: Response) => {
  try {
    const { championshipId } = req.params;
    const { scoringRules } = req.body;

    // Lógica para guardar o actualizar las reglas de puntaje
    res.json({ message: 'Escala de puntos actualizada correctamente', championshipId, scoringRules });
  } catch (error) {
    console.error('Error al actualizar la escala de puntos:', error);
    res.status(500).json({ error: 'Error interno al guardar la escala de puntos' });
  }
});

export default router;