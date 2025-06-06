// vite-project/backend/services/riotSync.js

import { pool } from "../db/pool.js";
import {
  loadSummoners,
  getAccountInfo,
  getSummonerInfo,
  getLeagueInfo,
} from "../../src/lib/riotApi.js";

// ─── Batch size and pause intervals ───────────────────────────────
// We process 20 accounts, then pause for 5 minutes.
// Within each batch, we insert a small delay between individual requests.
const BATCH_SIZE       = 20;
const BATCH_PAUSE_MS   = 5 * 60 * 1000;  // 5 minutes
const REQUEST_DELAY_MS = 500;            // 0.5 seconds between each account

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** ░░ Sync ONE Riot account ░░ */
async function syncOne({ gameName, tagLine }) {
  // 1 · Resolve PUUID
  const acct = await getAccountInfo(gameName, tagLine);

  // 2 · Upsert into riot_accounts (puuid, profile_icon_id, etc.)
  const {
    rows: [{ id: summonerId }],
  } = await pool.query(
    `
    INSERT INTO riot_accounts (puuid, game_name, tag_line, riot_slug)
    VALUES ($1, $2, $3, lower($2 || '-' || $3))
    ON CONFLICT (puuid)
      DO UPDATE SET
        game_name = EXCLUDED.game_name,
        tag_line  = EXCLUDED.tag_line
    RETURNING id
    `,
    [acct.puuid, acct.gameName, acct.tagLine]
  );

  // 3 · Fetch Summoner Info (to get profileIconId & encrypted summoner ID)
  const summ = await getSummonerInfo(acct.puuid);
  await pool.query(
    `
    UPDATE riot_accounts
       SET profile_icon_id = $1,
           last_checked_at = NOW()
     WHERE id = $2
    `,
    [summ.profileIconId, summonerId]
  );

  // 4 · Fetch Solo-queue data and INSERT into league_entries
  const entries   = await getLeagueInfo(summ.id);
  const soloEntry = entries.find(e => e.queueType === "RANKED_SOLO_5x5");
  if (!soloEntry) {
    // Unranked: skip adding a row in league_entries
    return;
  }

  // ─── Adjusted INSERT to match your league_entries schema ─────────────
  // Table columns: id, summoner_id, fetched_at, lp, wins, losses, tier, division, profile_icon_id, recorded_at
  await pool.query(
    `
    INSERT INTO league_entries
      (summoner_id,
       fetched_at,
       lp,
       wins,
       losses,
       tier,
       division,
       profile_icon_id,
       recorded_at)
    VALUES
      ($1, NOW(), $2, $3, $4, $5, $6, $7, NOW())
    `,
    [
      summonerId,                         // $1 → summoner_id
      soloEntry.leaguePoints,             // $2 → lp
      soloEntry.wins,                     // $3 → wins
      soloEntry.losses,                   // $4 → losses
      soloEntry.tier.toLowerCase(),       // $5 → tier (e.g., "gold")
      soloEntry.rank,                     // $6 → division (e.g., "II")
      summ.profileIconId                  // $7 → profile_icon_id
    ]
  );
}

/** ░░ Sync all summoners, in batches of 20 with delays ░░ */
export async function syncAllAccounts() {
  const list = await loadSummoners();

  for (let i = 0; i < list.length; i += BATCH_SIZE) {
    const batch       = list.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const startIdx    = i + 1;
    const endIdx      = Math.min(i + BATCH_SIZE, list.length);

    console.log(
      `⏳  Starting batch ${batchNumber} (accounts ${startIdx} to ${endIdx})`
    );

    for (let j = 0; j < batch.length; j++) {
      const summoner = batch[j];
      try {
        await syncOne(summoner);
        console.log(`   ✔ Synced ${summoner.gameName}#${summoner.tagLine}`);
      } catch (err) {
        console.error(
          `   ⚠️  sync failed for ${summoner.gameName}#${summoner.tagLine}:`,
          err.message
        );
      }

      // Delay before next account to avoid bursting
      if (j < batch.length - 1) {
        await sleep(REQUEST_DELAY_MS);
      }
    }

    console.log(
      `✅  Finished batch ${batchNumber} (accounts ${startIdx} to ${endIdx})`
    );

    // Pause 5 minutes before next batch (unless this was the last batch)
    if (i + BATCH_SIZE < list.length) {
      console.log(
        `🛑  Pausing for ${BATCH_PAUSE_MS / 60000} minutes before next batch…`
      );
      await sleep(BATCH_PAUSE_MS);
    }
  }

  console.log(
    `🎉  Finished syncing all ${list.length} accounts at ${new Date().toISOString()}`
  );
}
