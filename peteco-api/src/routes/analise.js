import { Router } from 'express';
import axios from 'axios';
import { autenticar } from '../middlewares/auth.js';

const router = Router();
const IA_URL = process.env.IA_SERVICE_URL || 'http://localhost:5000';
const IA_SERVICE_KEY = process.env.IA_SERVICE_KEY;
const iaHeaders = IA_SERVICE_KEY ? { Authorization: `Bearer ${IA_SERVICE_KEY}` } : {};

async function chamarIA(endpoint, res) {
  try {
    const { data } = await axios.get(`${IA_URL}/${endpoint}`, { headers: iaHeaders });
    res.json(data);
  } catch {
    res.status(502).json({ erro: 'Microsserviço de IA indisponível' });
  }
}

router.get('/clusters',    autenticar, (req, res) => chamarIA('clusters', res));
router.get('/estatisticas', autenticar, (req, res) => chamarIA('estatisticas', res));

export default router;
