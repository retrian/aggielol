// File: backend/routes/leaderboard.js
import { Router } from 'express';
import { pool }   from '../../backend/db/pool.js';   // <-- adjust path if needed

const router = Router();

/* ──────────────────────────────────────────────────────────────
   GET /api/leaderboard
   ?scope=all      → all players (best account per player)
   ?scope=current  → only players on the latest (or ?year=YYYY-YYYY) roster
──────────────────────────────────────────────────────────────── */
router.get('/', async (req, res) => {
  const scope = req.query.scope === 'all' ? 'all' : 'current';

  try {
    /* ------- common CTE: one "latest" league_entries row per account ------ */
    const latestLeagueCTE = `
      WITH latest_league AS (
        SELECT *
        FROM (
          SELECT
            le.*,
            ROW_NUMBER() OVER (
              PARTITION BY summoner_id
              ORDER BY recorded_at DESC
            ) AS rn
          FROM public.league_entries le
        ) sub
        WHERE rn = 1
      )
    `;

    /* -------------- branch: scope = all ----------------------------------- */
    if (scope === 'all') {
      const sql = `
        ${latestLeagueCTE}
        SELECT DISTINCT ON (p.id)
          p.id,
          p.display_name,
          ra.game_name,
          ra.tag_line,
          COALESCE(ra.profile_icon_id, ll.profile_icon_id) AS profile_icon_id,
          ll.lp,
          ll.wins,
          ll.losses,
          ll.tier,
          ll.division,
          NULL AS team_name
        FROM public.riot_accounts ra
        JOIN latest_league ll ON ll.summoner_id = ra.id
        JOIN public.players    p ON p.id = ra.player_id
        ORDER BY p.id,
                 /* tier priority */       CASE ll.tier
                   WHEN 'Challenger'  THEN 1 WHEN 'Grandmaster' THEN 2
                   WHEN 'Master'      THEN 3 WHEN 'Diamond'     THEN 4
                   WHEN 'Emerald'     THEN 5 WHEN 'Platinum'    THEN 6
                   WHEN 'Gold'        THEN 7 WHEN 'Silver'      THEN 8
                   WHEN 'Bronze'      THEN 9 WHEN 'Iron'        THEN 10
                   ELSE 11 END,
                 /* division priority */   CASE ll.division
                   WHEN 'I' THEN 1 WHEN 'II' THEN 2
                   WHEN 'III' THEN 3 WHEN 'IV' THEN 4
                   ELSE 5 END,
                 ll.lp DESC,
                 p.display_name ASC;
      `;
      const { rows } = await pool.query(sql);
      return res.json(rows);
    }

    /* -------------- branch: scope = current -------------------------------- */
    /* 1) resolve which school_year_id is "current" */
    let yearId;
    if (req.query.year) {
      const { rows } = await pool.query(
        `SELECT school_year_id FROM public.school_years WHERE name = $1`,
        [req.query.year]
      );
      if (!rows.length) {
        return res.status(400).json({ error: `Unknown school year: ${req.query.year}` });
      }
      yearId = rows[0].school_year_id;
    } else {
      const { rows } = await pool.query(
        `SELECT MAX(school_year_id) AS id FROM public.school_years`
      );
      yearId = rows[0].id;
    }

    /* 2) players on that roster */
    const sql = `
      ${latestLeagueCTE}
      SELECT DISTINCT ON (p.id)
        p.id,
        p.display_name,
        ra.game_name,
        ra.tag_line,
        COALESCE(ra.profile_icon_id, ll.profile_icon_id) AS profile_icon_id,
        ll.lp,
        ll.wins,
        ll.losses,
        ll.tier,
        ll.division,
        t.name AS team_name
      FROM public.player_team_stints pts
      JOIN public.players p        ON p.id = pts.player_id
      JOIN public.teams   t        ON t.id = pts.team_id
      JOIN public.school_years sy  ON sy.school_year_id = pts.school_year_id
     AND sy.school_year_id = $1
      JOIN public.riot_accounts ra ON ra.player_id = p.id
      JOIN latest_league ll        ON ll.summoner_id = ra.id
      ORDER BY p.id,
               CASE ll.tier
                 WHEN 'Challenger'  THEN 1 WHEN 'Grandmaster' THEN 2
                 WHEN 'Master'      THEN 3 WHEN 'Diamond'     THEN 4
                 WHEN 'Emerald'     THEN 5 WHEN 'Platinum'    THEN 6
                 WHEN 'Gold'        THEN 7 WHEN 'Silver'      THEN 8
                 WHEN 'Bronze'      THEN 9 WHEN 'Iron'        THEN 10
                 ELSE 11 END,
               CASE ll.division
                 WHEN 'I' THEN 1 WHEN 'II' THEN 2
                 WHEN 'III' THEN 3 WHEN 'IV' THEN 4
                 ELSE 5 END,
               ll.lp DESC,
               p.display_name ASC;
    `;
    const { rows } = await pool.query(sql, [yearId]);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error.' });
  }
});

/* ──────────────────────────────────────────────────────────────
   NEW — GET /api/leaderboard/history
   Returns daily LP snapshots for each player.
   Query params:
     days  (default 60)  – look-back window
     scope 'current'|'all' (default 'current')
──────────────────────────────────────────────────────────────── */
router.get('/history', async (req, res) => {
  const days  = Number(req.query.days) || 60;
  const scope = req.query.scope === 'all' ? 'all' : 'current';

  try {
    /* 1) figure out which school_year_id is "current" */
    let currentYear = null;
    if (scope === 'current') {
      const { rows } = await pool.query(
        `SELECT school_year_id
           FROM public.school_years
       ORDER BY school_year_id DESC
          LIMIT 1`
      );
      currentYear = rows[0]?.school_year_id ?? null;
    }

    /* 2) aggregate best LP per player per day */
    const { rows } = await pool.query(
      `
      WITH daily AS (
        SELECT
          ra.player_id,
          date_trunc('day', le.fetched_at) AS day,
          MAX(le.lp)                       AS lp
        FROM   public.league_entries le
        JOIN   public.riot_accounts ra ON ra.id = le.summoner_id
        LEFT   JOIN public.player_team_stints pts ON pts.player_id = ra.player_id
        LEFT   JOIN public.school_years       sy  ON sy.school_year_id = pts.school_year_id
        WHERE  le.fetched_at >= NOW() - ($1 || ' days')::interval
          AND  ($2::int IS NULL OR sy.school_year_id = $2)
        GROUP  BY ra.player_id, date_trunc('day', le.fetched_at)
      )
      SELECT
        d.player_id,
        p.display_name,
        ra.profile_icon_id,
        d.lp,
        d.day AS fetched_at       /* front-end expects this field */
      FROM   daily d
      JOIN   public.players       p  ON p.id  = d.player_id
      JOIN   public.riot_accounts ra ON ra.player_id = p.id
      ORDER  BY d.day, d.player_id;
      `,
      [days, currentYear]
    );

    return res.json(rows);
  } catch (err) {
    console.error('History endpoint error:', err);
    return res.status(500).json({ error: 'Database error (history).' });
  }
});

/* ──────────────────────────────────────────────────────────────
   GET /api/leaderboard/entries
   Returns raw league entries data with optional filtering
   Query params:
     player_id - filter by specific player
     summoner_id - filter by specific summoner
     days - look back X days (default 7)
     limit - max records to return (default 100)
──────────────────────────────────────────────────────────────── */
router.get('/entries', async (req, res) => {
  const playerId = req.query.player_id;
  const summonerId = req.query.summoner_id;
  const days = Number(req.query.days) || 7;
  const limit = Number(req.query.limit) || 100;

  try {
    let sql = `
      SELECT 
        le.*,
        ra.game_name,
        ra.tag_line,
        p.display_name as player_name
      FROM public.league_entries le
      JOIN public.riot_accounts ra ON ra.id = le.summoner_id
      JOIN public.players p ON p.id = ra.player_id
      WHERE le.recorded_at >= NOW() - ($1 || ' days')::interval
    `;
    
    const params = [days];
    let paramCount = 1;

    // Add optional filters
    if (playerId) {
      paramCount++;
      sql += ` AND ra.player_id = $${paramCount}`;
      params.push(playerId);
    }

    if (summonerId) {
      paramCount++;
      sql += ` AND le.summoner_id = $${paramCount}`;
      params.push(summonerId);
    }

    sql += ` ORDER BY le.recorded_at DESC LIMIT $${paramCount + 1}`;
    params.push(limit);

    const { rows } = await pool.query(sql, params);
    return res.json(rows);

  } catch (err) {
    console.error('League entries endpoint error:', err);
    return res.status(500).json({ error: 'Database error (entries).' });
  }
});

/* ──────────────────────────────────────────────────────────────
   GET /api/leaderboard/entries/latest
   Returns the most recent league entry for each summoner
──────────────────────────────────────────────────────────────── */
router.get('/entries/latest', async (req, res) => {
  try {
    const sql = `
      SELECT *
      FROM (
        SELECT
          le.*,
          ra.game_name,
          ra.tag_line,
          p.display_name as player_name,
          ROW_NUMBER() OVER (
            PARTITION BY le.summoner_id
            ORDER BY le.recorded_at DESC
          ) AS rn
        FROM public.league_entries le
        JOIN public.riot_accounts ra ON ra.id = le.summoner_id
        JOIN public.players p ON p.id = ra.player_id
      ) sub
      WHERE rn = 1
      ORDER BY recorded_at DESC;
    `;

    const { rows } = await pool.query(sql);
    return res.json(rows);

  } catch (err) {
    console.error('Latest entries endpoint error:', err);
    return res.status(500).json({ error: 'Database error (latest entries).' });
  }
});

export default router;