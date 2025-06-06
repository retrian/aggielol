// backend/routes/teams.js
import { Router } from 'express';
import { query } from '../db.js';  // ← updated to import directly from backend/db.js

const router = Router();

// GET /api/teams?year=2025
router.get('/', async (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();
  try {
    const { rows } = await query(
      'SELECT * FROM teams WHERE year = $1 ORDER BY name',
      [year]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/teams/:id
router.get('/:id', async (req, res) => {
  const teamId = req.params.id;
  try {
    // Fetch basic team info
    const teamRes = await query('SELECT * FROM teams WHERE id = $1', [teamId]);
    if (!teamRes.rows.length) return res.status(404).send('Team not found');
    const team = teamRes.rows[0];

    // Fetch roster
    const rosterRes = await query(
      `SELECT p.id, p.full_name, pm.joined_date, pm.left_date
       FROM player_memberships pm
       JOIN players p ON p.id = pm.player_id
       WHERE pm.team_id = $1
       ORDER BY p.full_name`,
      [teamId]
    );

    // Fetch tournament matches
    const matchesRes = await query(
      'SELECT * FROM tournament_matches WHERE team_id = $1 ORDER BY match_date',
      [teamId]
    );

    res.json({
      team,
      roster: rosterRes.rows,
      matches: matchesRes.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
