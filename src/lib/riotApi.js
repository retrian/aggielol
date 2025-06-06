// src/lib/riotApi.js
// -----------------------------------------------------------------------------
// Shared Riot API utilities for both frontend (Vite/React) and Node back-end.
// -----------------------------------------------------------------------------

/* ---------- 0 · API-key detection ----------------------------------------- */
let apiKey;
if (typeof process !== 'undefined' && process.env.RIOT_API_KEY) {
  apiKey = process.env.RIOT_API_KEY;                        // Node / Render
} else if (typeof import.meta !== 'undefined' &&
           import.meta.env?.VITE_RIOT_API_KEY) {
  apiKey = import.meta.env.VITE_RIOT_API_KEY;               // Browser / Vite
} else {
  throw new Error('Riot API key not defined in environment');
}

/* ---------- 1 · Constants -------------------------------------------------- */
const version = '15.10.1';   // Data-Dragon version for profile icons

export const tierOrder = {
  challenger: 0, grandmaster: 1, master: 2, diamond: 3, emerald: 4,
  platinum: 5,  gold: 6,      silver: 7, unranked: 8
};
export const divisionOrder = { I: 0, II: 1, III: 2, IV: 3, '-': 4 };

/* ---------- 2 · Helper: loadSummoners -------------------------------------
   • Browser → fetch /summoners.txt
   • Node    → read <repoRoot>/public/summoners.txt from disk
--------------------------------------------------------------------------- */
export async function loadSummoners() {
  const runningInNode = typeof window === 'undefined';

  // Inner parser shared by both paths
  const parse = text => text
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(line => {
      const [gameName, tagLine] = line.split('#');
      return { gameName, tagLine };
    });

  if (!runningInNode) {
    // ----- Browser path -----
    const res  = await fetch('/summoners.txt');
    return parse(await res.text());
  }

  // ----- Node path -----
  try {
    const { readFileSync } = await import('fs');
    const { dirname, resolve } = await import('path');
    const { fileURLToPath } = await import('url');

    // <repoRoot>/src/lib/riotApi.js → resolve to <repoRoot>/public/summoners.txt
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const filePath  = resolve(__dirname, '../../public/summoners.txt');
    const text      = readFileSync(filePath, 'utf8');

    return parse(text);
  } catch (err) {
    // Fallback: if file missing or fs import fails, try HTTP fetch (dev only)
    const res  = await fetch('/summoners.txt').catch(() => null);
    if (res && res.ok) return parse(await res.text());
    throw new Error('Cannot load summoners.txt from disk or HTTP');
  }
}

/* ---------- 3 · Riot REST wrappers --------------------------------------- */
const riotFetch = async baseUrl => {
  const res = await fetch(`${baseUrl}?api_key=${apiKey}`);
  if (!res.ok) throw new Error(`Riot API error (${res.status})`);
  return res.json();
};

export const getAccountInfo = (game, tag) =>
  riotFetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(game)}/${encodeURIComponent(tag)}`);

export const getSummonerInfo = puuid =>
  riotFetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`);

export const getLeagueInfo   = summonerId =>
  riotFetch(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${encodeURIComponent(summonerId)}`);

/* ---------- 4 · CDN helper ----------------------------------------------- */
export const profileIconUrl = iconId =>
  `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${iconId}.png`;
