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
    <main>
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center bg-fixed bg-center bg-cover"
        style={{ backgroundImage: "url('/assets/teams-hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-[#500000]/90" />
        <motion.div
          className="relative z-10 text-center px-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight">
            OUR TEAMS
          </h1>
          <p className="mt-4 text-xl text-white">
            Meet every Aggie roster, from our varsity to our development teams.
          </p>
        </motion.div>
        <motion.div
          className="absolute bottom-20"
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-10 h-10 text-white" />
        </motion.div>
      </section>

      {/* Varsity Spotlight */}
      <section className="py-24 bg-white">
        <motion.div
          className="max-w-6xl mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-[#500000] to-[#7f0000] rounded-3xl p-16 shadow-2xl text-white flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 z-10">
              <h2 className="text-6xl md:text-7xl font-black mb-4">Varsity Team</h2>
              <p className="text-xl mb-6">
                Our premier maroon roster, competing at the highest level. Masters+ level team.
              </p>
              <Link
                to="/teams/varsity"
                className="inline-block bg-white text-[#500000] font-bold text-lg py-4 px-10 rounded-2xl hover:bg-gray-100 transition"
              >
                View Varsity →
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Development Squads */}
      <section className="py-20 bg-white">
        <motion.div
          className="max-w-7xl mx-auto px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-[#500000]">
            Other Rosters
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teams
              .filter((team) => team.name !== "Varsity")
              .map((team, idx) => (
                <motion.div
                  key={team.name}
                  className="bg-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-0"
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex justify-center mb-4">
                    <div
                      className="w-16 h-16 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: team.color }}
                    />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
                    {team.name}
                  </h3>
                  <p className="text-gray-600 text-center mb-6">{team.desc}</p>
                  <div className="text-center">
                    <Link to={team.href} className="inline-block text-[#500000] font-medium">
                      View Roster →
                    </Link>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </section>

      {/* Apply Now Section */}
      <section className="py-20 bg-[#500000]">
        <motion.div
          className="max-w-4xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Interested in joining?
          </h2>
          <p className="text-lg text-gray-200 mb-8">
            Apply here when applications are opened (see Discord for tryout announcements) !
          </p>
          <Link
            to="/apply"
            className="bg-white text-[#500000] font-bold text-lg py-4 px-10 rounded-2xl hover:bg-gray-100 transition">
            Apply Now →
          </Link>
        </motion.div>
      </section>
    </main>
  );
}