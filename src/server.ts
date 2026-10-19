import express from 'express';
import cors from 'cors';
import raceRoutes from './routes/raceController';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api', raceRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor ESRA corriendo en el puerto ${PORT}`);
});