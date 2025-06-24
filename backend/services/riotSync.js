// backend/services/riotSync.js
// ---------------------------------------------------------------------------
// Pull current Riot-ID + solo-queue data for every account in riot_accounts
// and store a snapshot in league_entries. Runs in 10-account batches.
// ---------------------------------------------------------------------------

import axios from 'axios';
import { pool } from '../db/pool.js';

const riotRG = axios.create({
  baseURL: 'https://americas.api.riotgames.com',
  headers:   { 'X-Riot-Token': process.env.RIOT_KEY },
});
const riotNA = axios.create({
  baseURL: 'https://na1.api.riotgames.com',
  headers:   { 'X-Riot-Token': process.env.RIOT_KEY },
});

const BATCH_SIZE       = 10;
const BATCH_PAUSE_MS   = 5 * 60 * 1000; // 5 minutes
const REQUEST_DELAY_MS = 500;           // 0.5s
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function syncOne(client, { id: accountId, player_id: playerId, puuid }) {
  // 1) Account-V1 (skip on 403)
  try {
    const { data: acct } = await riotRG.get(
      `/riot/account/v1/accounts/by-puuid/${puuid}`,
      { params: { api_key: process.env.RIOT_KEY } }
    );
    await client.query(
      `
      INSERT INTO riot_accounts
        (player_id, game_name, tag_line, puuid, riot_slug,
         profile_icon_id, last_checked_at)
      VALUES ($1,$2,$3,$4,$5,NULL,NOW())
      ON CONFLICT (puuid) DO UPDATE
      SET
        game_name       = EXCLUDED.game_name,
        tag_line        = EXCLUDED.tag_line,
        riot_slug       = EXCLUDED.riot_slug,
        last_checked_at = NOW()
      `,
      [
        playerId,
        acct.gameName,
        acct.tagLine,
        puuid,
        `${acct.gameName.toLowerCase()}-${acct.tagLine}`,
      ]
    );
  } catch (e) {
    if (e.response?.status === 403) {
      console.warn(`→ Account-V1 forbidden for ${puuid}; skipping`);
    } else {
      throw e;
    }
  }

  // 2) Summoner-V4 (skip rest on 403)
  let summ;
  try {
    ({ data: summ } = await riotNA.get(
      `/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      { params: { api_key: process.env.RIOT_KEY } }
    ));
  } catch (e) {
    if (e.response?.status === 403) {
      console.warn(`→ Summoner-V4 forbidden for ${puuid}; skipping rest`);
      return;
    } else {
      throw e;
    }
  }
  await client.query(
    'UPDATE riot_accounts SET profile_icon_id=$1 WHERE id=$2',
    [summ.profileIconId, accountId]
  );

  // 3) League-V4 (by-puuid) – skip LP snapshot on 403
  let entries;
  try {
    ({ data: entries } = await riotNA.get(
      `/lol/league/v4/entries/by-puuid/${puuid}`,
      { params: { api_key: process.env.RIOT_KEY } }
    ));
  } catch (e) {
    if (e.response?.status === 403) {
      console.warn(`→ League-V4 forbidden for ${puuid}; skipping LP snapshot`);
      return;
    } else {
      throw e;
    }
  }

  const solo = entries.find((e) => e.queueType === 'RANKED_SOLO_5x5');
  if (!solo) return;

  await client.query(
    `
    INSERT INTO league_entries
      (summoner_id, fetched_at, lp, wins, losses,
       tier, division, profile_icon_id, recorded_at)
    VALUES
      ($1, NOW(), $2, $3, $4, $5, $6, $7, NOW())
    `,
    [
      accountId,
      solo.leaguePoints,
      solo.wins,
      solo.losses,
      solo.tier.toLowerCase(),
      solo.rank,
      summ.profileIconId,
    ]
  );
}

export async function syncAllAccounts() {
  const { rows: list } = await pool.query(
    'SELECT id, player_id, puuid FROM riot_accounts'
  );

  for (let i = 0; i < list.length; i += BATCH_SIZE) {
    const batch = list.slice(i, i + BATCH_SIZE);
    console.log(`⏳  Batch ${Math.floor(i / BATCH_SIZE) + 1}`);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const acct of batch) {
        try {
          await syncOne(client, acct);
          console.log(`   ✔ ${acct.puuid.slice(0,8)}… synced`);
        } catch (err) {
          console.error(
            '→ Sync error:',
            err.response?.status,
            err.response?.data || err.message
          );
        }
        await sleep(REQUEST_DELAY_MS);
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      console.error('❌ Batch failed, rolled back:', e.message);
    } finally {
      client.release();
    }

    if (i + BATCH_SIZE < list.length) {
      console.log(`🛑  Sleeping ${BATCH_PAUSE_MS/60000} min…`);
      await sleep(BATCH_PAUSE_MS);
    }
  }

  console.log(
    `🎉  Finished ${list.length} accounts at ${new Date().toISOString()}`
  );
}
