// src/pages/TeamDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Trophy, Users, Calendar, BarChart3, Target, Award } from "lucide-react";

/* ───────────────────────────────────────────────────────── PlayerCard */
const PlayerCard = ({ player, leaderboardRank, isStarter = true }) => {
  /* role helpers */
  const roleIcons = { Top: "🛡️", Jungle: "🌲", Mid: "⚡", ADC: "🏹", Support: "💎" };
  const roleGrads = {
    Top: "from-blue-500 to-blue-700",
    Jungle: "from-green-500 to-green-700",
    Mid: "from-yellow-500 to-yellow-700",
    ADC: "from-red-500 to-red-700",
    Support: "from-purple-500 to-purple-700",
  };
  const iconUrl = (id) =>
    `https://ddragon.leagueoflegends.com/cdn/15.11.1/img/profileicon/${id}.png`;

  /* ranked fields */
  const tier = player.tier?.toUpperCase() ?? "UNRANKED";
  const division = player.division ?? "";
  const tierImg = `/images/${tier}_SMALL.jpg`;

  const lpText = player.lp != null ? `${player.lp} LP` : "—";
  const wins = player.wins ?? 0;
  const losses = player.losses ?? 0;
  const wr = wins + losses ? Math.round((wins / (wins + losses)) * 100) : "—";
  const iconId = player.profile_icon_id ?? player.icon_id;

  // Different sizes for starters vs substitutes
  const cardSize = isStarter ? "p-8" : "p-4";
  const avatarSize = isStarter ? "w-24 h-24" : "w-16 h-16";
  const rankBadgeSize = isStarter ? "w-16 h-16" : "w-12 h-12";
  const nameSize = isStarter ? "text-2xl" : "text-lg";
  const lpBadgeSize = isStarter ? "px-6 py-3" : "px-4 py-2";

  return (
    <div className={`relative bg-gradient-to-br from-gray-800/60 to-gray-900/90 backdrop-blur-lg border border-gray-700/60 rounded-2xl ${cardSize} hover:border-red-500/60 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 group hover:scale-105`}>
      {/* leaderboard rank badge */}
      <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold px-4 py-2 rounded-full shadow-xl border-2 border-red-400/50">
        #{leaderboardRank}
      </div>

      {/* rank emblem */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <img src={tierImg} alt={tier} className={`${rankBadgeSize} select-none drop-shadow-lg`} />
        {division && tier !== "UNRANKED" && (
          <span className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded-full -mt-2">
            {division}
          </span>
        )}
      </div>

      {/* avatar + info */}
      <div className={`flex flex-col items-center space-y-${isStarter ? '6' : '4'} ${isStarter ? 'mt-12' : 'mt-8'}`}>
        {/* avatar */}
        <div className={`relative ${avatarSize}`}>
          {iconId ? (
            <img
              src={iconUrl(iconId)}
              alt=""
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-2xl group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${
                roleGrads[player.role] ?? "from-gray-500 to-gray-700"
              } rounded-full flex items-center justify-center ${isStarter ? 'text-3xl' : 'text-2xl'} shadow-2xl group-hover:scale-110 transition-transform duration-300 border-4 border-white`}
            >
              {roleIcons[player.role] ?? "⭐"}
            </div>
          )}
        </div>

        {/* LP badge */}
        <div className={`flex items-center space-x-2 bg-gradient-to-r from-yellow-600 to-yellow-500 ${lpBadgeSize} rounded-full shadow-lg`}>
          <Trophy className={`${isStarter ? 'w-5 h-5' : 'w-4 h-4'} text-white`} />
          <span className={`text-white font-bold ${isStarter ? 'text-xl' : 'text-lg'}`}>{lpText}</span>
        </div>

        {/* name + W/L */}
        <div className="text-center space-y-2">
          <h3 className={`${nameSize} font-bold text-white`}>{player.display_name}</h3>
          <p className="text-gray-300 text-sm font-semibold bg-gray-700/50 px-3 py-1 rounded-full">
            {player.role}
          </p>
          <p className="text-gray-400 text-sm font-medium">
            {wins}W - {losses}L
          </p>
        </div>

        {/* win-rate bar */}
        <div className="w-full bg-gray-700/50 rounded-full h-3 shadow-inner">
          <div
            className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-700 shadow-lg"
            style={{ width: `${wr === "—" ? 0 : wr}%` }}
          />
        </div>
        <span className="text-green-400 font-bold text-sm bg-green-400/10 px-3 py-1 rounded-full">
          {wr === "—" ? "—" : `${wr}%`} WR
        </span>
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────────────────── GamesPerRoleChart */
const GamesPerRoleChart = ({ players }) => {
  const roleData = players.reduce((acc, player) => {
    const role = player.role || "Unknown";
    const games = (player.wins ?? 0) + (player.losses ?? 0);
    acc[role] = (acc[role] || 0) + games;
    return acc;
  }, {});

  const roles = Object.keys(roleData);
  const maxGames = Math.max(...Object.values(roleData));
  const totalGames = Object.values(roleData).reduce((sum, games) => sum + games, 0);

  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/60">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-blue-400" />
        Games Per Role
      </h3>
      <div className="space-y-4">
        {roles.map((role) => {
          const games = roleData[role];
          const percentage = maxGames > 0 ? (games / maxGames) * 100 : 0;
          const roleColor = {
            Top: "blue",
            Jungle: "green", 
            Mid: "yellow",
            ADC: "red",
            Support: "purple"
          }[role] || "gray";

          return (
            <div key={role} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">{role}</span>
                <span className="text-gray-300 font-medium">{games} games</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-4 shadow-inner">
                <div
                  className={`bg-gradient-to-r from-${roleColor}-500 to-${roleColor}-400 h-4 rounded-full transition-all duration-700 shadow-lg`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
        <div className="pt-4 border-t border-gray-600/50">
          <div className="flex justify-between items-center">
            <span className="text-white font-bold text-lg">Total</span>
            <span className="text-blue-400 font-bold text-lg">{totalGames} games</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────────────────── LPDistributionChart */
const LPDistributionChart = ({ players }) => {
  const sortedPlayers = [...players].sort((a, b) => (b.lp ?? 0) - (a.lp ?? 0));
  const maxLP = Math.max(...players.map(p => p.lp ?? 0));

  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/60">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <Trophy className="w-6 h-6 text-yellow-400" />
        LP Distribution (Starters)
      </h3>
      <div className="space-y-4">
        {sortedPlayers.map((player, index) => {
          const lp = player.lp ?? 0;
          const percentage = maxLP > 0 ? (lp / maxLP) * 100 : 0;
          
          return (
            <div key={player.player_id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold">{player.display_name}</span>
                  <span className="text-gray-400 text-sm">({player.role})</span>
                </div>
                <span className="text-yellow-400 font-bold">{lp} LP</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-4 shadow-inner">
                <div
                  className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-4 rounded-full transition-all duration-700 shadow-lg"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────────────────── PlayerRankings */
const PlayerRankings = ({ players }) => {
  const tierOrder = {
    CHALLENGER: 0, GRANDMASTER: 1, MASTER: 2, DIAMOND: 3,
    EMERALD: 4, PLATINUM: 5, GOLD: 6, SILVER: 7,
    BRONZE: 8, IRON: 9,
  };
  
  const divOrder = { I: 0, II: 1, III: 2, IV: 3 };
  
  const rankSort = (a, b) => {
    const ta = tierOrder[a.tier?.toUpperCase()] ?? 99;
    const tb = tierOrder[b.tier?.toUpperCase()] ?? 99;
    if (ta !== tb) return ta - tb;
    const da = divOrder[a.division] ?? 99;
    const db = divOrder[b.division] ?? 99;
    if (da !== db) return da - db;
    if ((a.lp ?? -1) !== (b.lp ?? -1)) return (b.lp ?? 0) - (a.lp ?? 0);
    return a.display_name.localeCompare(b.display_name);
  };

  const sortedPlayers = [...players].sort(rankSort);

  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/60">
      <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <Award className="w-8 h-8 text-purple-400" />
        Player Rankings
      </h3>
      <div className="space-y-6">
        {sortedPlayers.map((player, index) => {
          const tier = player.tier?.toUpperCase() ?? "UNRANKED";
          const division = player.division ?? "";
          const lp = player.lp ?? 0;
          const wins = player.wins ?? 0;
          const losses = player.losses ?? 0;
          const winrate = wins + losses ? Math.round((wins / (wins + losses)) * 100) : 0;
          
          return (
            <div key={player.player_id} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-700/30 to-gray-800/30 rounded-xl border border-gray-600/30 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center gap-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full text-white font-bold text-xl">
                  {index + 1}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{player.display_name}</h4>
                  <p className="text-gray-400 font-medium">{player.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-8 text-right">
                <div>
                  <p className="text-white font-bold text-lg">{tier} {division}</p>
                  <p className="text-yellow-400 font-semibold">{lp} LP</p>
                </div>
                <div>
                  <p className="text-white font-medium">{wins}W - {losses}L</p>
                  <p className="text-green-400 font-semibold">{winrate}% WR</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────────────────── TeamDetail */
export default function TeamDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* rank-sort helpers */
  const tierOrder = {
    CHALLENGER: 0, GRANDMASTER: 1, MASTER: 2, DIAMOND: 3,
    EMERALD: 4, PLATINUM: 5, GOLD: 6, SILVER: 7,
    BRONZE: 8, IRON: 9,
  };
  const divOrder = { I: 0, II: 1, III: 2, IV: 3 };
  const rankSort = (a, b) => {
    const ta = tierOrder[a.tier?.toUpperCase()] ?? 99;
    const tb = tierOrder[b.tier?.toUpperCase()] ?? 99;
    if (ta !== tb) return ta - tb;
    const da = divOrder[a.division] ?? 99;
    const db = divOrder[b.division] ?? 99;
    if (da !== db) return da - db;
    if ((a.lp ?? -1) !== (b.lp ?? -1)) return (b.lp ?? 0) - (a.lp ?? 0);
    if ((a.wins ?? -1) !== (b.wins ?? -1)) return (b.wins ?? 0) - (a.wins ?? 0);
    return a.display_name.localeCompare(b.display_name);
  };

  /* fetch */
  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/teams/${slug}`)
      .then(r => { if (!r.ok) throw Error(`HTTP ${r.status}`); return r.json(); })
      .then(json => alive && setData(json))
      .catch(err => alive && setError(err))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [slug]);

  if (loading) return <LoadingScreen text="Loading team data…" />;
  if (error) return <ErrorScreen text={error.message} />;
  if (!data) return <ErrorScreen text="Team not found." />;

  /* normalise roles */
  const { team, season, roster = [], matches = [] } = data;
  const roleMap = { top: "Top", jgl: "Jungle", jungle: "Jungle", mid: "Mid", adc: "ADC", bot: "ADC", sup: "Support", support: "Support" };
  const rosterNorm = roster.map(r => ({ ...r, role: roleMap[r.role?.toLowerCase()] ?? r.role }));

  /* starters & bench */
  const starters = rosterNorm.filter(r => (r.status ?? "").toLowerCase() === "starter");
  const bench = rosterNorm.filter(r => (r.status ?? "").toLowerCase().startsWith("sub"));
  const sortedRoster = [...rosterNorm].sort(rankSort);

  const roleOrder = ["Top", "Jungle", "Mid", "ADC", "Support"];
  const orderedStarters = roleOrder.map(role => starters.find(p => p.role === role)).filter(Boolean);

  /* team stats */
  const totalLP = rosterNorm.reduce((s, p) => s + (p.lp ?? 0), 0);
  const totalGames = rosterNorm.reduce((s, p) => s + (p.wins ?? 0) + (p.losses ?? 0), 0);
  const wins = rosterNorm.reduce((s, p) => s + (p.wins ?? 0), 0);
  const winrate = totalGames ? ((wins / totalGames) * 100).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* header */}
      <header className="border-b border-red-500/30 bg-gradient-to-r from-red-900/30 to-black/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
          <Link to="/teams" className="inline-flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors duration-300 group">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to teams
          </Link>
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-red-400/50">
              <span className="text-3xl font-bold"></span>
            </div>
            <div>
              <h1 className="text-6xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {team.name}
              </h1>
              {season && <p className="text-gray-400 font-semibold text-lg mt-2">Season {season}</p>}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {/* Starting Roster */}
        <section>
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            STARTING ROSTER
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {orderedStarters.map(p => (
              <PlayerCard
                key={p.player_id}
                player={p}
                leaderboardRank={sortedRoster.findIndex(q => q.player_id === p.player_id) + 1}
                isStarter={true}
              />
            ))}
          </div>
        </section>

        {/* Team Analytics */}
        <section className="space-y-12">
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            TEAM ANALYTICS
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GamesPerRoleChart players={starters} />
            <LPDistributionChart players={starters} />
          </div>
          
          <PlayerRankings players={rosterNorm} />
        </section>

        {/* Team Stats */}
        <section className="bg-gradient-to-r from-gray-800/40 to-gray-900/60 backdrop-blur-lg rounded-3xl p-12 border border-gray-700/60">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
            TEAM STATISTICS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <StatBox label="Team LP" value={totalLP} colour="blue" />
            <StatBox label="Total Games" value={totalGames} colour="purple" />
            <StatBox label="Winrate" value={`${winrate}%`} colour="green" />
          </div>
        </section>

        {/* Substitutes */}
        {bench.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-300">
              SUBSTITUTES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bench.map(p => (
                <PlayerCard
                  key={p.player_id}
                  player={p}
                  leaderboardRank={sortedRoster.findIndex(q => q.player_id === p.player_id) + 1}
                  isStarter={false}
                />
              ))}
            </div>
          </section>
        )}

        {/* Recent Matches */}
        <section className="space-y-10">
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent">
            RECENT MATCHES
          </h2>
          {matches.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-gray-800/30 to-gray-900/50 rounded-3xl border border-gray-700/50">
              <Calendar className="w-20 h-20 text-gray-600 mx-auto mb-6" />
              <p className="text-gray-400 text-xl">No matches recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {matches.map(m => <MatchRow key={m.id} match={m} />)}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/* ────────────────────────────────────────── small sub-components */
const LoadingScreen = ({ text }) => (
  <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-xl font-semibold">{text}</p>
    </div>
  </div>
);
const ErrorScreen = LoadingScreen;

const StatBox = ({ label, value, colour }) => (
  <div className={`text-center space-y-6 bg-gradient-to-br from-${colour}-600/20 to-${colour}-800/30 rounded-2xl p-8 border border-${colour}-500/40 hover:border-${colour}-400/60 transition-all duration-300 hover:scale-105`}>
    <h3 className="text-gray-300 text-lg font-semibold">{label}</h3>
    <p className={`text-5xl font-bold text-${colour}-400`}>{value}</p>
  </div>
);

const MatchRow = ({ match }) => (
  <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/70 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/60 hover:border-red-500/40 transition-all duration-300 hover:scale-[1.02]">
    <div className="flex items-center justify-between flex-wrap gap-8">
      <div className="flex items-center gap-8">
        <Info label="Date" value={new Date(match.match_date).toLocaleDateString()} />
        <Info label="Opponent" value={match.opponent} bold />
        <Info label="Result" value={match.result} bold colour={match.result.includes("Win") ? "green" : "red"} />
      </div>
      {match.details && (
        <Info label="Details" value={typeof match.details === "string" ? match.details : JSON.stringify(match.details)} />
      )}
    </div>
  </div>
);

const Info = ({ label, value, bold = false, colour }) => (
  <div className="text-center">
    <p className="text-gray-400 text-sm font-semibold">{label}</p>
    <p className={`${bold ? "font-bold text-xl" : "font-medium text-base"} ${colour ? `text-${colour}-400` : "text-white"} mt-1`}>
      {value}
    </p>
  </div>
);