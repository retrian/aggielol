// File: src/routes/leaderboard.js

import { Router } from 'express';
import { pool } from '../../backend/db/pool.js';

const router = Router();

/* ─────────────────────────────────────────────────────────────────────
   GET /api/leaderboard
   • ?scope=all      → one “best” account per player, all years
   • ?scope=current  → one “best” account per player in the latest (or specified) year
   • ?year=YYYY-YYYY can override which school year is “current”
───────────────────────────────────────────────────────────────────── */

router.get('/', async (req, res) => {
  const scope = req.query.scope === 'all' ? 'all' : 'current';

  try {
    // ────────────────────────────────────────────────────────────────
    // 1) CTE that picks exactly one "latest" league_entries row per summoner_id:
    const latestLeagueCTE = `
      WITH latest_league AS (
        SELECT
          le.*
        FROM (
          SELECT
            * ,
            ROW_NUMBER() OVER (
              PARTITION BY summoner_id
              ORDER BY recorded_at DESC
            ) AS rn
          FROM public.league_entries
        ) le
        WHERE le.rn = 1
      )
    `;

    // ────────────────────────────────────────────────────────────────
    // “All Players” branch: no year filtering; pick best account per player via DISTINCT ON
    if (scope === 'all') {
      const allSql = `
        ${latestLeagueCTE}
        SELECT DISTINCT ON (p.id)
          p.id                    AS id,
          p.display_name          AS display_name,
          ra.game_name            AS game_name,
          ra.tag_line             AS tag_line,
          COALESCE(ra.profile_icon_id, ll.profile_icon_id) AS icon_id,
          ll.lp                   AS lp,
          ll.wins                 AS wins,
          ll.losses               AS losses,
          ll.tier                 AS tier,
          ll.division             AS division,
          NULL                    AS team_name
        FROM public.riot_accounts ra
        JOIN latest_league ll
          ON ll.summoner_id = ra.id
        JOIN public.players p
          ON p.id = ra.player_id
        ORDER BY
          p.id,  -- DISTINCT ON key

          -- Sort by tier priority:
          CASE ll.tier
            WHEN 'Challenger'  THEN 1
            WHEN 'Grandmaster' THEN 2
            WHEN 'Master'      THEN 3
            WHEN 'Diamond'     THEN 4
            WHEN 'Emerald'     THEN 5
            WHEN 'Platinum'    THEN 6
            WHEN 'Gold'        THEN 7
            WHEN 'Silver'      THEN 8
            WHEN 'Bronze'      THEN 9
            WHEN 'Iron'        THEN 10
            ELSE 11
          END,

          -- Within that tier, sort by division (I → IV → others):
          CASE ll.division
            WHEN 'I'   THEN 1
            WHEN 'II'  THEN 2
            WHEN 'III' THEN 3
            WHEN 'IV'  THEN 4
            ELSE 5
          END,

          -- Finally LP descending
          ll.lp DESC,

          -- As a tiebreaker, player name
          p.display_name ASC;
      `;

      try {
        const { rows } = await pool.query(allSql);
        return res.json(rows);
      } catch (err) {
        console.error('Leaderboard SQL error (all players):', err);
        return res.status(500).json({ error: 'Database error (all players).' });
      }
    }

    // ────────────────────────────────────────────────────────────────
    // “Current Players” branch:
    //  1) Determine yearId (via ?year or MAX)
    let yearId;
    if (req.query.year) {
      const lookupSql = `SELECT school_year_id FROM public.school_years WHERE name = $1`;
      const { rows: syRows } = await pool.query(lookupSql, [req.query.year]);
      if (!syRows.length) {
        return res.status(400).json({ error: `Unknown school year: "${req.query.year}"` });
      }
      yearId = syRows[0].school_year_id;
    } else {
      const lookupMaxSql = `SELECT MAX(school_year_id) AS max_id FROM public.school_years`;
      const { rows: maxRow } = await pool.query(lookupMaxSql);
      yearId = maxRow[0].max_id;
    }

    //  2) Fetch only those players who have a stint in that year, then pick DISTINCT ON player
    const currentSql = `
      ${latestLeagueCTE}
      SELECT DISTINCT ON (p.id)
        p.id                    AS id,
        p.display_name          AS display_name,
        ra.game_name            AS game_name,
        ra.tag_line             AS tag_line,
        COALESCE(ra.profile_icon_id, ll.profile_icon_id) AS icon_id,
        ll.lp                   AS lp,
        ll.wins                 AS wins,
        ll.losses               AS losses,
        ll.tier                 AS tier,
        ll.division             AS division,
        t.name                  AS team_name
      FROM public.player_team_stints pts
      JOIN public.players p
        ON p.id = pts.player_id
      JOIN public.teams t
        ON t.id = pts.team_id
      JOIN public.school_years sy
        ON sy.school_year_id = pts.school_year_id
       AND sy.school_year_id = $1

      -- Join to latest_league → account info → limit to that single account per player:
      JOIN public.riot_accounts ra
        ON ra.player_id = p.id
      JOIN latest_league ll
        ON ll.summoner_id = ra.id

      ORDER BY
        p.id,  -- DISTINCT ON key

        -- Sort by tier priority:
        CASE ll.tier
          WHEN 'Challenger'  THEN 1
          WHEN 'Grandmaster' THEN 2
          WHEN 'Master'      THEN 3
          WHEN 'Diamond'     THEN 4
          WHEN 'Emerald'     THEN 5
          WHEN 'Platinum'    THEN 6
          WHEN 'Gold'        THEN 7
          WHEN 'Silver'      THEN 8
          WHEN 'Bronze'      THEN 9
          WHEN 'Iron'        THEN 10
          ELSE 11
        END,

        -- Within tier, sort by division (I → IV → other)
        CASE ll.division
          WHEN 'I'   THEN 1
          WHEN 'II'  THEN 2
          WHEN 'III' THEN 3
          WHEN 'IV'  THEN 4
          ELSE 5
        END,

        -- Then LP descending
        ll.lp DESC,

        -- Tie‐breaker on display_name
        p.display_name ASC;
    `;

    try {
      const { rows } = await pool.query(currentSql, [yearId]);
      return res.json(rows);
    } catch (err) {
      console.error('Leaderboard SQL error (current players):', err);
      return res.status(500).json({ error: 'Database error (current players).' });
    }
  } catch (err) {
    console.error('Unexpected error in /api/leaderboard:', err);
    return res.status(500).json({ error: 'Unexpected server error.' });
  }
});

export default router;
