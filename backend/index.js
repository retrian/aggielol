// backend/index.js

import 'dotenv/config';
import express from 'express';
import cron from 'node-cron';
import { pool } from './db/pool.js';
import { syncAllAccounts } from './services/riotSync.js';
import adminRouter from './routes/admin.js';
import playersRouter from './routes/players.js';
import teamsRouter from './routes/teams.js';
import leaderboardRouter from './routes/leaderboard.js';
import schoolYearsRouter from './routes/schoolYears.js';

const app = express();

// Manual CORS configuration
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow main domain and any vercel preview
  if (origin && (
    origin === 'https://aggielol.vercel.app' ||
    origin.includes('vercel.app') ||
    origin.includes('localhost')
  )) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    console.log('🔧 CORS preflight request from:', origin);
    res.status(200).end();
    return;
  }
  
  console.log('🌐 Request from origin:', origin);
  next();
});

app.use(express.json());

const key = process.env.RIOT_KEY ?? '';
if (!key) {
  console.error('⛔  RIOT_KEY is not set in the environment (.env)');
  process.exit(1);
}
// Print only the first 8 chars so you don't leak the whole key
console.log('🔑 RIOT_KEY loaded:', key.slice(0, 8) + '…');

// Log and verify DATABASE_URL
console.log('▶️ DATABASE_URL:', process.env.DATABASE_URL);

// Test initial Postgres connection
pool.connect()
  .then(client => {
    console.log('✅ Connected to Postgres');
    client.release();
  })
  .catch(err => {
    console.error('❌ Failed to connect to Postgres:', err);
  });

app.use('/api/admin', adminRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/school_years', schoolYearsRouter);
app.use('/api/players', playersRouter);
app.use('/api/leaderboard', leaderboardRouter);

app.get('/api/health', (_req, res) => res.send('OK'));

app.get('/api/cors-test', (req, res) => {
  console.log('🧪 CORS Test - Origin:', req.headers.origin);
  res.json({ 
    message: 'CORS test successful',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 4000;

// ── Prevent overlapping syncs ──────────────────────────────────────────────
let isSyncing = false;

// Run one sync on startup
(async () => {
  if (!isSyncing) {
    isSyncing = true;
    try {
      await syncAllAccounts();
    } catch (err) {
      console.error('Initial Riot sync failed:', err.message);
    }
    isSyncing = false;
  }
})();

// Schedule a sync every 30 minutes (no overlap)
cron.schedule('*/30 * * * *', async () => {
  if (isSyncing) {
    console.log('⏱  Riot sync already in progress—skipping this tick.');
    return;
  }

  isSyncing = true;
  console.log('⏰  Cron Riot sync…');

  try {
    await syncAllAccounts();
    console.log('✅  Cron Riot sync done');
  } catch (err) {
    console.error('❌  Cron Riot sync failed:', err.message);
  }

  isSyncing = false;
});

app.listen(PORT, () =>
  console.log(`🚀  Backend listening on http://localhost:${PORT}`)
);