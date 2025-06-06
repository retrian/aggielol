// backend/index.js

import 'dotenv/config';
import express from 'express';
import cron from 'node-cron';

import adminRouter from './routes/admin.js';
import playersRouter from './routes/players.js';
import teamsRouter from './routes/teams.js';
import leaderboardRouter from './routes/leaderboard.js';
import schoolYearsRouter from './routes/schoolYears.js';

import { syncAllAccounts } from './services/riotSync.js'; // adjust path if needed

const app = express();
app.use(express.json());

app.use('/api/admin', adminRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/school_years', schoolYearsRouter);
app.use('/api/players', playersRouter);
app.use('/api/leaderboard', leaderboardRouter);

app.get('/api/health', (_req, res) => res.send('OK'));

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
