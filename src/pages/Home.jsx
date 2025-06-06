// src/pages/Home.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Trophy, CalendarClock, PlayCircle, TrendingUp } from "lucide-react";

const features = [
  { icon: Users, title: "Teams", desc: "Meet our competitive rosters for every year.", href: "/teams" },
  { icon: Trophy, title: "Leaderboard", desc: "Track player ranks in real time.", href: "/leaderboard" },
  { icon: CalendarClock, title: "Schedule", desc: "Never miss a scrim, match, or IRL event.", href: "/schedule" },
  { icon: PlayCircle, title: "Watch Live", desc: "Catch our streams & VODs here.", href: "/streams" },
  { icon: TrendingUp, title: "Predictions", desc: "Bet AMEpoints on match outcomes.", href: "/predictions" },
];

const stats = [
  { value: "4", label: "Teams" },
  { value: "30K+", label: "Soloqueue Matches" },
  { value: "100+", label: "Total Members" },
];

export default function Home() {
  // Auto-scroll to top when component mounts
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
            TEXAS A&amp;M LEAGUE OF LEGENDS
          </h1>
          <p className="mt-4 text-xl text-white">The ultimate university league of legends page</p>
          <div className="mt-8 flex justify-center gap-6">
            <Button className="bg-black text-white font-bold hover:bg-[#400000]" size="lg">
              <Link to="/teams">Get Started</Link>
            </Button>
            <Button className="bg-black text-white font-bold hover:bg-[#400000]" size="lg">
              <a href="https://discord.gg/aggielol" target="_blank" rel="noopener noreferrer">
                Join Discord
              </a>
            </Button>
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

      {/* Features Section */}
      <section className="py-20 bg-white">
        <motion.div
          className="max-w-7xl mx-auto px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-[#500000]">Discover What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <motion.div
                key={f.title}
                className="bg-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-0"
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <f.icon className="w-12 h-12 text-[#500000] mb-4" />
                <h3 className="text-2xl font-semibold mb-2 text-gray-900">{f.title}</h3>
                <p className="text-gray-600 mb-4">{f.desc}</p>
                <Link to={f.href} className="inline-block text-[#500000] font-medium">
                  Learn More →
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-[#500000] to-[#7f0000]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-white">
          {stats.map((s) => (
            <div key={s.label}>
              <span className="text-5xl font-bold block">{s.value}</span>
              <p className="mt-2 text-lg">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 px-6">
          <motion.div
            className="w-full md:w-1/2"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src="/assets/roster.png"
              alt="Team roster"
              className="rounded-3xl shadow-2xl object-cover w-full"
            />
          </motion.div>
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl font-bold mb-4 text-[#500000]">Built by Retri</h2>
            <p className="mb-6 text-gray-700">
              A centralized hub for TAMU League of Legends stats, fostering deeper engagement
              between players, the org, and our community. Track teams, schedule events, and predict
              outcomes—all in one place.
            </p>
            <Button className="bg-[#500000] text-white font-semibold hover:bg-[#400000]" size="lg">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}