// src/pages/Teams.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const teams = [
  { name: "Varsity", color: "#500000", href: "/teams/varsity", desc: "" },
  { name: "Team White", color: "#FFFFFF", href: "/teams/white", desc: "Diamond to Master level roster." },
  { name: "Team Black", color: "#000000", href: "/teams/black", desc: "Emerald to Diamond level roster." },
  { name: "Team Gray", color: "#A0A0A0", href: "/teams/gray", desc: "Emerald level roster." },
];

export default function Teams() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-[#500000] to-[#700000]">
        <div className="text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              OUR TEAMS
            </h1>
          </motion.div>
        </div>
        
        {/* Simple scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <ChevronDown className="w-8 h-8 text-white opacity-60" />
        </div>
      </section>

      {/* Varsity Spotlight */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100"
          >
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Left content */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Team Maroon
                </h2>
                <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
                  Our premier varsity roster, competing at the highest level. 
                  Masters+ level team representing Texas A&M.
                </p>
                <Link
                  to="/teams/varsity"
                  className="inline-flex items-center gap-2 bg-[#500000] text-white font-semibold px-8 py-4 rounded-lg hover:bg-[#600000] transition-colors shadow-lg hover:shadow-xl"
                >
                  View Roster →
                </Link>
              </div>
              
              {/* Right visual */}
              <div className="flex-shrink-0">
                <div className="w-56 h-56 bg-gradient-to-br from-[#500000] to-[#700000] rounded-2xl shadow-xl">
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Development Teams */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-35">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-8 text-3xl md:text-4xl font-bold text-gray-900">
                  Development Teams
                </span>
              </div>
            </div>
            <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
              Structured progression teams designed to develop players at every skill level
            </p>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {teams
              .filter((team) => team.name !== "Varsity")
              .map((team, idx) => (
                <motion.div
                  key={team.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 p-10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Team color indicator */}
                  <div className="flex items-center justify-center mb-8">
                    <div
                      className="w-24 h-24 rounded-full border-4 shadow-lg"
                      style={{ 
                        backgroundColor: team.color,
                        borderColor: team.color === '#FFFFFF' ? '#e5e5e5' : team.color
                      }}
                    >
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                    {team.name}
                  </h3>
                  
                  <p className="text-gray-600 text-center mb-10 min-h-[48px] leading-relaxed">
                    {team.desc}
                  </p>

                  <div className="text-center">
                    <Link
                      to={team.href}
                      className="inline-flex items-center gap-2 text-[#500000] font-semibold hover:text-[#600000] transition-colors text-lg"
                    >
                      View Roster
                      <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
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