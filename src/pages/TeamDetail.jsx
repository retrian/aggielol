/* ───────────────────────────────────────────────────────────
 * src/pages/TeamDetail.jsx — Enhanced UI/UX with dynamic theming
 * (now uses a configurable API_BASE_URL, just like Leaderboard)
 * ───────────────────────────────────────────────────────────
 */

import { useLayoutEffect, useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft, Calendar, Trophy, Star,
  TrendingUp, Users, Gamepad2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ——— 0 ▪ API base URL (new) ———————————————————————— */
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://aggielol.onrender.com";

/* ——— 1 ▪ Dynamic Configuration ———————————————————— */
const GAME_CONFIG = {
  tiers: [
    "IRON", "BRONZE", "SILVER", "GOLD",
    "PLATINUM", "EMERALD", "DIAMOND",
    "MASTER", "GRANDMASTER", "CHALLENGER"
  ],
  divisions: ["IV", "III", "II", "I"],
  roles: {
    Top:     { gradient: "from-blue-500 to-blue-700",   color: "blue"   },
    Jungle:  { gradient: "from-green-500 to-green-700", color: "green"  },
    Mid:     { gradient: "from-yellow-500 to-yellow-700", color: "yellow" },
    ADC:     { gradient: "from-red-500 to-red-700",     color: "red"    },
    Support: { gradient: "from-purple-500 to-purple-700", color: "purple" }
  },
  roleOrder: ["Top", "Jungle", "Mid", "ADC", "Support"]
};

const THEME_CONFIG = {
  animations: {
    duration: { fast: 0.2, normal: 0.3, slow: 0.5, hero: 0.8 },
    spring:   { type: "spring", stiffness: 300, damping: 30 },
    stagger:  { container: 0.07, delay: 0.2 }
  },
  gradients: {
    primary: "from-gray-900 via-black to-black",
    hero:    "from-black via-red-900/60 to-red-800/30",
    card:    "from-gray-800/60 to-gray-900/90",
    accent:  "from-red-600 to-red-700"
  }
};

/* ——— 2 ▪ Utility Functions —————————————————————— */
const calculateRankValue = (tier, division, lp = 0) => {
  if (!tier) return 0;
  const tierIndex = GAME_CONFIG.tiers.indexOf(tier?.toUpperCase());
  if (tierIndex === -1) return 0;
  const base = tierIndex * 400;
  const divisionIndex = GAME_CONFIG.divisions.indexOf(division);
  const divAdd = divisionIndex !== -1 ? divisionIndex * 100 : 0;
  return base + divAdd + lp;
};

const getRankLabel = (value) => {
  const tierIndex = Math.floor(value / 400);
  const tier = GAME_CONFIG.tiers[tierIndex] ?? "UNRANKED";
  if (tierIndex <= GAME_CONFIG.tiers.indexOf("DIAMOND")) {
    const divIndex = Math.floor((value % 400) / 100);
    if (GAME_CONFIG.divisions[divIndex]) {
      return `${tier} ${GAME_CONFIG.divisions[divIndex]}`;
    }
  }
  return tier;
};

const generateTeamTheme = (teamName) => {
  if (!teamName)
    return { gradient: "from-gray-600 to-gray-800", border: "border-gray-400/40", accent: "red" };

  const colorMap = {
    maroon:  { gradient: "from-red-600 to-red-800",     border: "border-red-400/40",     accent: "red"    },
    white:   { gradient: "from-gray-100 to-gray-300",   border: "border-gray-400/40",    accent: "gray"   },
    black:   { gradient: "from-gray-800 to-black",      border: "border-blue-400/40",    accent: "blue"   },
    gray:    { gradient: "from-gray-500 to-gray-700",   border: "border-gray-400/40",    accent: "gray"   },
    blue:    { gradient: "from-blue-600 to-blue-800",   border: "border-blue-400/40",    accent: "blue"   },
    green:   { gradient: "from-green-600 to-green-800", border: "border-green-400/40",   accent: "green"  },
    purple:  { gradient: "from-purple-600 to-purple-800", border: "border-purple-400/40", accent: "purple" },
    gold:    { gradient: "from-yellow-600 to-yellow-800", border: "border-yellow-400/40", accent: "yellow" },
    orange:  { gradient: "from-orange-600 to-orange-800", border: "border-orange-400/40", accent: "orange" }
  };

  const lower = teamName.toLowerCase();
  return colorMap[lower] || colorMap.maroon;
};

const getPlayerIconUrl = (id) =>
  `https://ddragon.leagueoflegends.com/cdn/15.18.1/img/profileicon/${id}.png`;

const getTierImageUrl = (tier) =>
  `/images/${tier?.toUpperCase()}_SMALL.jpg`;

/* ── 3 ▪ Enhanced UI Components ───────────────────────────── */
const PlayerCard = ({ player, rank, isStarter = true, teamTheme }) => {
  const roleConfig = GAME_CONFIG.roles[player.role] || {
    icon: "?", // Changed from star emoji
    gradient: "from-gray-500 to-gray-700",
    color: "gray"
  };

  const stats = useMemo(() => {
    const wins = player.wins ?? 0;
    const losses = player.losses ?? 0;
    const total = wins + losses;
    const winRate = total ? Math.round((wins / total) * 100) : 0;
    const lpText = player.lp != null ? `${player.lp} LP` : "0 LP";

    return { wins, losses, total, winRate, lpText };
  }, [player]);

  const tier = player.tier?.toUpperCase() ?? "UNRANKED";
  const iconId = player.profile_icon_id ?? player.icon_id;

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: THEME_CONFIG.animations.duration.normal,
        ease: "easeOut"
      }
    },
  };

  // Helper to safely construct Tailwind classes with dynamic colors
  const playerCardBorderClass = `border-${teamTheme.accent}-500/60`;
  const playerCardShadowClass = `shadow-${teamTheme.accent}-500/20`;
  const rankBadgeBorderClass = `border-${teamTheme.accent}-400/50`;
  const playerAvatarBorderHoverClass = `group-hover:border-${teamTheme.accent}-400`;


  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: THEME_CONFIG.animations.duration.fast } }}
      className={`relative group flex flex-col items-center p-6 rounded-2xl
                   bg-gradient-to-br ${THEME_CONFIG.gradients.card}
                   border border-gray-700/60 shadow-lg backdrop-blur-sm
                   hover:${playerCardBorderClass} hover:${playerCardShadowClass}
                   transition-all duration-300 cursor-pointer overflow-hidden`}
    >
      {/* Rank Badge - Only show if rank prop is provided */}
      {rank && (
        <motion.div
          className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs
                       font-bold text-white bg-gradient-to-r ${teamTheme.gradient}
                       border ${rankBadgeBorderClass} shadow-md z-10`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          #{rank}
        </motion.div>
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-transparent via-white/10 to-transparent" />
      </div>

      {/* Tier Display */}
      <div className="relative flex flex-col items-center mb-2"> {/* Added mb-2 for spacing */}
        <img
          src={getTierImageUrl(tier)}
          alt={tier}
          className={`${isStarter ? 'w-16 h-16' : 'w-12 h-12'} drop-shadow-lg transition-transform
                      group-hover:scale-110 duration-300`}
          onError={(e) => {
            e.target.style.display = 'none';
            if (e.target.nextElementSibling) {
                e.target.nextElementSibling.style.display = 'block';
            }
          }}
        />
        <div className="hidden text-xs font-bold text-white bg-black/60 px-2 py-1 rounded">
          {tier}
        </div>

        {player.division && tier !== "UNRANKED" && (
          <motion.span
            className="text-[10px] font-bold text-white bg-black/60
                       px-2 py-0.5 rounded-full -mt-2 border border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {player.division}
          </motion.span>
        )}
      </div>

      {/* Player Avatar */}
      <div className="relative mb-4"> {/* Added mb-4 for spacing */}
        {iconId ? (
          <img
            src={getPlayerIconUrl(iconId)}
            alt={`${player.display_name} avatar`}
            className={`${isStarter ? 'w-24 h-24' : 'w-16 h-16'} rounded-full object-cover
                         border-4 border-white/90 shadow-xl transition-all duration-300
                         ${playerAvatarBorderHoverClass} group-hover:shadow-2xl`}
          />
        ) : (
          <div className={`${isStarter ? 'w-24 h-24' : 'w-16 h-16'} flex items-center justify-center
                            rounded-full bg-gradient-to-br ${roleConfig.gradient}
                            text-3xl border-4 border-white/90 shadow-xl
                            ${playerAvatarBorderHoverClass}`}>
            {roleConfig.icon}
          </div>
        )}
      </div>

      {/* Player Info */}
      <div className="text-center space-y-1 w-full">
        <h3 className="font-bold text-lg leading-tight text-white truncate max-w-full px-2">
          {player.display_name}
        </h3>
        <p className={`text-xs text-${roleConfig.color}-300 tracking-wider uppercase font-semibold`}>
          {player.role}
        </p>
      </div>

      {/* Stats */}
      <div className="flex flex-col items-center gap-2 text-sm w-full mt-1"> {/* Added mt-4 */}
        <motion.div
          className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-yellow-500
                     text-white font-semibold px-4 py-1 rounded-full shadow-md"
          whileHover={{ scale: 1.05 }}
        >
          {stats.lpText}
        </motion.div>

        <div className="grid grid-cols-1 gap-2 text-xs w-full">
          <div className="text-center">
            <span className="text-green-200 font-semibold">{stats.wins}W</span>
            <span className="text-gray-200 mx-1">/</span>
            <span className="text-red-200 font-semibold">{stats.losses}L</span>
          </div>
          <div className="text-center">
            <span className={`font-semibold ${stats.winRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.winRate}%
            </span>
          </div>
        </div>

        <span className="text-blue-400 text-xs font-medium">{stats.total} games</span>
      </div>
    </motion.div>
  );
};

const DynamicStatsGrid = ({ players, teamTheme }) => {
  const stats = useMemo(() => {
    const roleData = players.reduce((acc, p) => {
      const role = p.role || "Unknown";
      const games = (p.wins ?? 0) + (p.losses ?? 0);
      acc[role] = (acc[role] || 0) + games;
      return acc;
    }, {});

    const totalGames = players.reduce((sum, p) => sum + (p.wins ?? 0) + (p.losses ?? 0), 0);
    const totalWins = players.reduce((sum, p) => sum + (p.wins ?? 0), 0);
    const winRate = totalGames ? (totalWins / totalGames) * 100 : 0;
    const avgRank = players.length ?
      players.reduce((sum, p) => sum + calculateRankValue(p.tier, p.division, p.lp), 0) / players.length : 0;

    return { roleData, totalGames, winRate, avgRank };
  }, [players]);

  const StatCard = ({ icon: Icon, label, value, color, delay = 0 }) => {
    const hoverBorderClass = `hover:border-${color}-500/40`;

    return (
      <motion.div
        className={`bg-gradient-to-br ${THEME_CONFIG.gradients.card} backdrop-blur-sm
                     p-6 rounded-2xl border border-gray-700/60 shadow-lg hover:shadow-xl
                     transition-all duration-300 ${hoverBorderClass}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -4 }}
      >
        <div className="flex flex-col items-center justify-center gap-4 h-full"> {/* Centering content */}
          <Icon className={`w-8 h-8 text-${color}-400`} />
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-3xl font-bold text-${color}-400`}>{value}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  const RoleDistribution = () => {
    const maxGames = Math.max(1, ...Object.values(stats.roleData));

    return (
      <motion.div
        className={`bg-gradient-to-br ${THEME_CONFIG.gradients.card} backdrop-blur-sm
                     p-8 rounded-2xl border border-gray-700/60 shadow-lg`} 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-center gap-2 mb-6"> {/* Increased margin */}
          <Users className="w-8 h-8 text-purple-400" /> {/* Larger icon */}
          <p className="text-lg text-gray-300 uppercase tracking-wider font-semibold">Games by Role</p> {/* Bigger text */}
        </div>
        <div className="space-y-4"> {/* Increased spacing */}
          {GAME_CONFIG.roleOrder.map(role => {
            const games = stats.roleData[role] || 0;
            const percentage = (games / maxGames) * 100;
            const roleConfig = GAME_CONFIG.roles[role];

            return (
              <div key={role} className="space-y-1">
                <div className="flex justify-between items-center text-sm"> {/* Larger text */}
                  <span className="flex items-center gap-2 text-gray-200 font-medium">
                    <span>{roleConfig.icon}</span>
                    {role}
                  </span>
                  <span className={`font-semibold text-${roleConfig.color}-400`}>{games}</span>
                </div>
                <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden"> {/* Thicker bar */}
                  <motion.div
                    className={`h-full bg-gradient-to-r ${roleConfig.gradient} rounded-full`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <StatCard
        icon={Gamepad2}
        label="Total Games"
        value={stats.totalGames.toLocaleString()}
        color="blue"
        delay={0}
      />
      <RoleDistribution />
      <StatCard
        icon={TrendingUp}
        label="Win Rate"
        value={`${stats.winRate.toFixed(1)}%`}
        color="green"
        delay={0.4}
      />
      <StatCard
        icon={Star}
        label="Avg Rank"
        value={getRankLabel(stats.avgRank)}
        color={teamTheme.accent}
        delay={0.6}
      />
    </div>
  );
};

const EnhancedPlayerRankings = ({ players, teamTheme }) => {
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      const rankA = calculateRankValue(a.tier, a.division, a.lp);
      const rankB = calculateRankValue(b.tier, b.division, b.lp);
      if (rankA !== rankB) return rankB - rankA;
      return a.display_name.localeCompare(b.display_name);
    });
  }, [players]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: THEME_CONFIG.animations.stagger.container,
        delayChildren: THEME_CONFIG.animations.stagger.delay
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: THEME_CONFIG.animations.duration.normal }
    }
  };

  const getBorderHoverClass = (accentColor) => {
    return `hover:border-${accentColor}-500/50`;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold
                       text-gray-400 uppercase tracking-wider
                       bg-gray-800/40 rounded-xl border border-gray-700/60">
        <span className="col-span-1 text-center">Rank</span>
        <span className="col-span-1 text-center">Avatar</span>
        <span className="col-span-2">Player</span>
        <span className="col-span-1 text-center">Tier</span>
        <span className="col-span-1 text-center">Division</span>
        <span className="col-span-1 text-center">LP</span>
        <span className="col-span-2 text-center">W/L Record</span>
        <span className="col-span-1 text-center">Win Rate</span>
        <span className="col-span-1 text-center">Games</span>
        <span className="col-span-1 text-center">Role</span>
      </div>

      {/* Player Rows */}
      {sortedPlayers.map((player, index) => {
        const stats = {
          wins: player.wins ?? 0,
          losses: player.losses ?? 0,
          get total() { return this.wins + this.losses; },
          get winRate() { return this.total ? Math.round((this.wins / this.total) * 100) : 0; }
        };

        const tier = player.tier?.toUpperCase() ?? "UNRANKED";
        const iconId = player.profile_icon_id ?? player.icon_id;
        const roleConfig = GAME_CONFIG.roles[player.role] || { color: "gray" };

        const rankRowBorderHoverClass = getBorderHoverClass(teamTheme.accent);
        const rankTextColorClass = `text-${teamTheme.accent}-400`;
        const roleTextColorClass = `text-${roleConfig.color}-400`;


        return (
          <motion.div
            key={player.player_id}
            variants={itemVariants}
            className={`grid grid-cols-12 gap-4 items-center p-4
                         bg-gray-800/40 rounded-xl border border-gray-700/60
                         ${rankRowBorderHoverClass} hover:bg-gray-800/60
                         transition-all duration-300 group`}
            whileHover={{ x: 4 }}
          >
            {/* Rank */}
            <div className="col-span-1 text-center">
              <span className={`font-bold ${rankTextColorClass} text-lg`}>
                {index + 1}
              </span>
            </div>

            {/* Avatar */}
            <div className="col-span-1 flex justify-center">
              {iconId ? (
                <img
                  src={getPlayerIconUrl(iconId)}
                  alt={`${player.display_name} avatar`}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-600
                             group-hover:border-gray-400 transition-colors"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center
                                justify-center text-sm border-2 border-gray-600 font-bold text-white">
                  {GAME_CONFIG.roles[player.role]?.icon || "?"}
                </div>
              )}
            </div>

            {/* Player Name */}
            <span className="col-span-2 truncate text-white font-medium group-hover:text-gray-100">
              {player.display_name}
            </span>

            {/* Tier */}
            <div className="col-span-1 flex justify-center">
              <img
                src={getTierImageUrl(tier)}
                alt={tier}
                className="w-8 h-8 transition-transform group-hover:scale-110"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextElementSibling) { // Check if nextSibling exists
                    e.target.nextElementSibling.style.display = 'block';
                  }
                }}
              />
              <span className="text-xs text-gray-300 hidden">{tier}</span>
            </div>

            {/* Division */}
            <span className="col-span-1 text-center text-gray-300 font-medium">
              {player.division || "—"}
            </span>

            {/* LP */}
            <span className="col-span-1 text-yellow-400 font-semibold text-center">
              {player.lp ?? 0}
            </span>

            {/* W/L Record */}
            <div className="col-span-2 text-center text-sm flex items-center justify-center gap-1">
              <span className="text-green-400 font-semibold">{stats.wins}W</span>
              <span className="text-gray-500">/</span>
              <span className="text-red-400 font-semibold">{stats.losses}L</span>
            </div>

            {/* Win Rate */}
            <span className={`col-span-1 text-center font-semibold
                              ${stats.winRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.winRate}%
            </span>

            {/* Total Games */}
            <span className="col-span-1 text-center text-blue-400 font-medium">
              {stats.total}
            </span>

            {/* Role */}
            <div className="col-span-1 text-center">
              <span className={`text-xs ${roleTextColorClass} uppercase font-semibold`}>
                {player.role || "—"}
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

const MatchHistory = ({ matches, teamTheme }) => {
  if (!matches.length) {
    return (
      <motion.div
        className="py-20 text-center flex flex-col items-center gap-6
                   border border-dashed border-gray-700/60 rounded-2xl
                   bg-gray-800/20 backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Calendar className="w-16 h-16 text-gray-500" />
        <div>
          <p className="font-semibold text-lg text-gray-300 mb-2">No matches recorded</p>
          <p className="text-gray-500">Check back later for match history updates</p>
        </div>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 }
  };

  const matchRowBorderHoverClass = `hover:border-${teamTheme.accent}-500/40`;


  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-4"
    >
      {matches.map(match => (
        <motion.div
          key={match.id}
          variants={itemVariants}
          className={`bg-gradient-to-r ${THEME_CONFIG.gradients.card} backdrop-blur-sm
                       rounded-2xl border border-gray-700/60 p-6 shadow-lg
                       ${matchRowBorderHoverClass} hover:shadow-xl
                       transition-all duration-300`}
          whileHover={{ x: 4, scale: 1.01 }}
        >
          <div className="flex flex-wrap justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Date</p>
                <p className="text-white font-medium">
                  {new Date(match.match_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Opponent</p>
              <p className="text-white font-bold text-lg">{match.opponent}</p>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Result</p>
              <p className={`font-bold text-lg ${
                match.result.toLowerCase().includes('win')
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}>
                {match.result}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const Loading = ({ text = "Loading..." }) => (
  <div className="relative flex flex-col items-center justify-center gap-6
                   text-gray-300 bg-gradient-to-br from-gray-900 via-black to-black">
      
    <motion.div
      className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
    <motion.p
      className="text-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {text}
    </motion.p>
  </div>
);

/* ── 4 ▪ Main TeamDetail Component ────────────────────────── */
export default function TeamDetail() {
  const { slug } = useParams();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const teamTheme = useMemo(
    () => generateTeamTheme(data?.team?.name),
    [data?.team?.name]
  );

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [slug, activeTab]);

  useEffect(() => {
    let mounted = true;

    const fetchTeamData = async () => {
      try {
        setLoading(true);
        setError(null);

        /* NEW: use full URL with API_BASE_URL */
        const res = await fetch(`${API_BASE_URL}/api/teams/${slug}`);

        if (!res.ok) {
          const msg = await res.text();
          throw new Error(`HTTP ${res.status} – ${msg || res.statusText}`);
        }

        const json = await res.json();
        if (mounted) setData(json);
      } catch (e) {
        console.error("Failed to fetch team data:", e);
        if (mounted) setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTeamData();
    return () => { mounted = false; };
  }, [slug]);

  if (loading) return <Loading text="Summoning team data..." />;
  if (error)   return <Loading text={`Error: ${error.message}`} />;
  if (!data)   return <Loading text="Team not found." />;

  /* normalise data */
  const { team, season, roster = [], matches = [] } = data;
  const roleMap = {
    top: "Top", jgl: "Jungle", jungle: "Jungle",
    mid: "Mid", adc: "ADC", bot: "ADC",
    sup: "Support", support: "Support"
  };

  const rosterNorm = roster.map(r => ({ ...r, role: roleMap[r.role?.toLowerCase()] ?? r.role }));
  const starters = rosterNorm.filter(r => (r.status ?? "").toLowerCase() === "starter");
  const subs = rosterNorm.filter(r => (r.status ?? "").toLowerCase().startsWith("sub"));

  const orderedStarters = GAME_CONFIG.roleOrder
    .map(role => starters.find(p => p.role === role))
    .filter(Boolean);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: THEME_CONFIG.animations.stagger.container,
        delayChildren: THEME_CONFIG.animations.stagger.delay
      },
    },
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${THEME_CONFIG.gradients.primary} text-white`}>
      {/* UI UPGRADE: New Hero Header */}
      <motion.header
        className="
          relative w-full flex flex-col items-center justify-center
          bg-center bg-cover bg-no-repeat
          border-b border-red-500/30
        "
        style={{
          backgroundImage: "url('/assets/hero-bg.webp')",
          backgroundAttachment: "fixed",
          height: "100vh",
          minHeight: "600px"
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: THEME_CONFIG.animations.duration.hero }}
      >
        <div className={`absolute inset-0 bg-gradient-to-t ${THEME_CONFIG.gradients.hero}`} />
        <div className="relative max-w-7xl mx-auto flex flex-col items-center p-6 text-center">
          <Link to="/teams" className={`absolute top-0 -mt-12 md:-mt-14 left-0 flex items-center gap-2
                      text-${teamTheme.accent}-300 hover:text-${teamTheme.accent}-200 transition-colors
                      text-sm font-semibold bg-${teamTheme.accent}-800/30
                      hover:bg-${teamTheme.accent}-700/50 px-4 py-2 rounded-full shadow-lg`}>
            <ChevronLeft className="w-4 h-4" /> Back to All Teams
          </Link>
          <motion.div
            className={`w-28 h-28 mb-6 rounded-3xl bg-gradient-to-br ${teamTheme.gradient}
                        border-4 ${teamTheme.border} shadow-2xl flex items-center justify-center`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          >
            <Users className="w-16 h-16 text-white/80" />
          </motion.div>
          <motion.h1
            className="text-7xl md:text-8xl font-black tracking-tighter text-white uppercase drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {team.name}
          </motion.h1>
          <motion.p
            className="mt-4 text-xl text-gray-300 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Season {season}
          </motion.p>
        </div>
      </motion.header>

      {/* Tab bar */}
      <nav className="bg-black/70 backdrop-blur-lg sticky top-0 z-20 border-b border-gray-700/40 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-6 py-3 text-base font-semibold">
          {[
            ["overview", "Overview"],
            ["leaderboard", "Leaderboard"],
            ["matches", "Match History"]
          ].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-full transition-all relative
                          ${activeTab === key ? "text-white" : "text-gray-400 hover:text-white"}`}>
              {activeTab === key && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className={`absolute inset-0 bg-gradient-to-r from-${teamTheme.accent}-600 to-${teamTheme.accent}-700 rounded-full shadow-lg`}
                  transition={THEME_CONFIG.animations.spring}
                />
              )}
              <span className="relative z-10">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: THEME_CONFIG.animations.duration.normal }}
            className="space-y-24"
          >
            {activeTab === "overview" && (
              <>
                <section>
                  <h2 className="text-4xl font-bold text-center tracking-wide mb-12
                                 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    MAIN ROSTER
                  </h2>
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    {orderedStarters.length > 0 ? (
                      orderedStarters.map(p => (
                        <PlayerCard key={p.player_id} player={p}
                          isStarter
                          teamTheme={teamTheme} /> 
                      ))
                    ) : (
                      <div className="col-span-full text-center text-gray-500 py-10">
                        No starters found for this team.
                      </div>
                    )}
                  </motion.div>
                </section>

                <section>
                  <h2 className="text-4xl font-bold text-center tracking-wide mb-12
                                 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    TEAM PERFORMANCE
                  </h2>
                  <DynamicStatsGrid players={starters} teamTheme={teamTheme} />
                </section>

                {subs.length > 0 && (
                  <section>
                    <h2 className="text-4xl font-bold text-center tracking-wide mb-12
                                   bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      SUBSTITUTES
                    </h2>
                    <motion.div
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8"
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                    >
                      {subs.map(p => (
                        <PlayerCard key={p.player_id} player={p}
                          isStarter={false}
                          teamTheme={teamTheme} /> 
                      ))}
                    </motion.div>
                  </section>
                )}
              </>
            )}

            {activeTab === "leaderboard" && (
              <section>
                <h2 className="text-4xl font-bold text-center tracking-wide mb-12
                               bg-gradient-to-r from-yellow-400 to-orange-500
                               bg-clip-text text-transparent">
                  PLAYER LEADERBOARD
                </h2>
                <EnhancedPlayerRankings players={rosterNorm} teamTheme={teamTheme} />
              </section>
            )}

            {activeTab === "matches" && (
              <section>
                <h2 className="text-4xl font-bold text-center tracking-wide mb-12
                               bg-gradient-to-r from-cyan-400 to-blue-600
                               bg-clip-text text-transparent">
                  RECENT MATCHES
                </h2>
                <MatchHistory matches={matches} teamTheme={teamTheme} />
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}