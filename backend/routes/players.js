// backend/routes/players.js
import { Router } from 'express';
import { pool }   from '../../backend/db/pool.js';

const router = Router();

/* ───────── GET /api/players?year=YYYY-YYYY ───────── */
router.get('/', async (req, res) => {
  const yearName =
    req.query.year ||
    `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;

  try {
    // 1) Select profile_icon_id AS icon_id (lowercase)
    const { rows } = await pool.query(
      `
      SELECT
        p.id                   AS id,
        p.display_name         AS display_name,
        t.name                 AS team_name,
        ra.profile_icon_id     AS icon_id
      FROM   players            p
      JOIN   player_team_stints pts
        ON pts.player_id = p.id
      JOIN   teams              t
        ON t.id = pts.team_id
      JOIN   school_years       sy
        ON sy.school_year_id = pts.school_year_id
      LEFT JOIN riot_accounts   ra
        ON ra.player_id = p.id
      WHERE  sy.name = $1
      ORDER  BY t.name, p.display_name
      `,
      [yearName]
    );

    // 2) Map each row into { id, display_name, team_name, iconId }
    const formatted = rows.map((r) => ({
      id:            r.id,
      display_name:  r.display_name,
      team_name:     r.team_name,
      iconId:        r.icon_id === null ? null : r.icon_id, 
      // (if no riot_accounts match, icon_id is null → iconId: null)
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error in GET /api/players:", err);
    res.status(500).json({ error: 'Database error' });
  }
});

/* ───────── GET /api/players/:identifier ─────────
   • digits  → treat as numeric player ID
   • string  → treat as username OR riot-slug
────────────────────────────────────────────────── */
router.get('/:identifier', async (req, res) => {
  const ident = req.params.identifier;

  // ---- Numeric branch (player_id lookup) ----
  if (/^\d+$/.test(ident)) {
    try {
      // 1) Fetch the player row
      const { rows: playerRows } = await pool.query(
        'SELECT * FROM players WHERE id = $1',
        [ident]
      );
      if (!playerRows.length) {
        return res.status(404).json({ error: 'Player not found' });
      }

      // 2) Fetch riot_accounts for that player
      const accounts = await pool.query(
        'SELECT * FROM riot_accounts WHERE player_id = $1',
        [ident]
      );

      // 3) Fetch username history
      const history = await pool.query(
        `
        SELECT h.*
        FROM   riot_username_history h
        JOIN   riot_accounts a 
          ON a.id = h.account_id
        WHERE  a.player_id = $1
        ORDER  BY h.changed_at DESC
        `,
        [ident]
      );

      // 4) Fetch all stints (with season name and team_name)
      const { rows: stints } = await pool.query(
        `
        SELECT
          pts.joined_date,
          pts.left_date,
          sy.name   AS season,
          t.name    AS team_name
        FROM   player_team_stints pts
        JOIN   school_years     sy 
          ON sy.school_year_id = pts.school_year_id
        JOIN   teams            t  
          ON t.id = pts.team_id
        WHERE  pts.player_id = $1
        ORDER  BY pts.joined_date
        `,
        [ident]
      );

      return res.json({
        player:          playerRows[0],
        accounts:        accounts.rows,
        usernameHistory: history.rows,
        stints,  // each has { joined_date, left_date, season, team_name }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  // ---- Slug branch (public profile by username or riot_slug) ----
  try {
    const { rows } = await pool.query(
      `
      SELECT
        p.id,
        p.display_name,
        p.bio,
        p.fav_champs,
        ra.game_name,
        ra.tag_line,
        ra.profile_icon_id,
        le.tier,
        le.division,
        le.lp,
        le.wins,
        le.losses,
        le.fetched_at
      FROM   players       p
      LEFT JOIN users      u  
        ON u.user_id = p.user_id
      LEFT JOIN riot_accounts ra 
        ON ra.player_id = p.id
      LEFT JOIN LATERAL (
        SELECT tier, division, lp, wins, losses, fetched_at
        FROM   league_entries
        WHERE  summoner_id = ra.id
        ORDER  BY fetched_at DESC
        LIMIT  1
      ) le ON TRUE
      WHERE (u.username   = $1)
         OR (ra.riot_slug = $1)
      `,
      [ident.toLowerCase()]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const profile = rows[0];
    const playerId = profile.id;

    // Fetch stints for this player (season + team_name)
    const { rows: stints } = await pool.query(
      `
      SELECT
        pts.joined_date,
        pts.left_date,
        sy.name   AS season,
        t.name    AS team_name
      FROM   player_team_stints pts
      JOIN   school_years     sy 
        ON sy.school_year_id = pts.school_year_id
      JOIN   teams            t  
        ON t.id = pts.team_id
      WHERE  pts.player_id = $1
      ORDER  BY pts.joined_date
      `,
      [playerId]
    );

    return res.json({
      ...profile,
      stints,  // array of { joined_date, left_date, season, team_name }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
