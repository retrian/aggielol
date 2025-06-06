// src/services/riotSync.js
import cron from 'node-cron';
import fetch from 'node-fetch';
import { query } from '../../backend/db.js/index.js';
import dotenv from 'dotenv';
import {
  getAccountInfo,
  getSummonerInfo,
  getLeagueInfo
} from '../lib/riotApi.js';

dotenv.config();

const RIOT_SYNC_INTERVAL = '*/30 * * * *'; // every 30 minutes

async function syncAllAccounts() {
  try {
    const { rows: accounts } = await query(
      'SELECT id, game_name, tag_line FROM riot_accounts'
    );

    for (const acct of accounts) {
      // 1) Lookup account info to get PUUID
      let accountData;
      try {
        accountData = await getAccountInfo(acct.game_name, acct.tag_line);
      } catch {
        console.warn(`Account lookup failed for ${acct.game_name}#${acct.tag_line}`);
        continue;
      }

      // 2) Fetch summoner info by PUUID to get encryptedSummonerId and profileIconId
      let summoner;
      try {
        summoner = await getSummonerInfo(accountData.puuid);
      } catch {
        console.warn(`Summoner info failed for PUUID ${accountData.puuid}`);
        continue;
      }

      // 3) Fetch league entries (array) for this summoner
      let entries;
      try {
        entries = await getLeagueInfo(summoner.id);
      } catch {
        console.warn(`League info failed for summonerId ${summoner.id}`);
        continue;
      }

      // 4) Find the Solo Queue entry
      const solo = entries.find(e => e.queueType === 'RANKED_SOLO_5x5');
      if (!solo) continue;

      // 5) Insert stats including tier, division, and profile icon
      await query(
        `INSERT INTO soloqueue_stats
           (account_id, lp, wins, losses, tier, division, profile_icon_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          acct.id,
          solo.leaguePoints,
          solo.wins,
          solo.losses,
          solo.tier,
          solo.rank,
          summoner.profileIconId
        ]
      );

      // 6) Record username history and update account if name/tag changed
      const newName = solo.summonerName;
      const newTag  = solo.summonerTag;
      if (
        newName && newTag &&
        (newName !== acct.game_name || newTag !== acct.tag_line)
      ) {
        // save old entry
        await query(
          `INSERT INTO riot_username_history (account_id, old_game_name, old_tag_line)
           VALUES ($1, $2, $3)`,
          [acct.id, acct.game_name, acct.tag_line]
        );
        // update to new
        await query(
          `UPDATE riot_accounts SET game_name = $1, tag_line = $2 WHERE id = $3`,
          [newName, newTag, acct.id]
        );
      }
    }

    console.log('✅ Riot sync completed at', new Date().toISOString());
  } catch (err) {
    console.error('❌ Riot sync failed:', err);
  }
}

// Schedule job
cron.schedule(RIOT_SYNC_INTERVAL, syncAllAccounts);

// Run once on startup
syncAllAccounts();

export default syncAllAccounts;
