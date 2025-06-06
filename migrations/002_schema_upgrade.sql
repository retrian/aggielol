-- 002_schema_upgrade.sql  (fixed)
BEGIN;

/* ---------- 2.1  utility lookup ---------- */
CREATE TABLE IF NOT EXISTS school_years (
  school_year_id SERIAL PRIMARY KEY,
  name        TEXT UNIQUE NOT NULL,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL
);

INSERT INTO school_years (name,start_date,end_date)
VALUES ('2024-2025','2024-08-01','2025-07-31')
ON CONFLICT DO NOTHING;

/* ---------- 2.2  users ---------- */
CREATE TABLE IF NOT EXISTS users (
  user_id    SERIAL PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  username   TEXT UNIQUE NOT NULL,
  role       TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

/* ---------- 2.3  players ---------- */
ALTER TABLE players
  RENAME COLUMN full_name TO display_name;

ALTER TABLE players
  ADD COLUMN IF NOT EXISTS user_id INT UNIQUE,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS fav_champs TEXT[],
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

ALTER TABLE players
  DROP CONSTRAINT IF EXISTS players_user_fk;

ALTER TABLE players
  ADD CONSTRAINT players_user_fk
  FOREIGN KEY (user_id) REFERENCES users(user_id)
  ON DELETE SET NULL;

/* ---------- 2.4  riot_accounts ---------- */
ALTER TABLE riot_accounts
  ADD COLUMN IF NOT EXISTS puuid TEXT,
  ADD COLUMN IF NOT EXISTS riot_slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS profile_icon_id INT,
  ADD COLUMN IF NOT EXISTS last_checked_at TIMESTAMPTZ;

UPDATE riot_accounts
SET  riot_slug = lower(game_name || '-' || tag_line)
WHERE riot_slug IS NULL;

/* ---------- 2.5  memberships → stints ---------- */
ALTER TABLE player_memberships
  RENAME TO player_team_stints;

ALTER TABLE player_team_stints
  ADD COLUMN IF NOT EXISTS school_year_id INT;

UPDATE player_team_stints
SET    school_year_id = (SELECT school_year_id
                         FROM   school_years
                         WHERE  name='2024-2025')
WHERE  school_year_id IS NULL;

ALTER TABLE player_team_stints
  DROP CONSTRAINT IF EXISTS stints_year_fk;

ALTER TABLE player_team_stints
  ADD CONSTRAINT stints_year_fk
  FOREIGN KEY (school_year_id)
  REFERENCES school_years(school_year_id);

-- reset PK
ALTER TABLE player_team_stints
  DROP CONSTRAINT IF EXISTS player_team_stints_pkey,
  DROP CONSTRAINT IF EXISTS player_memberships_pkey;

ALTER TABLE player_team_stints
  ADD PRIMARY KEY (player_id, team_id, joined_date);

/* ---------- 2.6  teams ---------- */
ALTER TABLE teams
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS school_year_id INT;

UPDATE teams
SET    slug = lower(name),
       school_year_id = (SELECT school_year_id
                          FROM   school_years
                          WHERE  name='2024-2025')
WHERE  slug IS NULL;

ALTER TABLE teams
  DROP CONSTRAINT IF EXISTS teams_year_fk;

ALTER TABLE teams
  ADD CONSTRAINT teams_year_fk
  FOREIGN KEY (school_year_id)
  REFERENCES school_years(school_year_id);

ALTER TABLE teams
  DROP COLUMN IF EXISTS year;

/* ---------- 2.7  soloqueue_stats → league_entries ---------- */
ALTER TABLE soloqueue_stats
  RENAME TO league_entries;

/* ---------- 2.8  tournament_matches → matches ---------- */
ALTER TABLE tournament_matches
  RENAME TO matches;

ALTER TABLE matches
  ADD COLUMN IF NOT EXISTS school_year_id INT,
  ADD COLUMN IF NOT EXISTS our_score INT,
  ADD COLUMN IF NOT EXISTS their_score INT;

UPDATE matches
SET    school_year_id = (SELECT school_year_id
                         FROM   school_years
                         WHERE  name='2024-2025')
WHERE  school_year_id IS NULL;

ALTER TABLE matches
  DROP CONSTRAINT IF EXISTS matches_year_fk;

ALTER TABLE matches
  ADD CONSTRAINT matches_year_fk
  FOREIGN KEY (school_year_id)
  REFERENCES school_years(school_year_id);

/* ---------- 2.9  match_participants ---------- */
CREATE TABLE IF NOT EXISTS match_participants (
  match_id  INT REFERENCES matches(id)   ON DELETE CASCADE,
  player_id INT REFERENCES players(id),
  champion  TEXT,
  role      TEXT,
  PRIMARY KEY (match_id, player_id)
);

/* ---------- 2.10  helpful indexes ---------- */
CREATE INDEX IF NOT EXISTS idx_league_latest
  ON league_entries (account_id, fetched_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username
  ON users (username);

COMMIT;
