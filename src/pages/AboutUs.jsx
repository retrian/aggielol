import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Target, Calendar, Award } from "lucide-react";

export default function About() {
  // Scroll to top on mount
  useEffect(() => window.scrollTo(0, 0), []);

  const achievements = [
    { year: "2013", title: "Collegiate Starleague", placement: "2nd Place" },
    { year: "2015", title: "NACC Championship", placement: "3rd-4th" },
    { year: "2016", title: "CLOL South Conference Playoffs", placement: "2nd Place" },
    { year: "2017", title: "CLOL South Conference Playoffs", placement: "1st Place" },
    { year: "2017", title: "CLOL Championship", placement: "5th-8th" },
    { year: "2018", title: "CLOL South Conference Playoffs", placement: "3rd-4th" },
    { year: "2019", title: "CLOL South Conference Playoffs", placement: "5th-8th" },
    { year: "2020", title: "CLOL South Conference Playoffs", placement: "Top 8*" },
    { year: "2022", title: "CLOL South Conference", placement: "NQ" },
    { year: "2023", title: "CLOL South Conference Playoffs", placement: "9th-16th" },
    { year: "2024", title: "CLOL South Conference Playoffs", placement: "9th-16th" },
  ];

  const milestones = [
    { icon: Trophy, title: "Championship Legacy", desc: "South Conference Champions 2017 with multiple playoff appearances and national tournament success spanning over a decade." },
    { icon: Calendar, title: "Founded in 2012", desc: "Texas A&M Esports was established in 2012, making us one of the pioneering collegiate esports programs." },
    { icon: Users, title: "Alumni Network", desc: "100+ members and alumni who've competed at the highest collegiate level across multiple seasons." },
    { icon: Target, title: "Competitive Excellence", desc: "Consistent playoff appearances and top finishes with 30K+ tracked solo queue games demonstrating our commitment to improvement." }
  ];

  return (
    <main>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section
        className="relative h-96 flex items-center justify-center bg-center bg-cover"
        style={{ backgroundImage: "url('/assets/hero-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-[#500000]/80" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4">
            About Texas A&M League of Legends
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            A decade of competitive excellence and community building
          </p>
        </motion.div>
      </section>

      {/* ─── Mission ──────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#500000] mb-6 text-center">
            Our Legacy
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed text-center mb-8">
            Founded in 2012, Texas A&M Esports has established itself as one of the premier collegiate esports programs in North America. We unite Aggies who share a passion for League of Legends—whether they're chasing a collegiate title, learning the fundamentals, or just hanging out for Clash every weekend.
          </p>
          <div className="text-center">
            <span className="inline-block bg-[#500000] text-white px-6 py-3 rounded-full font-semibold text-lg">
              Competition · Community · Growth
            </span>
          </div>
        </div>
      </section>

      {/* ─── Championship History ─────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#500000] mb-4 text-center">
            Championship History
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Our competitive journey spans over a decade since 2012, with major victories including our 2017 South Conference Championship and consistent playoff appearances across multiple leagues.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, idx) => (
              <motion.div
                key={`${achievement.year}-${achievement.title}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#500000] mb-2">{achievement.year}</div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">{achievement.title}</h3>
                  <div className="font-bold text-[#500000] text-lg">{achievement.placement}</div>
                  {achievement.placement === "Top 8*" && (
                    <div className="text-xs text-gray-500 mt-1">*Cancelled due to COVID</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-[#500000] to-[#7f0000] text-white rounded-3xl p-8 inline-block">
              <div className="text-4xl font-bold mb-2">2017</div>
              <div className="text-lg">South Conference Champions</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Key Milestones ──────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#500000] mb-12 text-center">
            What Sets Us Apart
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {milestones.map((milestone, idx) => (
              <motion.div
                key={milestone.title}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-start gap-6 bg-gray-50 rounded-3xl p-8"
              >
                <div className="flex-shrink-0">
                  <milestone.icon className="w-12 h-12 text-[#500000]" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{milestone.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats / Highlights ───────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-[#500000] to-[#7f0000] text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center px-6">
          <div>
            <span className="text-5xl font-bold block">2012</span>
            <p className="mt-2 text-lg">Founded</p>
          </div>
          <div>
            <span className="text-5xl font-bold block">4</span>
            <p className="mt-2 text-lg">Active Teams</p>
          </div>
          <div>
            <span className="text-5xl font-bold block">30K+</span>
            <p className="mt-2 text-lg">Solo-queue Games Tracked</p>
          </div>
          <div>
            <span className="text-5xl font-bold block">100+</span>
            <p className="mt-2 text-lg">Members &amp; Alumni</p>
          </div>
        </div>
      </section>

      {/* ─── Values ──────────────────────────────────────── */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6">
          {[
            {
              title: "Excellence",
              desc: "We foster a culture of constant improvement—both in and out of game. Our championship legacy speaks to our commitment to being the best."
            },
            {
              title: "Inclusivity",
              desc: "Whether Iron IV or Challenger, there's a place here for every Aggie. We believe diverse perspectives make us stronger as a team."
            },
            {
              title: "Service",
              desc: "Giving back through mentorship, hosting campus events, and supporting new players. We're building the next generation of Aggie champions."
            }
          ].map((v, idx) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-2xl font-semibold mb-4 text-[#500000]">
                {v.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Timeline Section ────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#500000] mb-12 text-center">
            Our Journey
          </h2>
          <div className="space-y-8">
            {[
              { year: "2012-2013", title: "Foundation Years", desc: "Texas A&M Esports was founded in 2012, quickly establishing our presence with a 2nd place finish in Collegiate Starleague." },
              { year: "2015-2017", title: "Championship Era", desc: "Reached our peak with NACC Championship top-4 finish and the 2017 South Conference Championship, plus CLOL top-8 placement." },
              { year: "2018-2020", title: "Sustained Excellence", desc: "Continued playoff appearances with consistent top-8 finishes before COVID disrupted the 2020 season." },
              { year: "2022-2024", title: "Modern Era", desc: "Rebuilt and evolved with the game, continuing to compete at the highest level with 9-16 playoff appearances." }
            ].map((period, idx) => (
              <motion.div
                key={period.year}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`flex items-center gap-8 ${idx % 2 === 0 ? '' : 'flex-row-reverse'}`}
              >
                <div className="flex-1 bg-gray-50 rounded-3xl p-6">
                  <div className="text-2xl font-bold text-[#500000] mb-2">{period.year}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{period.title}</h3>
                  <p className="text-gray-700">{period.desc}</p>
                </div>
                <div className="w-4 h-4 bg-[#500000] rounded-full flex-shrink-0"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Call to Action ──────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-[#500000] mb-6">
            Ready to Join the Legacy?
          </h2>
          <p className="text-gray-700 text-lg mb-8">
            Join our Discord, sign up for try-outs, or just stop by an IRL watch-party. 
            Be part of Texas A&M's most successful esports program and help us write the next chapter of our story.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button
              className="bg-[#500000] text-white font-semibold hover:bg-[#400000] transform hover:scale-105 transition-all duration-200"
              size="lg"
            >
              <a
                href="https://discord.gg/aggielol"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Discord
              </a>
            </Button>
            <Button
              variant="outline"
              className="border-[#500000] text-[#500000] hover:bg-[#f7f2f2] transform hover:scale-105 transition-all duration-200"
              size="lg"
            >
              <a href="/teams">View Teams</a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}