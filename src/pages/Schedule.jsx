// src/pages/Schedule.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Layout from "@/components/Layout";

export default function SchedulePage() {
  const [schedule, setSchedule] = useState([]);
  useEffect(() => { /* ... */ }, []);

  return (
    <Layout title="Aggie Schedule" subtitle="Never miss a scrim, match, or event">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {schedule.map((evt, idx) => (
          <motion.div
            key={idx}
            className="bg-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">{evt.type}</h3>
              <p className="text-gray-700 mb-1">Vs. {evt.opponent}</p>
              <p className="text-gray-500 text-sm">{new Date(evt.date).toLocaleDateString()}</p>
              <p className="text-gray-500 text-sm">{evt.time}</p>
            </div>
            <a
              href={evt.link}
              className="mt-4 inline-block px-4 py-2 bg-[#500000] text-white font-medium rounded-full text-center hover:bg-[#400000] transition"
            >
              View Details
            </a>
          </motion.div>
        ))}
      </div>
    </Layout>
  );
}
