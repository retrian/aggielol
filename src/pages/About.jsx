// src/pages/About.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Target, Calendar, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const achievements = [
  { year: "2013", title: "Collegiate Starleague", placement: "2nd Place" },
  { year: "2015", title: "NACC Championship",     placement: "3rd-4th" },
  { year: "2016", title: "CLOL South Conference Playoffs", placement: "2nd Place" },
  { year: "2017", title: "CLOL South Conference Playoffs", placement: "1st Place" },
  { year: "2017", title: "CLOL Championship",     placement: "5th-8th" },
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
          className="relative z-10 text-center px-6 max-w-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-tight tracking-tight">
            ABOUT US <br className="hidden sm:block" />
            
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-white/80">
            A decade of collegiate esports excellence &amp; community building
          </p>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-8 h-8 sm:w-10 sm:h-10 text-white/80" />
        </motion.div>
      </section>

      {/* ----------------------------------------------------------- OUR LEGACY */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-[#500000] mb-6">Our Legacy</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Founded in 2012, Texas&nbsp;A&amp;M Esports unites Aggies passionate about League of Legends.
            Every year, new players join our club and accomplish great things—in and out of the Rift.
            From academic connections to teamwork and personal growth, we push Aggies to be better
            teammates, competitors, and leaders.
          </p>
        </div>
      </section>

      {/* ----------------------------------------------------------- ACHIEVEMENTS */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative mb-12 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <h2 className="relative inline-block bg-white px-8 text-3xl md:text-4xl font-bold text-[#500000]">
              Championship History
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((a) => (
              <Card
                key={a.year + a.title}
                className="transform hover:scale-105 transition-all duration-300"
              >
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold text-[#500000]">
                    {a.year}
                  </CardTitle>
                  <p className="mt-2 text-gray-800 font-medium">{a.title}</p>
                </CardHeader>
                <CardContent className="text-center">
                  <span className="text-xl font-semibold text-[#500000]">
                    {a.placement}
                  </span>
                  {a.placement === "Top 8*" && (
                    <p className="text-xs text-gray-500 mt-1">
                      *Cancelled&nbsp;due&nbsp;to&nbsp;COVID
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- STATS */}
      <section className="py-16 bg-gradient-to-r from-[#500000] to-[#500000] text-white">
        <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-3 gap-8 px-6 text-center">
          <div>
            <span className="text-5xl font-bold">2012</span>
            <p className="mt-2">Founded</p>
          </div>
          <div>
            <span className="text-5xl font-bold">150K+</span>
            <p className="mt-2">Total&nbsp;Prize&nbsp;Earned</p>
          </div>
          <div>
            <span className="text-5xl font-bold">100+</span>
            <p className="mt-2">Alumni</p>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- VALUES + CTA */}
      <section className="py-16 bg-gray-100">
        <div className="mx-auto max-w-5xl px-6 space-y-12">
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
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
            <h2 className="text-3xl font-bold text-[#500000] mb-4">
              Ready to Join the Legacy?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button
                className="bg-[#500000] hover:bg-[#400000] text-white"
                size="lg"
                asChild
              >
                <a
                  href="https://discord.com/invite/tamuesports"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Discord
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-[#500000] text-[#500000]"
                asChild
              >
                <Link to="/teams">View Teams</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
