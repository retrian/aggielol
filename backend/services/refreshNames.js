// backend/services/refreshNames.js
// ----------------------------------------------------------------------------
// Lightweight job: only refresh Riot-ID + icon for every account.
// You can call this on a separate cron if you don't need LP snapshots.
// ----------------------------------------------------------------------------

import axios from 'axios';
import { pool } from '../db/pool.js';

const riot = axios.create({
  baseURL: 'https://americas.api.riotgames.com',
  headers:   { 'X-Riot-Token': process.env.RIOT_KEY },
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function upsertAccount(client, {
  playerId,
  gameName,
  tagLine,
  puuid,
  profileIconId,
}) {
  const riotSlug = `${gameName.toLowerCase()}-${tagLine}`;
  await client.query(
    `
    INSERT INTO riot_accounts
      (player_id, game_name, tag_line, puuid, riot_slug,
       profile_icon_id, last_checked_at)
    VALUES ($1,$2,$3,$4,$5,$6,NOW())
    ON CONFLICT (puuid) DO UPDATE
    SET
      game_name       = EXCLUDED.game_name,
      tag_line        = EXCLUDED.tag_line,
      riot_slug       = EXCLUDED.riot_slug,
      profile_icon_id = EXCLUDED.profile_icon_id,
      last_checked_at = NOW()
    `,
    [playerId, gameName, tagLine, puuid, riotSlug, profileIconId]
  );
}

export async function refreshAllNames() {
  const { rows } = await pool.query('SELECT player_id, puuid FROM riot_accounts');

  for (const { player_id, puuid } of rows) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      let data;
      try {
        ({ data } = await riot.get(
          `/riot/account/v1/accounts/by-puuid/${puuid}`
        ));
      } catch (e) {
        if (e.response?.status === 403) {
          console.warn(
            `→ Account-v1 forbidden for ${puuid}; skipping name refresh`
          );
          await client.query('COMMIT');
          continue;
        } else {
          throw e;
        }
      }

      await upsertAccount(client, {
        playerId:      player_id,
        gameName:      data.gameName,
        tagLine:       data.tagLine,
        puuid,
        profileIconId: data.profileIconId ?? null,
      });

      await client.query('COMMIT');
      console.log(`✓ ${data.gameName}#${data.tagLine} updated`);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(
        '→ RefreshNames error:',
        err.response?.status,
        err.response?.data || err.message
      );
    } finally {
      client.release();
    }

    await sleep(200);
  }
}

// manual run support
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
