import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { connectDatabase } from './config/db';
import authRoutes from './routes/authRoutes';
import expenseRoutes from './routes/expenseRoutes';

const app = express();

app.set('trust proxy', 1);

const corsOptions: cors.CorsOptions = {
  origin: ['http://localhost:5173','https://expense-tracker-mern-frontend-black.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(helmet());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());

app.use(
  '/api/auth',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100
  }),
  authRoutes
);

app.use(
  '/api/expenses',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300
  }),
  expenseRoutes
);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const port = Number(process.env.PORT) || 5002;

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`API listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Startup failed:', error);
    process.exit(1);
  });

export default app;