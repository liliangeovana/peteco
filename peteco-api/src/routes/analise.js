import { Router } from 'express';
import axios from 'axios';

const router = Router();
const IA_URL = process.env.IA_SERVICE_URL || 'http://localhost:5000';

router.get('/clusters', async (req, res) => {
  try {
    const { data } = await axios.get(`${IA_URL}/clusters`);
    res.json(data);
  } catch (err) {
    res.status(502).json({ erro: 'Microsserviço de IA indisponível' });
  }
});

router.get('/estatisticas', async (req, res) => {
  try {
    const { data } = await axios.get(`${IA_URL}/estatisticas`);
    res.json(data);
  } catch (err) {
    res.status(502).json({ erro: 'Microsserviço de IA indisponível' });
  }
});

export default router;
