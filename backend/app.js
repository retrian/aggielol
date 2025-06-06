// ─── backend/app.js ─────────────────────────────────────────────────────────
import dotenv from 'dotenv';
dotenv.config();   // ← MUST be first

// Quick sanity‐check:
console.log("→ Riot key loaded:", process.env.RIOT_API_KEY ? "✅" : "❌");

import express from 'express';
import cors from 'cors';
import leaderboardRoute from './routes/leaderboard.js';

const app = express();
const PORT = process.env.PORT || 5173;

app.use(cors());
app.use(express.json());
app.use('/api', leaderboardRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
