// backend/services/riotSync.js
// ---------------------------------------------------------------------------
// Pull current Riot-ID + solo-queue data for every account in riot_accounts
// and store a snapshot in league_entries.  Runs in 20-account batches.
// ---------------------------------------------------------------------------

import axios from 'axios';
import { pool } from '../db/pool.js';

/* ───── Riot clients ──────────────────────────────────────────────────── */
// Region-group client (americas) – Account-V1
const riotRG = axios.create({
  baseURL: 'https://americas.api.riotgames.com',
  headers: { 'X-Riot-Token': process.env.RIOT_KEY },
});
// Platform client (na1) – Summoner-V4 & League-V4
const riotNA = axios.create({
  baseURL: 'https://na1.api.riotgames.com',
  headers: { 'X-Riot-Token': process.env.RIOT_KEY },
});

/* ───── Batch helpers ─────────────────────────────────────────────────── */
const BATCH_SIZE       = 20;
const BATCH_PAUSE_MS   = 5 * 60 * 1000; // 5 minutes
const REQUEST_DELAY_MS = 500;           // 0.5 s
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ───── UPSERT helper for riot_accounts ───────────────────────────────── */
async function upsertAccount({
  playerId,
  gameName,
  tagLine,
  puuid,
  profileIconId,     // may be null on first call
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
    SET game_name       = EXCLUDED.game_name,
        tag_line        = EXCLUDED.tag_line,
        riot_slug       = EXCLUDED.riot_slug,
        profile_icon_id = COALESCE(EXCLUDED.profile_icon_id,
                                   riot_accounts.profile_icon_id),
        last_checked_at = NOW();
  `,
    [playerId, gameName, tagLine, puuid, riotSlug, profileIconId]
  );
}

/* ───── Sync ONE account ─────────────────────────────────────────────── */
async function syncOne({ id: accountId, player_id: playerId, puuid }) {
  /* 1 ▸ Riot-ID (Account-V1, americas) */
  const { data: acct } = await riotRG.get(
    `/riot/account/v1/accounts/by-puuid/${puuid}`
  );
  await upsertAccount({
    playerId,
    gameName: acct.gameName,
    tagLine:  acct.tagLine,
    puuid,
    profileIconId: null,   // will store icon after Summoner call
  });

  /* 2 ▸ Summoner-V4 (na1) – gives icon + encrypted summonerId */
  const { data: summ } = await riotNA.get(
    `/lol/summoner/v4/summoners/by-puuid/${puuid}`
  );

  // update icon now that we have it
  await pool.query(
    'UPDATE riot_accounts SET profile_icon_id=$1 WHERE id=$2',
    [summ.profileIconId, accountId]
  );

  /* 3 ▸ League-V4 solo entry (na1) */
  const { data: entries } = await riotNA.get(
    `/lol/league/v4/entries/by-summoner/${summ.id}`
  );
  const solo = entries.find((e) => e.queueType === 'RANKED_SOLO_5x5');
  if (!solo) return; // unranked

  await pool.query(
    `
    INSERT INTO league_entries
      (summoner_id, fetched_at, lp, wins, losses,
       tier, division, profile_icon_id, recorded_at)
    VALUES
      ($1, NOW(), $2, $3, $4, $5, $6, $7, NOW());
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

/* ───── Public: sync every account in batches ─────────────────────────── */
export async function syncAllAccounts() {
  const { rows: list } = await pool.query(
    'SELECT id, player_id, puuid FROM riot_accounts'
  );

  for (let i = 0; i < list.length; i += BATCH_SIZE) {
    const batch = list.slice(i, i + BATCH_SIZE);
    const n     = Math.floor(i / BATCH_SIZE) + 1;

    console.log(`⏳  Batch ${n} — accounts ${i + 1}-${i + batch.length}`);

    for (let j = 0; j < batch.length; j++) {
      try {
        await syncOne(batch[j]);
        console.log(`   ✔ ${batch[j].puuid.slice(0,8)}… synced`);
      } catch (err) {
        console.error(
          `   ⚠️  sync failed for ${batch[j].puuid.slice(0,8)}…:`,
          err.response?.status || err.message
        );
      }
      if (j < batch.length - 1) await sleep(REQUEST_DELAY_MS);
    }

    console.log(`✅  Batch ${n} done`);
    if (i + BATCH_SIZE < list.length) {
      console.log(`🛑  Sleeping ${BATCH_PAUSE_MS / 60000} min…`);
      await sleep(BATCH_PAUSE_MS);
    }
  }

  console.log(
    `🎉  Finished ${list.length} accounts at ${new Date().toISOString()}`
  );
}
