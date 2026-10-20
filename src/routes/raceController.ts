import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/standings - Retorna campeonatos con su sistema de puntuación y carreras
router.get('/standings', async (_req: Request, res: Response) => {
  try {
    const championships = await prisma.championship.findMany({
      include: {
        scoringSystem: true,
        races: true,
      },
    });
    res.json(championships);
  } catch (error: any) {
    console.error('Error al consultar campeonatos:', error);
    res.status(500).json({ 
      error: 'Error al consultar la base de datos', 
      details: error.message 
    });
  }
});

// GET /api/races - Retorna el listado de carreras
router.get('/races', async (_req: Request, res: Response) => {
  try {
    const races = await prisma.race.findMany();
    res.json(races);
  } catch (error: any) {
    console.error('Error al obtener carreras:', error);
    res.status(500).json({ error: 'Error interno al consultar las carreras' });
  }
});

// POST /api/championships/:championshipId/scoring - Configura las reglas de puntuación
router.post('/championships/:championshipId/scoring', async (req: Request, res: Response) => {
  try {
    const { championshipId } = req.params;
    const { scoringRules } = req.body;
    res.json({ message: 'Escala de puntos recibida', championshipId, scoringRules });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar la escala de puntos' });
  }
});

export default router;