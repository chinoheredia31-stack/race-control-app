# RFC-001: Arquitectura y Estado de Implementación — ESRA Race Control App

* **Estado:** IMPLEMENTADO / DEPLOYED EN NUBE
* **Fecha:** 18 de Octubre, 2026
* **Repositorio GitHub:** https://github.com/chinoheredia31-stack/race-control-app
* **URL Backend (Render):** https://race-control-backend-dewc.onrender.com
* **Base de Datos:** PostgreSQL en Neon.tech

---

## 1. Visión General del Sistema
Sistema de gestión de campeonatos y cómputos de carreras para sim racing (**Esport Racing Argentina**), diseñado para procesar de forma automática los logs en formato JSON generados por el servidor dedicado de **RaceRoom Racing Experience**, aplicar reglamentos de puntaje configurables, permitir correcciones manuales post-comisariato y calcular la tabla general con criterios de desempate oficial del automovilismo.

---

## 2. Arquitectura de Datos (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Championship {
  id            String          @id @default(uuid())
  name          String
  description   String?
  scoringSystem ScoringSystem[]
  races         Race[]
}

model ScoringSystem {
  id             String       @id @default(uuid())
  championshipId String
  championship   Championship @relation(fields: [championshipId], references: [id], onDelete: Cascade)
  position       Int
  points         Float
  polePoints     Float        @default(0)
  fastestLapPts  Float        @default(0)

  @@unique([championshipId, position])
}

model Race {
  id             String       @id @default(uuid())
  championshipId String
  championship   Championship @relation(fields: [championshipId], references: [id], onDelete: Cascade)
  roundNumber    Int
  trackName      String
  results        Result[]
}

model Result {
  id          String   @id @default(uuid())
  raceId      String
  race        Race     @relation(fields: [raceId], references: [id], onDelete: Cascade)
  driverName  String
  raceNumber  Int      @default(1) // 1 = Carrera 1, 2 = Carrera 2
  position    Int
  points      Float
  isManual    Boolean  @default(false)
}