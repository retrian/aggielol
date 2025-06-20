// src/pages/SchedulePage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function SchedulePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 p-6">
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 120, delay: 0.2 }}
      >
        <Calendar size={96} className="text-red-400" />
        <motion.div
          className="absolute inset-0 bg-red-400/20 rounded-full blur-xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <motion.h1
        className="text-4xl md:text-5xl font-bold text-white mb-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Schedule Page
      </motion.h1>

      <motion.p
        className="text-white/70 text-lg mb-8 text-center max-w-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        I'm working on this feature right now. Check back soon for upcoming scrims, matches, 
        and events!
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
          <Link to="/" className="flex items-center gap-2">
            ← Back to Home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
