// src/pages/Leaderboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../lib/theme.jsx';

// Configure API base URL - use environment variable or fallback to Render URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://aggielol.onrender.com';

/* ───────────────────────────────────────────────────── */

export default function Leaderboard() {
  /* theme (so the page-wide gradient can flip) */
  const { theme } = useTheme();

  /* view / data state */
  const [scope, setScope] = useState('current');        // 'current' | 'all'
  const [rows,  setRows]  = useState([]);
  const [loadingRows, setLoadingRows] = useState(false);
  const [errorRows,   setErrorRows]   = useState(null);

  /* order maps */
  const tierOrderMap = {
    CHALLENGER: 0, GRANDMASTER: 1, MASTER: 2, DIAMOND: 3,
    EMERALD: 4,    PLATINUM: 5,    GOLD: 6,  SILVER: 7,
    BRONZE: 8,     IRON: 9,
  };
  const divisionOrderMap = { I:0, II:1, III:2, IV:3 };

  /* fetch rows */
  useEffect(() => {
    setLoadingRows(true);
    setErrorRows(null);

    // Use full API URL instead of relative path
    const url = scope === 'all' 
      ? `${API_BASE_URL}/api/leaderboard?scope=all` 
      : `${API_BASE_URL}/api/leaderboard`;

    axios.get(url)
      .then(res => { setRows(res.data); setLoadingRows(false); })
      .catch(err => { 
        console.error('API Error:', err); 
        setErrorRows('Failed to load leaderboard.'); 
        setLoadingRows(false); 
      });
  }, [scope]);

  /* helpers */
  const formatLP = lp => lp != null ? `${lp} LP` : '—';
  const winRate  = (w,l) => { const t=(w||0)+(l||0); return t ? Math.round((w/t)*100)+'%' : '—'; };

  const sortRows = list => [...list].sort((a,b) => {
    const tx = tierOrderMap[a.tier?.toUpperCase()] ?? 99;
    const ty = tierOrderMap[b.tier?.toUpperCase()] ?? 99;
    if (tx!==ty) return tx-ty;
    const dx = divisionOrderMap[a.division] ?? 99;
    const dy = divisionOrderMap[b.division] ?? 99;
    if (dx!==dy) return dx-dy;
    if ((a.lp??-1)!==(b.lp??-1)) return (b.lp??0)-(a.lp??0);
    if ((a.wins??-1)!==(b.wins??-1)) return (b.wins??0)-(a.wins??0);
    return a.display_name.localeCompare(b.display_name);
  });
  const sorted = sortRows(rows);

  /* colour helpers (unchanged) */
  const getRankBadge = r => ({
    1:'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 shadow-yellow-400/50',
    2:'bg-gradient-to-br from-gray-200 via-gray-300  to-gray-500  shadow-gray-400/50',
    3:'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 shadow-amber-600/50'
  }[r] || 'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 shadow-slate-600/30');

  const getWinRateColor = wr => {
    const r=parseInt(wr,10);
    if (r>=70) return 'text-emerald-600 bg-emerald-50  dark:bg-emerald-900/20 border-emerald-200  dark:border-emerald-800';
    if (r>=60) return 'text-blue-600   bg-blue-50     dark:bg-blue-900/20    border-blue-200   dark:border-blue-800';
    if (r>=50) return 'text-purple-600 bg-purple-50   dark:bg-purple-900/20  border-purple-200 dark:border-purple-800';
    return          'text-red-600    bg-red-50       dark:bg-red-900/20     border-red-200    dark:border-red-800';
  };

  const getTierGradient = t => ({
    CHALLENGER : 'from-yellow-400 via-yellow-500 to-orange-600',
    GRANDMASTER: 'from-rose-500   via-red-500    to-pink-600',
    MASTER     : 'from-purple-500 via-purple-500 to-violet-600',
    DIAMOND    : 'from-blue-400   via-cyan-400   to-blue-500',
    EMERALD    : 'from-emerald-400 via-green-500  to-teal-600',
    PLATINUM   : 'from-teal-400   via-cyan-500   to-blue-500',
    GOLD       : 'from-yellow-400 via-amber-500  to-orange-500',
    SILVER     : 'from-gray-300   via-slate-400  to-gray-500',
    BRONZE     : 'from-amber-600  via-orange-700 to-red-700',
    IRON       : 'from-gray-500   via-gray-600   to-gray-700',
  }[t?.toUpperCase()] || 'from-gray-400 to-gray-600');

  /* pick gradient according to theme */
    const outerClasses = `
      min-h-screen transition-colors duration-300
      bg-white            /* light mode  */
      dark:bg-[#1c1c1f]   /* dark mode   */
`;

  /* ─────────── render ─────────── */
  return (
    <div className={outerClasses}>
      {/* decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#500000]/10 to-[#7f0000]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-[#500000] via-[#7f0000] to-[#500000] bg-clip-text text-transparent">
            LEADERBOARD
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            The best players apart of Texas A&M University
          </p>
        </div>

        {/* controls */}
        <div className="flex justify-center gap-3 mb-12">
          {[
            {key:'current', label:'Current Players'},
            {key:'all',     label:'All Players'},
          ].map(btn => (
            <button
              key={btn.key}
              onClick={() => setScope(btn.key)}
              className={`
                group relative px-8 py-4 rounded-2xl font-semibold transition-all duration-300
                ${scope===btn.key
                  ? 'bg-gradient-to-r from-[#500000] to-[#7f0000] text-white shadow-xl shadow-[#500000]/30 scale-105'
                  : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#500000]/50 hover:bg-gray-50 dark:hover:bg-gray-700/80'}
              `}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* main content */}
        {loadingRows ? (
          <Loading />
        ) : errorRows ? (
          <ErrorState msg={errorRows} />
        ) : !rows.length ? (
          <EmptyState />
        ) : (
          <EnhancedTableView
            rows={sorted}
            scope={scope}
            getRankBadge={getRankBadge}
            getWinRateColor={getWinRateColor}
            getTierGradient={getTierGradient}
            formatLP={formatLP}
            winRate={winRate}
          />
        )}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   tiny loading / error / empty components
──────────────────────────────────────────────────────────── */

const Loading = () => (
  <div className="text-center py-20">
    <div className="inline-block w-16 h-16 border-4 border-[#500000]/20 border-t-[#500000] rounded-full animate-spin" />
    <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">Loading leaderboard…</p>
  </div>
);

const ErrorState = ({msg}) => (
  <div className="text-center py-20">
    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">❌</div>
    <p className="text-red-600 dark:text-red-400 text-lg font-medium">{msg}</p>
    <button
      onClick={() => window.location.reload()}
      className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Try again
    </button>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-20">
    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">👥</div>
    <p className="text-gray-600 dark:text-gray-400 text-lg">No players found.</p>
  </div>
);

/* ───────────────────────────────────────────────────────────
   EnhancedTableView (unchanged markup—already dark-aware)
──────────────────────────────────────────────────────────── */

function EnhancedTableView({
  rows, scope,
  getRankBadge, getWinRateColor, getTierGradient,
  formatLP, winRate
}) {
  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* ── Top-3 Podium ── */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {rows.slice(0, 3).map((row, i) => {
            const wins   = row.wins   || 0;
            const losses = row.losses || 0;
            const wlRate = winRate(wins, losses);
            const iconId = row.profile_icon_id ?? row.icon_id;
            const icon   = iconId
              ? `https://ddragon.leagueoflegends.com/cdn/15.11.1/img/profileicon/${iconId}.png`
              : null;
            const tierImg = row.tier
              ? `/images/${row.tier.toUpperCase()}_SMALL.jpg`
              : null;

            return (
              <div
                key={row.id}
                className={`
                  relative group transition-transform duration-500 hover:scale-105
                  ${i === 0 ? 'md:order-2 md:-mt-6' : i === 1 ? 'md:order-1' : 'md:order-3'}
                `}
              >
                {/* Card */}
                <div className="relative p-8 rounded-3xl border border-gray-200 dark:[#31313c] backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all">
                  {/* Rank badge */}
                  <div className={`${getRankBadge(i + 1)} absolute -top-4 -left-4 h-16 w-16 rounded-2xl flex items-center justify-center shadow-2xl transform -rotate-12 group-hover:rotate-0 transition-transform`}>
                    <span className="text-white text-2xl font-black">{i + 1}</span>
                  </div>

                  {/* Crown for #1 */}
                  {i === 0 && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl animate-bounce">👑</div>
                  )}

                  <div className="text-center space-y-6 mt-4">
                    {/* Profile icon */}
                    <div className="relative mx-auto w-28 h-28">
                      {icon ? (
                        <img
                          src={icon}
                          alt=""
                          className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-600 shadow-xl"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center border-4 border-white dark:border-gray-600 shadow-xl">
                          <span className="text-3xl text-gray-400">?</span>
                        </div>
                      )}
                    </div>

                    {/* Names */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {row.display_name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {row.game_name}{row.tag_line && `#${row.tag_line}`}
                      </p>
                    </div>

                    {/* LP big text */}
                    <p className={`text-4xl font-black bg-gradient-to-r ${getTierGradient(row.tier)} bg-clip-text text-transparent`}>
                      {formatLP(row.lp)}
                    </p>

                    {/* Tier / division */}
                    <div className="flex justify-center items-center gap-3">
                      {tierImg && <img src={tierImg} alt="" className="h-10" />}
                      {row.division && (
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{row.division}</p>
                      )}
                    </div>

                    {/* Stats box */}
                    <div className="bg-whithe p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
                      <div className="flex justify-between"><span className="text-sm text-gray-600 dark:text-gray-400">Record</span><span className="font-bold">{wins}W&nbsp;-&nbsp;{losses}L</span></div>
                      <div className="flex justify-between"><span className="text-sm text-gray-600 dark:text-gray-400">Win Rate</span><span className={`px-3 py-1 rounded-full text-sm font-bold border ${getWinRateColor(wlRate)} dark:bg-gray-900 dark:border-gray-700`}>{wlRate}</span></div>
                      <div className="flex justify-between"><span className="text-sm text-gray-600 dark:text-gray-400">Games</span><span className="font-semibold">{wins + losses}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Remaining rankings ── */}
      {rows.length > 3 && (
  <div className="bg-background text-foreground backdrop-blur-sm rounded-3xl border border-border shadow-2xl overflow-hidden">
    <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700" />
    <div className="divide-y divide-gray-100 dark:divide-gray-800">
      {rows.slice(3).map((row, idx) => {
        const rank = idx + 4;
        const wins = row.wins || 0;
        const losses = row.losses || 0;
        const wlRate = winRate(wins, losses);
        const iconId = row.profile_icon_id ?? row.icon_id;
        const icon = iconId
          ? `https://ddragon.leagueoflegends.com/cdn/15.11.1/img/profileicon/${iconId}.png`
          : null;
        const tierImg = row.tier
          ? `/images/${row.tier.toUpperCase()}_SMALL.jpg`
          : null;

        return (
          <div
            key={row.id}
            className="grid grid-cols-12 items-center gap-4 px-6 sm:px-8 py-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent dark:hover:from-gray-800/50 dark:hover:to-transparent transition-all duration-300"
          >
            {/* Rank number (col 1) */}
            <div className="col-span-1 flex justify-center">
              <div className="flex items-center justify-center w-10 h-10 bg-white-50 rounded-xl font-bold text-lg group-hover:scale-110 transition-transform">
                {rank}
              </div>
            </div>

            {/* Profile icon (col 2) */}
            <div className="col-span-1">
              {icon ? (
                <img
                  src={icon}
                  alt=""
                  className="h-14 w-14 rounded-xl border-2 border-gray-300 dark:border-gray-600 shadow-md"
                />
              ) : (
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-400 border-2 border-gray-300 dark:border-gray-600">
                  ?
                </div>
              )}
            </div>

            {/* Names (col 3-4) */}
            <div className="col-span-3 min-w-0">
              <p className="font-bold text-lg text-gray-900 dark:text-white truncate group-hover:text-[#7f0000]">
                {row.display_name}
              </p>
              <p className="-mt-1 text-sm text-gray-400 dark:text-gray-200 truncate">
                {row.game_name}
                {row.tag_line && `#${row.tag_line}`}
              </p>
            </div>

            {/* Tier badge (col 5) */}
            <div className="col-span-2 flex items-center gap-1">
              {tierImg ? (
                <>
                  <img src={tierImg} alt="" className="h-8 w-8" />
                  {row.division && (
                    <p className="text-xs text-gray-500">{row.division}</p>
                  )}
                </>
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </div>

            {/* LP (col 6) */}
            <div className="col-span-1 text-right">
              <p
                className={`font-bold text-lg bg-gradient-to-r ${getTierGradient(
                  row.tier
                )} bg-clip-text text-transparent`}
              >
                {formatLP(row.lp)}
              </p>
            </div>

            {/* Win-rate (col 7-8) */}
            <div className="col-span-2 flex items-center justify-end gap-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {wins}W-{losses}L
              </span>
              <span
                className={`px-2 py-1 rounded-lg text-xs font-bold border ${getWinRateColor(
                  wlRate
                )}`}
              >
                {wlRate}
              </span>
            </div>

            {/* Games (col 9) */}
            <div className="col-span-1 text-right hidden sm:block">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {wins + losses} Games
              </span>
            </div>

            {/* Team (current only) (col 10) */}
            {scope === 'current' && (
              <div className="col-span-1 text-right hidden lg:block">
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {row.team_name ?? '—'}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}


    </div>
  );
}