import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Target, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const achievements = [
  { year: "2013", title: "Collegiate Starleague", placement: "2nd Place" },
  { year: "2015", title: "NACC Championship", placement: "3rd-4th" },
  { year: "2016", title: "CLOL South Conference Playoffs", placement: "2nd Place" },
  { year: "2017", title: "CLOL South Conference Playoffs", placement: "1st Place" },
  { year: "2017", title: "CLOL Championship", placement: "5th-8th" },
  { year: "2018", title: "CLOL South Conference Playoffs", placement: "3rd-4th" },
  { year: "2019", title: "CLOL South Conference Playoffs", placement: "5th-8th" },
  { year: "2020", title: "CLOL South Conference Playoffs", placement: "Top 8*" },
  { year: "2022", title: "CLOL South Conference", placement: "18th" },
  { year: "2023", title: "CLOL South Conference Playoffs", placement: "9th-16th" },
  { year: "2024", title: "CLOL South Conference Playoffs", placement: "9th-16th" },
];

const milestones = [
  {
    icon: Trophy,
    title: "Championship Legacy",
    desc: "South Conference Champions 2017 with multiple playoff appearances and national tournament success spanning over a decade.",
  },
  {
    icon: Calendar,
    title: "Founded in 2012",
    desc: "Texas A&M Esports was established in 2012, making us one of the pioneering collegiate esports programs.",
  },
  {
    icon: Users,
    title: "Alumni Network",
    desc: "100+ members and alumni who've competed at the highest collegiate level across multiple seasons.",
  },
  {
    icon: Target,
    title: "Competitive Excellence",
    desc: "Consistent playoff appearances and top finishes with 30K+ tracked solo queue games demonstrating our commitment to improvement.",
  },
];

const values = [
  {
    title: "Excellence",
    desc: "We foster a culture of constant improvement, both in and out of game.",
  },
  {
    title: "Service",
    desc: "Giving back through mentorship, hosting campus events, and supporting new players. We're building the next generation of Aggie champions.",
  },
  {
    title: "Inclusivity",
    desc: "Whether Emerald or Challenger, there's a place here for every Aggie.",
  },
];

export default function About() {
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <main className="space-y-24">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-[url('/assets/hero-bg.webp')] bg-cover bg-center">
        <div className="absolute inset-0 bg-[#500000]/90" />
        <motion.div
          className="relative z-10 text-center px-4 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl md:text-7xl font-black text-white leading-tight">
            About Texas A&amp;M
            <br /> League of Legends
          </h1>
          <p className="mt-4 text-xl text-white/80">
            A decade of collegiate esports excellence & community building
          </p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-[#500000] mb-6">Our Legacy</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Founded in 2012, Texas A&amp;M Esports unites Aggies passionate about League of Legends—from championship contenders to casual Clash squads.
          </p>
          <span className="mt-8 inline-block bg-[#500000] text-white px-8 py-3 rounded-full font-semibold">
            Competition · Community · Growth
          </span>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-4xl font-bold text-[#500000] mb-8 text-center">Championship History</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((a, i) => (
              <Card
                key={i}
                className="transform hover:scale-105 transition-all duration-300"
              >
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold text-[#500000]">{a.year}</CardTitle>
                  <p className="mt-2 text-gray-800 font-medium">{a.title}</p>
                </CardHeader>
                <CardContent className="text-center">
                  <span className="text-xl font-semibold text-[#500000]">{a.placement}</span>
                  {a.placement === "Top 8*" && (
                    <p className="text-xs text-gray-500 mt-1">*Cancelled due to COVID</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-4xl font-bold text-[#500000] mb-12 text-center">Key Milestones</h2>
          <div className="flex flex-col lg:flex-row gap-8">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <m.icon className="w-10 h-10 text-[#500000] mb-4" />
                <h3 className="text-2xl font-semibold mb-2">{m.title}</h3>
                <p className="text-gray-700 leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-[#500000] to-[#7f0000] text-white">
        <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-8 px-6 text-center">
          <div>
            <span className="text-5xl font-bold">2012</span>
            <p className="mt-2">Founded</p>
          </div>
          <div>
            <span className="text-5xl font-bold">4</span>
            <p className="mt-2">Active Teams</p>
          </div>
          <div>
            <span className="text-5xl font-bold">30K+</span>
            <p className="mt-2">Solo-queue Games</p>
          </div>
          <div>
            <span className="text-5xl font-bold">100+</span>
            <p className="mt-2">Alumni</p>
          </div>
        </div>
      </section>

      {/* Values & Call to Action Section */}
      <section className="py-16 bg-gray-100">
        <div className="mx-auto max-w-5xl px-6 space-y-12">
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <h3 className="text-2xl font-semibold text-[#500000] mb-4">{v.title}</h3>
                <p className="text-gray-700 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#500000] mb-4">Ready to Join the Legacy?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button className="bg-[#500000] hover:bg-[#400000] text-white" size="lg">
                <a href="https://discord.gg/aggielol" target="_blank" rel="noopener noreferrer">
                  Join Discord
                </a>
              </Button>
              <Button variant="outline" size="lg" className="border-[#500000] text-[#500000]">
                <Link to="/teams">View Teams</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
