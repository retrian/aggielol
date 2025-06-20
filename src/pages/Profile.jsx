// src/pages/Profile.jsx
import React, { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Profile | TAMU LoL";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 p-6">
      {/* Icon */}
      <motion.div
        className="relative mb-8"
        initial={!shouldReduce ? { scale: 0 } : false}
        animate={!shouldReduce ? { scale: 1 } : false}
        transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
      >
        <User size={96} className="text-red-400" aria-label="User icon" />
        {!shouldReduce && (
          <motion.div
            className="absolute inset-0 bg-red-400/20 rounded-full blur-xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.div>

      {/* Heading */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-white mb-4 text-center"
        initial={!shouldReduce ? { opacity: 0, y: 20 } : false}
        animate={!shouldReduce ? { opacity: 1, y: 0 } : false}
        transition={{ delay: 0.4 }}
      >
        Player &amp; User Profiles
      </motion.h1>

      {/* Sub-text */}
      <motion.p
        className="text-white/70 text-lg mb-10 text-center max-w-xl"
        initial={!shouldReduce ? { opacity: 0, y: 20 } : false}
        animate={!shouldReduce ? { opacity: 1, y: 0 } : false}
        transition={{ delay: 0.5 }}
      >
        I'm working on this feature right now. Check back soon to view and
        edit player and user profiles!
      </motion.p>

      {/* Back button */}
      <Button
        onClick={() => navigate(-1)}
        size="lg"
        variant="secondary"
        className="bg-red-600 hover:bg-red-700 text-white gap-2"
      >
        ← Go back
      </Button>
    </div>
  );
}
