// src/pages/Players.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Users, Calendar } from "lucide-react";
import PlayerCard from "@/components/PlayerCard";

/* ---------------- helper to flatten one API row -------------------- */
function flattenPlayerRow(row) {
  if (row.player && row.accounts) {
    const acct = row.accounts[row.player.id % row.accounts.length];
    const team = row.stints?.[0]?.team_name ?? "Unassigned";
    return {
      id: row.player.id,
      display_name: row.player.display_name,
      team_name: team,
      iconId: acct.profile_icon_id,
    };
  }
  return row;
}

export default function Players() {
  /* ---------------- state ------------------------------------------ */
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [roster, setRoster] = useState([]);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [loadingTotals, setLoadingTotals] = useState(true);
  const [error, setError] = useState(null);

  const [totalPlayers, setTotalPlayers] = useState(0);
  const [totalTeams, setTotalTeams] = useState(0);

  const teamOrder = ["Maroon", "White", "Black", "Gray"];

  /* ---------------- colour helper ---------------------------------- */
  const teamColors = {
    Maroon: "bg-red-900 text-white border-red-800",
    White:
      "bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600",
    Black: "bg-gray-900 text-white border-gray-700",
    Gray: "bg-gray-600 text-white border-gray-500",
    Unassigned:
      "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-700",
  };

  /* ==================================================================
     1.  Fetch list of seasons
  ================================================================== */
  useEffect(() => {
    fetch("/api/school_years")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((rows) => {
        const yrNames = rows
          .map((row) => row.name)
          .sort((a, b) => b.localeCompare(a)); // newest first
        setYears(yrNames);
        if (yrNames.length) setSelectedYear(yrNames[0]);
        calculateTotals(yrNames);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load seasons.");
      });
  }, []);

  /* ---------------- helper: fetch every season, dedupe ------------- */
  function calculateTotals(yearList) {
    if (!yearList.length) {
      setLoadingTotals(false);
      return;
    }
    setLoadingTotals(true);

    Promise.all(
      yearList.map((yr) =>
        fetch(`/api/players?year=${encodeURIComponent(yr)}`)
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => [])
      )
    )
      .then((allSeasons) => {
        const idSet = new Set();
        const teamSet = new Set();
        allSeasons.flat().forEach((row) => {
          const p = flattenPlayerRow(row);
          idSet.add(p.id);
          teamSet.add(p.team_name ?? "Unassigned");
        });
        setTotalPlayers(idSet.size);
        setTotalTeams(teamSet.size);
      })
      .finally(() => setLoadingTotals(false));
  }

  /* ==================================================================
     2.  Fetch roster for selected season
  ================================================================== */
  useEffect(() => {
    if (!selectedYear) return;
    setLoadingRoster(true);
    setError(null);

    fetch(`/api/players?year=${encodeURIComponent(selectedYear)}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((rows) => {
        const unique = rows
          .map(flattenPlayerRow)
          .filter(
            (p, i, self) => i === self.findIndex((q) => q.id === p.id)
          );
        setRoster(unique);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to load roster");
      })
      .finally(() => setLoadingRoster(false));
  }, [selectedYear]);

  /* ---------------- group roster by team --------------------------- */
  const rosterByTeam = roster.reduce((acc, p) => {
    (acc[p.team_name || "Unassigned"] ||= []).push(p);
    return acc;
  }, {});
  const teamCount = Object.keys(rosterByTeam).length;

  /* scroll to top on mount */
  useEffect(() => window.scrollTo(0, 0), []);

  /* ==================================================================
     RENDER
  ================================================================== */
  return (
    <main>
      {/* ----------------------------------------------------------- HERO */}
      <section
        className="
          relative flex flex-col items-center justify-center
          bg-center bg-cover bg-no-repeat
        "
        style={{
          backgroundImage: "url('/assets/hero-bg.webp')",
          backgroundAttachment: "fixed",
          height: "125vh",
        }}
      >
        <div className="absolute inset-0 bg-[#500000]/90" />

        <motion.div
          className="relative z-10 text-center px-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tight leading-tight">
            PLAYERS
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            Meet our competitive rosters for every year
          </p>

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {loadingTotals ? "—" : totalPlayers}
              </div>
              <div className="text-sm text-white/70 uppercase tracking-wider">
                Total Players
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {years.length}
              </div>
              <div className="text-sm text-white/70 uppercase tracking-wider">
                Seasons
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {loadingTotals ? "—" : totalTeams}
              </div>
              <div className="text-sm text-white/70 uppercase tracking-wider">
                Teams
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-8 h-8 sm:w-10 sm:h-10 text-white/80" />
        </motion.div>
      </section>

      {/* ---------------------------------------------------- Season / Year picker */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <Calendar className="w-8 h-8 text-[#500000] dark:text-[#b75b5b]" />
              <h2 className="text-4xl font-bold text-[#500000] dark:text-white">
                Select Season
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Browse through different competitive seasons
            </p>
          </motion.div>

          <motion.div
            className="relative max-w-sm mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative group">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="
                  w-full appearance-none
                  bg-white dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  border-2 border-gray-200 dark:border-gray-600
                  rounded-xl px-6 py-4 text-lg font-semibold
                  shadow-sm transition-all duration-300
                  hover:border-[#500000] dark:hover:border-[#b75b5b]
                  focus:outline-none focus:ring-4
                  focus:ring-[#500000]/10 dark:focus:ring-[#b75b5b]/20
                  cursor-pointer
                "
              >
                {years.map((yr, idx) => (
                  <option
                    key={yr}
                    value={yr}
                    className="
                      bg-white dark:bg-gray-800
                      text-gray-900 dark:text-gray-100
                    "
                  >
                    {yr} {idx === 0 ? "(Current Season)" : ""}
                  </option>
                ))}
              </select>

              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <ChevronDown
                  className="
                    w-5 h-5 text-gray-500 dark:text-gray-400
                    group-hover:text-[#500000] dark:group-hover:text-[#b75b5b]
                    transition-colors duration-200
                  "
                />
              </div>
            </div>

            <div
              className="
                absolute -bottom-2 left-1/2 -translate-x-1/2
                w-12 h-1 rounded-full
                bg-[#500000] dark:bg-[#b75b5b]
                opacity-20
              "
            />
          </motion.div>

          {error === "Could not load seasons." && (
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div
                className="
                  inline-flex items-center gap-2 px-4 py-2
                  bg-red-50 dark:bg-red-900/20
                  text-red-700 dark:text-red-400
                  rounded-lg text-sm
                "
              >
                <span>⚠️</span>
                <span>Unable to load available seasons</span>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ----------------------------------------------------------- Players list */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          {loadingRoster && (
            <motion.div
              className="text-center py-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#500000]/20 dark:border-[#b75b5b]/20 border-t-[#500000] dark:border-t-[#b75b5b] mx-auto" />
                <div className="absolute inset-0 rounded-full bg-[#500000]/5 dark:bg-[#b75b5b]/10" />
              </div>
              <p className="mt-6 text-gray-600 dark:text-gray-300 font-medium">
                Loading {selectedYear} roster...
              </p>
            </motion.div>
          )}

          {!loadingRoster && error && (
            <motion.div
              className="text-center py-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Failed to Load Roster
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We couldn't load the roster for {selectedYear}
                </p>
                <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm inline-block">
                  {error}
                </div>
              </div>
            </motion.div>
          )}

          {!loadingRoster && !error && roster.length === 0 && (
            <motion.div
              className="text-center py-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Users className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  No Players Found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  We don't have roster data for <strong>{selectedYear}</strong> yet.
                  <br />
                  Try selecting a different season or check back later.
                </p>
              </div>
            </motion.div>
          )}

          {!loadingRoster && !error && roster.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-5xl font-bold text-[#500000] dark:text-white mb-3">
                    {selectedYear}
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                    <Users className="w-5 h-5" />
                    <span className="text-lg">
                      {roster.length} Players • {teamCount} Teams
                    </span>
                  </div>
                  <div className="w-24 h-1 bg-[#500000] dark:bg-[#b75b5b] mx-auto mt-4 rounded-full" />
                </motion.div>
              </div>

              <div className="space-y-16">
                {teamOrder.map((team) => {
                  const players = rosterByTeam[team];
                  if (!players?.length) return null;
                  return (
                    <motion.div
                      key={team}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      {/* team header */}
                      <div className="flex items-center gap-4 mb-8">
                        <div
                          className={`px-6 py-3 rounded-xl border-2 ${
                            teamColors[team] || teamColors.Unassigned
                          }`}
                        >
                          <h3 className="text-2xl font-bold">{team}</h3>
                        </div>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {players.length} players
                        </div>
                      </div>

                      {/* players grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {players.map((p, idx) => (
                          <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: idx * 0.05,
                            }}
                            viewport={{ once: true }}
                          >
                            <PlayerCard name={p.display_name} iconId={p.iconId} />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}

                {/* ad-hoc teams not in teamOrder */}
                {Object.keys(rosterByTeam)
                  .filter((t) => !teamOrder.includes(t))
                  .map((t) => (
                    <motion.div
                      key={t}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex items-center gap-4 mb-8">
                        <div
                          className={`px-6 py-3 rounded-xl border-2 ${
                            teamColors[t] || teamColors.Unassigned
                          }`}
                        >
                          <h3 className="text-2xl font-bold">{t}</h3>
                        </div>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {rosterByTeam[t].length} players
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {rosterByTeam[t].map((p, idx) => (
                          <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: idx * 0.05,
                            }}
                            viewport={{ once: true }}
                          >
                            <PlayerCard name={p.display_name} iconId={p.iconId} />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
