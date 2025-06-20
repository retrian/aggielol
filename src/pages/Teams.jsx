// src/pages/Teams.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const teams = [
  { name: "Maroon",     color: "#500000", href: "/teams/1", desc: "" },
  { name: "Team White", color: "#FFFFFF", href: "/teams/2", desc: "Diamond to Master level roster." },
  { name: "Team Black", color: "#000000", href: "/teams/3", desc: "Emerald to Diamond level roster." },
  { name: "Team Gray",  color: "#A0A0A0", href: "/teams/4", desc: "Emerald level roster." },
];

export default function Teams() {
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <main className="min-h-screen">
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
        {/* maroon overlay */}
        <div className="absolute inset-0 bg-[#500000]/90" />

        {/* headline / sub-copy */}
        <motion.div
          className="relative z-10 text-center px-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tight leading-tight">
            OUR&nbsp;TEAMS
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            Competitive rosters representing Texas&nbsp;A&amp;M at every skill level
          </p>
        </motion.div>

        {/* bouncing chevron */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-8 h-8 sm:w-10 sm:h-10 text-white/80" />
        </motion.div>
      </section>

      {/* --------------------------------------------------- VARSITY SPOTLIGHT */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* left copy */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Team&nbsp;Maroon
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-lg">
                  Our premier varsity roster, competing at the highest level.
                  Masters+ level team representing Texas&nbsp;A&amp;M.
                </p>
                <Link
                  to="/teams/1"
                  className="inline-flex items-center gap-2 bg-[#500000] text-white font-semibold px-8 py-4 rounded-lg hover:bg-[#600000] transition-colors shadow-lg hover:shadow-xl"
                >
                  View Roster →
                </Link>
              </div>

              {/* right visual */}
              <div className="flex-shrink-0">
                <div className="w-56 h-56 bg-gradient-to-br from-[#500000] to-[#700000] rounded-2xl shadow-xl" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------ DEV TEAMS GRID */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          {/* header */}
          <div className="text-center mb-20">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-gray-900 px-8 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Development Teams
                </span>
              </div>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Structured progression teams designed to develop players at every skill level
            </p>
          </div>

          {/* grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {teams
              .filter((t) => t.name !== "Maroon")
              .map((team, idx) => (
                <motion.div
                  key={team.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-center mb-8">
                    <div
                      className="w-24 h-24 rounded-full border-4 shadow-lg"
                      style={{
                        backgroundColor: team.color,
                        borderColor: team.color === "#FFFFFF" ? "#e5e5e5" : team.color,
                      }}
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
                    {team.name}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-center mb-10 min-h-[48px] leading-relaxed">
                    {team.desc}
                  </p>

                  <div className="text-center">
                    <Link
                      to={team.href}
                      className="inline-flex items-center gap-2 text-[#500000] dark:text-[#ffaaaa] font-semibold hover:text-[#600000] dark:hover:text-[#ffbbbb] transition-colors text-lg"
                    >
                      View Roster
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </Link>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
