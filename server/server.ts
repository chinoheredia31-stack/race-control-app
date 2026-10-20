import express from 'express';
import cors from 'cors';
import raceRoutes from './routes/raceController';

const app = express();

// Configuración de Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Ruta de Healthcheck (para verificar que el servicio está activo en Render)
app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

// Registrar rutas de la API bajo el prefijo /api
app.use('/api', raceRoutes);

// Manejo de rutas no encontradas (404) en la API
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Servidor ESRA corriendo exitosamente en el puerto ${PORT}`);
});