// src/pages/Players.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Users } from "lucide-react";
import PlayerCard from "@/components/PlayerCard";

export default function Players() {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [roster, setRoster] = useState([]);
  const [loadingRoster, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const teamOrder = ["Maroon", "White", "Black", "Gray"];

  useEffect(() => {
    fetch("/api/school_years")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const sortedNames = data
          .map((row) => row.name)
          .sort((a, b) => b.localeCompare(a));
        setYears(sortedNames);
        if (sortedNames.length > 0) {
          setSelectedYear(sortedNames[0]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch school_years:", err);
        setError("Could not load seasons.");
      });
  }, []);

  useEffect(() => {
    if (!selectedYear) return;

    setLoading(true);
    setError(null);

    fetch(`/api/players?year=${encodeURIComponent(selectedYear)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((dataArray) => {
        console.log("Fetched /api/players data:", dataArray);

        const processedRoster = dataArray.map((playerData) => {
          if (playerData.player && playerData.accounts) {
            const selectedAccount =
              playerData.accounts[playerData.player.id % playerData.accounts.length];

            const teamName =
              playerData.stints && playerData.stints.length > 0
                ? playerData.stints[0].team_name
                : "Unassigned";

            return {
              id: playerData.player.id,
              display_name: playerData.player.display_name,
              team_name: teamName,
              iconId: selectedAccount.profile_icon_id,
            };
          } else {
            return {
              id: playerData.id,
              display_name: playerData.display_name,
              team_name: playerData.team_name,
              iconId: playerData.iconId,
            };
          }
        });

        const uniqueRoster = processedRoster.filter(
          (player, index, self) =>
            index === self.findIndex(
              (p) => p.id === player.id && p.display_name === player.display_name
            )
        );

        setRoster(uniqueRoster);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to load roster");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedYear]);

  const rosterByTeam = roster.reduce((acc, player) => {
    const team = player.team_name || "Unassigned";
    if (!acc[team]) acc[team] = [];
    acc[team].push(player);
    return acc;
  }, {});

  const teamCount = Object.keys(rosterByTeam).length;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center bg-fixed bg-center bg-cover"
        style={{ backgroundImage: "url('/assets/hero-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-[#500000]/90" />
        <motion.div
          className="relative z-10 text-center px-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight">
            AGGIE ESPORTS PLAYERS
          </h1>
          <p className="mt-4 text-xl text-white">
            Meet our competitive rosters for every year
          </p>

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{roster.length}</div>
              <div className="text-sm text-white/70 uppercase tracking-wider">
                Active Players
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{years.length}</div>
              <div className="text-sm text-white/70 uppercase tracking-wider">
                Seasons
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{teamCount}</div>
              <div className="text-sm text-white/70 uppercase tracking-wider">
                Teams
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="absolute bottom-20"
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-10 h-10 text-white" />
        </motion.div>
      </section>

      {/* Year Selector Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 text-[#500000]">
            Choose Your Era
          </h2>
          <p className="text-gray-600 mb-12">
            Explore rosters from different competitive seasons
          </p>

          <div className="relative max-w-md mx-auto">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full appearance-none rounded-2xl border-2 border-gray-300 bg-white py-4 pl-6 pr-12 text-lg font-semibold text-gray-900 shadow-lg transition-all duration-300 hover:shadow-xl focus:border-[#500000] focus:outline-none focus:ring-4 focus:ring-[#500000]/20"
            >
              {years.map((yr, idx) => (
                <option key={yr} value={yr} className="font-semibold">
                  {yr} {idx === 0 ? "(Current)" : ""}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-500" />
          </div>

          {error === "Could not load seasons." && (
            <p className="mt-4 text-sm text-red-600">
              Failed to load available seasons.
            </p>
          )}
        </div>
      </section>

      {/* Players grouped by Team Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {loadingRoster && (
            <div className="text-center py-24">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#500000] border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-600">
                Loading roster for {selectedYear}…
              </p>
            </div>
          )}

          {!loadingRoster && error && (
            <div className="text-center py-24 text-red-600">
              <p>Sorry, failed to load roster for {selectedYear}.</p>
              <p>Error: {error}</p>
            </div>
          )}

          {!loadingRoster && !error && roster.length === 0 && (
            <div className="text-center py-24">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                No Players Found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We don't have any data for {selectedYear} yet. Check back soon or
                choose a different season.
              </p>
            </div>
          )}

          {!loadingRoster && !error && roster.length > 0 && (
            <>
              <h2 className="text-4xl font-bold text-center mb-8 text-[#500000]">
                {selectedYear} Roster
              </h2>

              {teamOrder.map((teamName) => {
                const playersForTeam = rosterByTeam[teamName];
                if (!playersForTeam || playersForTeam.length === 0) {
                  return null;
                }
                return (
                  <div key={teamName}>
                    <h3 className="text-3xl font-semibold mb-6">{teamName}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                      {playersForTeam.map((player) => (
                        <PlayerCard
                          key={player.id}
                          name={player.display_name}
                          iconId={player.iconId}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {Object.keys(rosterByTeam)
                .filter((teamName) => !teamOrder.includes(teamName))
                .map((teamName) => (
                  <div key={teamName}>
                    <h3 className="text-3xl font-semibold mb-6">{teamName}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {rosterByTeam[teamName].map((player) => (
                        <PlayerCard
                          key={player.id}
                          name={player.display_name}
                          iconId={player.iconId}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
