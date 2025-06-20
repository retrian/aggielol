// backend/services/refreshNames.js
// ----------------------------------------------------------------------------
// Lightweight job: only refresh Riot-ID + icon for every account.
// You can call this on a separate cron if you don't need LP snapshots.
// ----------------------------------------------------------------------------

import axios from 'axios';
import { pool } from '../db/pool.js';

/* Riot API helper */
const riot = axios.create({
  baseURL: 'https://americas.api.riotgames.com',
  headers: { 'X-Riot-Token': process.env.RIOT_KEY },
});

/* Same UPSERT helper we used above (kept local to avoid extra imports) */
async function upsertAccount({
  playerId,
  gameName,
  tagLine,
  puuid,
  profileIconId,
}) {
  const riotSlug = `${gameName.toLowerCase()}-${tagLine}`;
  await pool.query(
    `
    INSERT INTO riot_accounts
      (player_id, game_name, tag_line, puuid, riot_slug,
       profile_icon_id, last_checked_at)
    VALUES
      ($1, $2, $3, $4, $5, $6, NOW())
    ON CONFLICT (puuid) DO UPDATE
    SET  game_name       = EXCLUDED.game_name,
         tag_line        = EXCLUDED.tag_line,
         riot_slug       = EXCLUDED.riot_slug,
         profile_icon_id = EXCLUDED.profile_icon_id,
         last_checked_at = NOW();
  `,
    [playerId, gameName, tagLine, puuid, riotSlug, profileIconId]
  );
}

/* Public runner */
export async function refreshAllNames() {
  const { rows } = await pool.query(
    'SELECT player_id, puuid FROM riot_accounts'
  );

  for (const row of rows) {
    try {
      const { data } = await riot.get(
        `/riot/account/v1/accounts/by-puuid/${row.puuid}`
      );
      await upsertAccount({
        playerId: row.player_id,
        gameName: data.gameName,
        tagLine: data.tagLine,
        puuid: row.puuid,
        profileIconId: data.profileIconId ?? null,
      });
      console.log(`✓ ${data.gameName}#${data.tagLine} updated`);
    } catch (err) {
      console.error(
        `⚠️  name refresh failed for ${row.puuid}:`,
        err.response?.status || err.message
      );
    }
  }
}

/* Allow `node backend/services/refreshNames.js` manual run */
if (import.meta.url === `file://${process.argv[1]}`) {
  refreshAllNames()
    .then(() => {
      console.log('All names refreshed');
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
