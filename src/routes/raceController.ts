import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Configurar o actualizar la escala de puntos
router.post('/championships/:championshipId/scoring', async (req: Request, res: Response) => {
  try {
    const { championshipId } = req.params;
    const { scoringRules } = req.body;

    await prisma.$transaction(async (tx) => {
      await tx.scoringSystem.deleteMany({ where: { championshipId } });
      for (const rule of scoringRules) {
        await tx.scoringSystem.create({
          data: {
            championshipId,
            position: rule.position,
            points: rule.points,
            polePoints: rule.polePoints || 0,
            fastestLapPts: rule.fastestLapPts || 0,
          },
        });
      }
    });

    return res.status(200).json({ message: 'Escala de puntos actualizada correctamente.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Cargar archivo JSON de RaceRoom
router.post('/races/upload', async (req: Request, res: Response) => {
  try {
    const { championshipId, roundNumber, jsonContent } = req.body;

    if (!championshipId || !roundNumber || !jsonContent) {
      return res.status(400).json({ error: 'Faltan parámetros obligatorios.' });
    }

    const scoringRules = await prisma.scoringSystem.findMany({ where: { championshipId } });
    const pointsMap: Record<number, number> = {};
    scoringRules.forEach((rule) => {
      pointsMap[rule.position] = rule.points;
    });

    const raceSessions = jsonContent.Sessions?.filter((s: any) => s.Type === 'Race') || [];
    if (raceSessions.length === 0) {
      return res.status(400).json({ error: 'El archivo JSON no contiene carreras.' });
    }

    const createdRace = await prisma.$transaction(async (tx) => {
      const race = await tx.race.create({
        data: {
          championshipId,
          roundNumber: Number(roundNumber),
          trackName: jsonContent.TrackName || 'Circuito Desconocido',
        },
      });

      for (let index = 0; index < raceSessions.length; index++) {
        const session = raceSessions[index];
        const raceNumber = index + 1;

        for (const r of session.RaceResults || []) {
          const pos = r.Position;
          const assignedPoints = pointsMap[pos] ?? 0;

          await tx.result.create({
            data: {
              raceId: race.id,
              raceNumber,
              driverName: r.FullName || `${r.Forename} ${r.Surname}`,
              position: pos,
              points: assignedPoints,
              isManual: false,
            },
          });
        }
      }
      return race;
    });

    return res.status(201).json({ message: 'Fecha cargada exitosamente.', raceId: createdRace.id });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Ajuste manual de sanciones / recargos
router.put('/results/update', async (req: Request, res: Response) => {
  try {
    const { resultId, newPosition, newPoints } = req.body;

    const updated = await prisma.result.update({
      where: { id: resultId },
      data: {
        position: newPosition,
        points: newPoints,
        isManual: true,
      },
    });

    return res.status(200).json({ message: 'Resultado modificado manualmente.', data: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Obtener tabla general con desempate por posiciones espejo FIA
router.get('/standings/:championshipId', async (req: Request, res: Response) => {
  try {
    const { championshipId } = req.params;

    const races = await prisma.race.findMany({
      where: { championshipId },
      include: { results: true },
    });

    interface DriverStats {
      driverName: string;
      totalPoints: number;
      positionsCount: Record<number, number>;
    }

    const driverMap: Record<string, DriverStats> = {};

    races.forEach((race) => {
      race.results.forEach((resItem) => {
        if (!driverMap[resItem.driverName]) {
          driverMap[resItem.driverName] = {
            driverName: resItem.driverName,
            totalPoints: 0,
            positionsCount: {},
          };
        }

        driverMap[resItem.driverName].totalPoints += resItem.points;
        const pos = resItem.position;
        driverMap[resItem.driverName].positionsCount[pos] =
          (driverMap[resItem.driverName].positionsCount[pos] || 0) + 1;
      });
    });

    const standings = Object.values(driverMap);

    standings.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      for (let pos = 1; pos <= 30; pos++) {
        const countA = a.positionsCount[pos] || 0;
        const countB = b.positionsCount[pos] || 0;
        if (countB !== countA) {
          return countB - countA;
        }
      }
      return 0;
    });

    return res.status(200).json(standings);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;