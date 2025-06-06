// backend/routes/schoolYears.js
import { Router } from "express";
// ─── Correct path to pool.js ───────────────────────────────────────────────
import { pool } from "../../backend/db/pool.js";

const router = Router();

/* ─── GET all school_years ─────────────────────────────────────────────── */
router.get("/", async (req, res) => {
  try {
    // Adjust column names if needed; this assumes `school_year_id` and `name`
    const { rows } = await pool.query(
      `
      SELECT school_year_id, name
      FROM school_years
      ORDER BY name DESC
      `
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching school_years:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
