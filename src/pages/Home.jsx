// src/pages/Home.jsx
import React, { useEffect, memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users,
  Trophy,
  CalendarClock,
  PlayCircle,
  TrendingUp,
  Info,
  ChevronDown,
} from "lucide-react";

// ----------------------------------------------- data kept outside component
const features = [
  { icon: Users, title: "Teams", desc: "Meet our competitive rosters for every year.", href: "/teams" },
  { icon: Trophy, title: "Leaderboard", desc: "Track player ranks in real time.", href: "/leaderboard" },
  { icon: CalendarClock, title: "Schedule", desc: "Never miss a scrim, match, or IRL event.", href: "/schedule" },
  { icon: PlayCircle, title: "Watch Live", desc: "Catch our streams & VODs here.", href: "/streams" },
  { icon: TrendingUp, title: "Predictions", desc: "Bet AMEpoints on match outcomes.", href: "/predictions" },
  { icon: Info, title: "About Us", desc: "Who we are and what we do.", href: "/about" },
];

const stats = [
  { value: "4", label: "Teams" },
  { value: "30K+", label: "Soloqueue Matches" },
  { value: "100+", label: "Total Members" },
];

// ----------------------------------------------- framer variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

// ----------------------------------------------- presentational components
const FeatureCard = memo(function FeatureCard({ f }) {
  return (
    <motion.div
      className="bg-gray-50 rounded-3xl p-8 shadow-lg transition-shadow duration-300 hover:shadow-2xl"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <f.icon className="w-12 h-12 text-[#500000] mb-4" aria-hidden="true" />
      <h3 className="text-2xl font-semibold mb-2 text-gray-900">{f.title}</h3>
      <p className="text-gray-600 mb-4">{f.desc}</p>
      {f.href && (
        <Link
          to={f.href}
          className="inline-block text-[#500000] font-medium hover:text-[#400000] transition-colors"
          aria-label={`Learn more about ${f.title}`}
        >
          Learn More →
        </Link>
      )}
    </motion.div>
  );
});

const Stat = memo(function Stat({ s }) {
  return (
    <div>
      <span className="text-4xl sm:text-5xl font-bold block">{s.value}</span>
      <p className="mt-2 text-base sm:text-lg">{s.label}</p>
    </div>
  );
});

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }, [prefersReducedMotion]);

  return (
    <main>
      {/* ----------------------------------------------------------- HERO */}
      <section
        aria-labelledby="home-hero-title"
        className="relative flex flex-col items-center justify-center bg-center bg-cover bg-no-repeat lg:bg-fixed min-h-[100svh]"
        style={{ backgroundImage: "url('/assets/hero-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-[#500000]/90" aria-hidden="true" />

        <motion.div
          className="relative z-10 text-center px-6 max-w-7xl mx-auto"
          variants={fadeUp}
          initial={prefersReducedMotion ? false : "hidden"}
          animate={prefersReducedMotion ? undefined : "show"}
        >
          <h1
            id="home-hero-title"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tight leading-tight"
          >
            TEXAS A&amp;M LEAGUE OF LEGENDS
          </h1>

          <p className="mt-4 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            The ultimate university League of Legends page.
          </p>

          <div className="mt-8 flex justify-center gap-4 sm:gap-6 flex-wrap">
            <Button className="bg-black text-white font-bold hover:bg-[#400000] transition-colors" size="lg" asChild>
              <Link to="/teams">Get Started</Link>
            </Button>
            <Button className="bg-black text-white font-bold hover:bg-[#400000] transition-colors" size="lg" asChild>
              <a href="https://discord.com/invite/tamuesports" target="_blank" rel="noopener noreferrer">Join Discord</a>
            </Button>
          </div>
        </motion.div>

        {!prefersReducedMotion && (
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            aria-hidden="true"
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown className="w-8 h-8 sm:w-10 sm:h-10 text-white/80" />
          </motion.div>
        )}
      </section>

      {/* -------------------------------------------------------- FEATURES */}
      <section aria-labelledby="features-title" className="py-20 bg-white">
        <motion.div
          className="max-w-7xl mx-auto px-6"
          variants={stagger}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "show"}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 id="features-title" className="text-4xl font-bold text-center mb-12 text-[#500000]">
            Discover What We Offer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <FeatureCard key={f.title} f={f} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* ----------------------------------------------------------- STATS */}
      <section aria-labelledby="stats-title" className="py-20 bg-[#500000]">
        <h2 id="stats-title" className="sr-only">Program Stats</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-white px-6">
          {stats.map((s) => (
            <Stat key={s.label} s={s} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ ABOUT */}
      <section aria-labelledby="about-teaser-title" className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 px-6">
          <motion.div
            className="w-full md:w-1/2"
            initial={prefersReducedMotion ? false : { scale: 0.96, opacity: 0 }}
            whileInView={prefersReducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <picture>
              {/* Prefer modern formats with fallback */}
              <source srcSet="/assets/roster.avif" type="image/avif" />
              <source srcSet="/assets/roster.webp" type="image/webp" />
              <img
                src="/assets/roster.png"
                alt="Team roster"
                className="rounded-3xl shadow-2xl object-cover w-full"
                loading="lazy"
                width="1200"
                height="800"
              />
            </picture>
          </motion.div>

          <div className="w-full md:w-1/2">
            <h2 id="about-teaser-title" className="text-4xl font-bold mb-4 text-[#500000]">Built by Retri</h2>
            <p className="mb-6 text-gray-700">
              A centralized hub for TAMU League of Legends stats, fostering deeper
              engagement between players, the org, and our community. Track teams,
              schedule events, and predict outcomes—all in one place.
            </p>
            <Button className="bg-[#500000] text-white font-semibold hover:bg-[#400000] transition-colors" size="lg" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
