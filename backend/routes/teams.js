// backend/routes/teams.js
import { Router } from "express";
import { query }  from "../db.js";

const router = Router();

/* ───────────────────────── helpers ─────────────────────────── */
async function getSchoolYearId(name /* "2024-2025" | undefined */) {
  const sql = `
    SELECT school_year_id
      FROM school_years
     WHERE ($1::text IS NULL) OR name = $1
  ORDER BY end_date DESC
     LIMIT 1`;
  const { rows:[row] } = await query(sql, [name ?? null]);
  return row?.school_year_id;
}

/* role ordering for starters grid */
const roleOrderExpr = `
  CASE pts.role
    WHEN 'top' THEN 1 WHEN 'jgl' THEN 2 WHEN 'mid' THEN 3
    WHEN 'adc' THEN 4 WHEN 'sup' THEN 5 ELSE 99
  END
`;

/* ─────────────────────── GET /api/teams (list) ─────────────── */
router.get("/", async (req, res) => {
  try {
    const schoolYearId = await getSchoolYearId(req.query.year);
    if (!schoolYearId) {
      return res.status(404).json({ error: "Season not found" });
    }

    const sql = `
      SELECT DISTINCT t.id, t.name, t.slug
        FROM teams t
        JOIN player_team_stints pts ON pts.team_id = t.id
       WHERE pts.school_year_id = $1
    ORDER BY t.name`;
    const { rows } = await query(sql, [schoolYearId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

/* ─────────────────────── GET /api/teams/:slug ──────────────── */
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;          // "maroon" or "7"
  try {
    /* 1️⃣  find the team row -------------------------------------------- */
    const teamSql = `
      SELECT id, name, slug
        FROM teams
       WHERE slug = $1 OR CAST(id AS text) = $1
       LIMIT 1`;
    const { rows:[team] } = await query(teamSql, [slug]);
    if (!team) return res.status(404).json({ error: "Team not found" });

    /* 2️⃣  decide season ------------------------------------------------- */
    const schoolYearId = await getSchoolYearId(req.query.year);
    if (!schoolYearId) return res.status(404).json({ error: "Season not found" });

    /* 3️⃣  roster: starters first + latest league stats ----------------- */
    const rosterSql = `
      /* latest league snapshot per summoner --------------------------- */
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
        ) t
        WHERE rn = 1
      )

      SELECT
        p.id                    AS player_id,
        p.display_name,
        pts.role,
        pts.status,
        ra.profile_icon_id,
        ll.lp,
        ll.wins,
        ll.losses,
        ll.tier,
        ll.division
      FROM        player_team_stints pts
      JOIN        players         p   ON p.id = pts.player_id

      /* choose ONE Riot account per player (lowest id) ---------------- */
      JOIN LATERAL (
        SELECT *
          FROM riot_accounts
         WHERE player_id = p.id
      ORDER BY id
         LIMIT 1
      ) ra ON true

      /* join latest league stats -------------------------------------- */
      LEFT JOIN latest_league ll ON ll.summoner_id = ra.id

      WHERE pts.team_id        = $1
        AND pts.school_year_id = $2

      ORDER BY (pts.status = 'starter') DESC,
               ${roleOrderExpr},
               p.display_name;
    `;
    const { rows: roster } = await query(rosterSql, [team.id, schoolYearId]);

    /* 4️⃣  matches ------------------------------------------------------- */
    let matches = [];
    try {
      const mSql = `
        SELECT id, opponent, result, match_date, details
          FROM matches
         WHERE team_id        = $1
           AND school_year_id = $2
      ORDER BY match_date DESC`;
      ({ rows: matches } = await query(mSql, [team.id, schoolYearId]));
    } catch { /* matches table may not exist yet */ }

    res.json({
      team,
      season: req.query.year ?? "current",
      roster,
      matches,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
