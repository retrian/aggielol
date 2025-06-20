// src/pages/SchedulePage.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function SchedulePage() {
  // scroll to top on mount
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
        <div className="absolute inset-0 bg-[#500000]/90" />

        <motion.div
          className="relative z-10 text-center px-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Calendar size={96} className="mx-auto text-white mb-6" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tight leading-tight">
            SCHEDULE
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            Upcoming scrims, matches, and events
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

      {/* ----------------------------------------------------------- PLACEHOLDER / CTA */}
      <section className="py-28 bg-white dark:bg-gray-900 flex flex-col items-center text-center px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-8 leading-relaxed">
            This feature is coming soon! Im setting up everything so you can find our schedule here!
          </p>

          <Button asChild size="lg" className="bg-[#500000] hover:bg-[#600000] text-white">
            <Link to="/" className="flex items-center gap-2">
              ← Back to Home
            </Link>
          </Button>
        </motion.div>
      </section>
    </main>
  );
}
