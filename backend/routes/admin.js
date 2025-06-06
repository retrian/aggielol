// backend/routes/admin.js
import { Router } from 'express';
import { query } from '../db.js'; // ← correct import from backend/db.js

const router = Router();

// If you add an isAdmin middleware later, uncomment below:
// import isAdmin from '../middleware/isAdmin.js';
// router.use(isAdmin);

// POST /api/admin/teams
router.post('/teams', async (req, res) => {
  const { name, year } = req.body;
  if (!name || !year) return res.status(400).send('Name and year required');

  try {
    const { rows } = await query(
      'INSERT INTO teams(name, year) VALUES($1, $2) RETURNING *',
      [name, year]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// POST /api/admin/players
router.post('/players', async (req, res) => {
  const { full_name } = req.body;
  if (!full_name) return res.status(400).send('full_name is required');

  try {
    const { rows } = await query(
      'INSERT INTO players(full_name) VALUES($1) RETURNING *',
      [full_name]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// POST /api/admin/players/:playerId/accounts
router.post('/players/:playerId/accounts', async (req, res) => {
  const { playerId } = req.params;
  const { game_name, tag_line } = req.body;
  if (!game_name || !tag_line) {
    return res.status(400).send('game_name and tag_line are required');
  }

  try {
    // Make sure the player exists
    const player = await query(
      'SELECT id FROM players WHERE id = $1',
      [playerId]
    );
    if (player.rows.length === 0) {
      return res.status(404).send('Player not found');
    }

    // Insert the new Riot account
    const { rows } = await query(
      `INSERT INTO riot_accounts(player_id, game_name, tag_line)
       VALUES ($1, $2, $3) RETURNING *`,
      [playerId, game_name, tag_line]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// POST /api/admin/teams/:teamId/matches
router.post('/teams/:teamId/matches', async (req, res) => {
  const { teamId } = req.params;
  const { opponent, match_date, result, details } = req.body;

  if (!opponent || !match_date || !result) {
    return res.status(400).send('opponent, match_date, and result are required');
  }

  try {
    // Ensure the team exists
    const teamCheck = await query('SELECT 1 FROM teams WHERE id = $1', [teamId]);
    if (teamCheck.rows.length === 0) {
      return res.status(404).send('Team not found');
    }

    // Insert the match
    const { rows } = await query(
      `INSERT INTO tournament_matches
         (team_id, opponent, match_date, result, details)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [teamId, opponent, match_date, result, details || {}]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

export default router;
