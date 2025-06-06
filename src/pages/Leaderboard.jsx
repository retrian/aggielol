// src/pages/Leaderboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Leaderboard() {
  const [scope, setScope] = useState('current');
  const [rows, setRows] = useState([]);
  const [loadingRows, setLoadingRows] = useState(false);
  const [errorRows, setErrorRows] = useState(null);

  // 1) Map each Tier to an order index (0 = highest, 9 = lowest)
  const tierOrderMap = {
    CHALLENGER: 0,
    GRANDMASTER: 1,
    MASTER: 2,
    DIAMOND: 3,
    EMERALD: 4,
    PLATINUM: 5,
    GOLD: 6,
    SILVER: 7,
    BRONZE: 8,
    IRON: 9,
  };

  // 2) Map each Division to an order index (0 = I, 1 = II, 2 = III, 3 = IV)
  const divisionOrderMap = {
    I: 0,
    II: 1,
    III: 2,
    IV: 3,
  };



  // Fetch leaderboard data whenever 'scope' changes
  useEffect(() => {
    setLoadingRows(true);
    setErrorRows(null);

    const url = scope === 'all'
      ? '/api/leaderboard?scope=all'
      : '/api/leaderboard';

    axios
      .get(url)
      .then(res => {
        setRows(res.data);
        setLoadingRows(false);
      })
      .catch(err => {
        console.error('Failed to fetch leaderboard rows:', err);
        setErrorRows('Failed to load leaderboard.');
        setLoadingRows(false);
      });
  }, [scope]);

  // Helper: format LP (e.g. "1500 LP" or "—")
  const formatLP = (lp) => {
    if (lp === null || lp === undefined) return '—';
    return `${lp} LP`;
  };

  // Helper: compute win rate string (e.g. "79%")
  const computeWinRate = (wins, losses) => {
    const total = (wins || 0) + (losses || 0);
    if (total === 0) return '—';
    return Math.round((wins / total) * 100) + '%';
  };

  // Custom sort: Tier → Division → LP (desc) → Wins (desc) → Name
  const sortRows = (data) => {
    return data
      .slice() // create a shallow copy
      .sort((a, b) => {
        // 1) Tier index
        const tierA = a.tier ? a.tier.toUpperCase() : null;
        const tierB = b.tier ? b.tier.toUpperCase() : null;
        const tierIndexA = tierA && tierOrderMap.hasOwnProperty(tierA)
          ? tierOrderMap[tierA]
          : Number.MAX_SAFE_INTEGER;
        const tierIndexB = tierB && tierOrderMap.hasOwnProperty(tierB)
          ? tierOrderMap[tierB]
          : Number.MAX_SAFE_INTEGER;
        if (tierIndexA !== tierIndexB) {
          return tierIndexA - tierIndexB;
        }
        // 2) Division index (I → IV)
        const divA = a.division ? a.division.toUpperCase() : null;
        const divB = b.division ? b.division.toUpperCase() : null;
        const divIndexA = divA && divisionOrderMap.hasOwnProperty(divA)
          ? divisionOrderMap[divA]
          : Number.MAX_SAFE_INTEGER;
        const divIndexB = divB && divisionOrderMap.hasOwnProperty(divB)
          ? divisionOrderMap[divB]
          : Number.MAX_SAFE_INTEGER;
        if (divIndexA !== divIndexB) {
          return divIndexA - divIndexB;
        }
        // 3) LP descending
        const lpA = a.lp ?? -Infinity;
        const lpB = b.lp ?? -Infinity;
        if (lpA !== lpB) {
          return lpB - lpA;
        }
        // 4) Wins descending (extra tiebreaker)
        const winsA = a.wins ?? 0;
        const winsB = b.wins ?? 0;
        if (winsA !== winsB) {
          return winsB - winsA;
        }
        // 5) Finally, alphabetical by display_name
        return a.display_name.localeCompare(b.display_name);
      });
  };

  // If we have data, sort it
  const sortedRows = sortRows(rows);

  // Get rank badge colors
  const getRankBadgeColor = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-800';
    return 'bg-gradient-to-r from-blue-500 to-blue-700';
  };

  const getWinrateColor = (winrate) => {
    const rate = parseInt(winrate);
    if (rate >= 70) return 'text-green-400';
    if (rate >= 60) return 'text-blue-400';
    if (rate >= 50) return 'text-purple-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Leaderboard
        </h1>

        {/* Scope toggle buttons */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          <button
            onClick={() => setScope('current')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105
              ${scope === 'current'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'}`}
          >
            Current Players
          </button>
          <button
            onClick={() => setScope('all')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105
              ${scope === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'}`}
          >
            All Players
          </button>
        </div>

        {loadingRows && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-300 mt-4">Loading leaderboard…</p>
          </div>
        )}

        {errorRows && (
          <div className="text-center py-4">
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 inline-block">
              <p className="text-red-400">{errorRows}</p>
            </div>
          </div>
        )}

        {!loadingRows && !errorRows && rows.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-800/50 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-xl text-gray-400 mb-2">No players found</p>
              {scope === 'current' && (
                <p className="text-sm text-gray-500">
                  Make sure there are players in the current school year.
                </p>
              )}
            </div>
          </div>
        )}

        {!loadingRows && !errorRows && rows.length > 0 && (
          <div className="max-w-6xl mx-auto">
            {/* Top 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {sortedRows.slice(0, 3).map((row, idx) => {
                const wins = row.wins || 0;
                const losses = row.losses || 0;
                const totalGames = wins + losses;
                const winRate = computeWinRate(wins, losses);
                const rankNumber = idx + 1;

                const profileIconUrl = row.icon_id
                  ? `https://ddragon.leagueoflegends.com/cdn/15.11.1/img/profileicon/${row.icon_id}.png`
                  : null;

                const tierKey = row.tier ? row.tier.toUpperCase() : null;
                const tierImgUrl = tierKey ? `/images/${tierKey}_SMALL.jpg` : null;

                return (
                  <div
                    key={row.id}
                    className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 
                               border border-gray-700 shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    {/* Rank badge */}
                    <div className={`absolute -top-3 -left-3 ${getRankBadgeColor(rankNumber)} 
                                   rounded-full h-12 w-12 flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-xl">{rankNumber}</span>
                    </div>

                    <div className="text-center space-y-4 mt-2">
                      {/* Profile Icon */}
                      {profileIconUrl ? (
                        <img
                          src={profileIconUrl}
                          alt="icon"
                          className="h-24 w-24 rounded-full border-4 border-gray-600 mx-auto shadow-lg"
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center mx-auto">
                          <span className="text-2xl text-gray-400">?</span>
                        </div>
                      )}

                      {/* Player Name */}
                      <div className="text-xl font-bold text-white">
                        {row.display_name}
                      </div>

                      {/* LP - Large and prominent */}
                      <div className="text-4xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-500 
                                    bg-clip-text text-transparent">
                        {formatLP(row.lp)}
                      </div>

                      {/* Tier and Division */}
                      <div className="flex items-center justify-center space-x-2">
                        {tierImgUrl ? (
                          <img src={tierImgUrl} alt={`${row.tier} badge`} className="h-8" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                        {row.division && (
                          <span className="text-lg font-semibold text-gray-200">{row.division}</span>
                        )}
                      </div>

                      {/* Win stats */}
                      <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
                        <div className="text-sm text-gray-300">
                          {wins}W - {losses}L
                        </div>
                        <div className={`text-lg font-bold ${getWinrateColor(winRate)}`}>
                          ({winRate})
                        </div>
                        <div className="text-xs text-gray-400">
                          {totalGames} games
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rest of players - Compact table style */}
            <div className="bg-gray-900/80 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-200 mb-4">Rankings</h2>
                
                <div className="space-y-2">
                  {sortedRows.slice(3).map((row, idx) => {
                    const rankNumber = idx + 4;
                    const wins = row.wins || 0;
                    const losses = row.losses || 0;
                    const totalGames = wins + losses;
                    const winRate = computeWinRate(wins, losses);

                    const profileIconUrl = row.icon_id
                      ? `https://ddragon.leagueoflegends.com/cdn/15.11.1/img/profileicon/${row.icon_id}.png`
                      : null;

                    const tierKey = row.tier ? row.tier.toUpperCase() : null;
                    const tierImgUrl = tierKey ? `/images/${tierKey}_SMALL.jpg` : null;

                    return (
                      <div
                        key={row.id}
                        className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg 
                                 hover:bg-gray-700/50 transition-all duration-200 border border-gray-700"
                      >
                        {/* Left side - Rank, Profile, Name */}
                        <div className="flex items-center space-x-4 flex-1">
                          {/* Rank */}
                          <div className="text-2xl font-bold text-gray-300 w-8 text-center">
                            {rankNumber}
                          </div>

                          {/* Profile Icon */}
                          {profileIconUrl ? (
                            <img
                              src={profileIconUrl}
                              alt="icon"
                              className="h-12 w-12 rounded-full border-2 border-gray-600"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center">
                              <span className="text-gray-400">?</span>
                            </div>
                          )}

                          {/* Player Info */}
                          <div className="flex-1">
                            <div className="font-bold text-white text-lg">
                              {row.display_name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {row.game_name}{row.tag_line && `#${row.tag_line}`}
                            </div>
                          </div>
                        </div>

                        {/* Right side - Rank, LP, Winrate */}
                        <div className="flex items-center space-x-6">
                          {/* Tier */}
                          <div className="flex items-center space-x-2 min-w-[100px]">
                            {tierImgUrl ? (
                              <img src={tierImgUrl} alt={`${row.tier} badge`} className="h-8" />
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                            {row.division && (
                              <span className="text-sm font-semibold text-gray-200">
                                {row.division}
                              </span>
                            )}
                          </div>

                          {/* LP */}
                          <div className="text-right min-w-[80px]">
                            <div className="text-xl font-bold text-yellow-400">
                              {formatLP(row.lp)}
                            </div>
                          </div>

                          {/* Win stats */}
                          <div className="text-right min-w-[100px]">
                            <div className="text-sm text-gray-300">
                              {wins}W - {losses}L
                            </div>
                            <div className={`text-sm font-bold ${getWinrateColor(winRate)}`}>
                              ({winRate})
                            </div>
                          </div>

                          {/* Games count */}
                          <div className="text-right min-w-[60px]">
                            <div className="text-sm text-gray-400">
                              {totalGames}
                            </div>
                            <div className="text-xs text-gray-500">games</div>
                          </div>

                          {/* Team (if current scope) */}
                          {scope === 'current' && (
                            <div className="text-right min-w-[80px]">
                              <div className="text-sm text-gray-300">
                                {row.team_name || '—'}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}