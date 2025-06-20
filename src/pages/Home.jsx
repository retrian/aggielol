// src/pages/Home.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users,
  Trophy,
  CalendarClock,
  PlayCircle,
  TrendingUp,
  Info,
} from "lucide-react";



/* ------------------------------------------------------------------ */
/* tweak this if you ever resize the navbar padding / font            */
const NAVBAR_H = 72; // px
/* ------------------------------------------------------------------ */

const features = [
  { icon: Users,          title: "Teams",       desc: "Meet our competitive rosters for every year.", href: "/teams"        },
  { icon: Trophy,         title: "Leaderboard", desc: "Track player ranks in real time.",            href: "/leaderboard"  },
  { icon: CalendarClock,  title: "Schedule",    desc: "Never miss a scrim, match, or IRL event.",    href: "/schedule"     },
  { icon: PlayCircle,     title: "Watch Live",  desc: "Catch our streams & VODs here.",              href: "/streams"      },
  { icon: TrendingUp,     title: "Predictions", desc: "Bet AMEpoints on match outcomes.",            href: "/predictions"  },
  { icon: Info,           title: "About Us",    desc: "Who we are and what we do.",                  href: "/about"      },
];

const stats = [
  { value: "4",    label: "Teams" },
  { value: "30K+", label: "Soloqueue Matches" },
  { value: "100+", label: "Total Members" },
];

export default function Home() {
  useEffect(() => window.scrollTo(0, 0), []);

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
          backgroundAttachment: 'fixed',
          height: '125vh',
        }}
      >
        <div className="absolute inset-0 bg-[#500000]/90" />

        <motion.div
          className="relative z-10 text-center px-6 max-w-9xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tight leading-tight">
            TEXAS A&amp;M LEAGUE OF LEGENDS
          </h1>
          
          <p className="mt-4 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            The ultimate university League of Legends page.
          </p>

          <div className="mt-8 flex justify-center gap-4 sm:gap-6 flex-wrap">
            <Button className="bg-black text-white font-bold hover:bg-[#400000] transition-colors" size="lg">
              <Link to="/teams" className="block w-full h-full">Get Started</Link>
            </Button>
            <Button className="bg-black text-white font-bold hover:bg-[#400000] transition-colors" size="lg">
              <a href="https://discord.gg/aggielol" target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                Join Discord
              </a>
            </Button>
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

      {/* -------------------------------------------------------- FEATURES */}
      <section className="py-20 bg-white">
        <motion.div
          className="max-w-7xl mx-auto px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-[#500000]">
            Discover What We Offer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <motion.div
                key={f.title}
                className="bg-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300"
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <f.icon className="w-12 h-12 text-[#500000] mb-4" />
                <h3 className="text-2xl font-semibold mb-2 text-gray-900">
                  {f.title}
                </h3>
                <p className="text-gray-600 mb-4">{f.desc}</p>
                {f.href && (
                  <Link to={f.href} className="inline-block text-[#500000] font-medium hover:text-[#400000] transition-colors">
                    Learn More →
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ----------------------------------------------------------- STATS */}
      <section className="py-20 bg-gradient-to-r from-[#500000] to-[#7f0000]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-white px-6">
          {stats.map((s) => (
            <div key={s.label}>
              <span className="text-4xl sm:text-5xl font-bold block">{s.value}</span>
              <p className="mt-2 text-base sm:text-lg">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ ABOUT */}
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
            <h2 className="text-4xl font-bold mb-4 text-[#500000]">
              Built by Retri
            </h2>
            <p className="mb-6 text-gray-700">
              A centralized hub for TAMU League of Legends stats, fostering deeper
              engagement between players, the org, and our community. Track teams,
              schedule events, and predict outcomes—all in one place.
            </p>
            <Button className="bg-[#500000] text-white font-semibold hover:bg-[#400000] transition-colors" size="lg">
              <Link to="/about" className="block w-full h-full">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}