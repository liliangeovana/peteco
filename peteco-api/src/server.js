import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import petsRouter from './routes/pets.js';
import analiseRouter from './routes/analise.js';
import authRouter from './routes/auth.js';

dotenv.config();

if (!process.env.SESSION_SECRET) {
  console.warn('[peteco-api] AVISO: SESSION_SECRET não definido — configure em .env');
}

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:8081',  // Expo web/Metro
  'http://localhost:19006', // Expo Go web
];
app.use(cors({
  origin: (origin, callback) => {
    // permite requisições sem origin (React Native nativo, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('CORS: origem não permitida'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'peteco-dev-inseguro',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  },
}));

app.use('/auth', authRouter);
app.use('/pets', petsRouter);
app.use('/analise', analiseRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`PETECO API rodando na porta ${PORT}`));
