// components/Layout.jsx
import React from "react";
import { motion } from "framer-motion";

/**
 * Layout component to provide a consistent hero and container on all pages.
 * Props:
 *  - title: main heading text
 *  - subtitle: optional subheading text
 *  - bgImage: optional background image for hero
 *  - children: page content
 */
export default function Layout({ title, subtitle, bgImage, children }) {
  return (
    <main>
      <section
        className="relative h-64 flex items-center justify-center bg-fixed bg-center bg-cover"
        style={{ backgroundImage: `url('${bgImage || '/assets/hero-bg.webp'}')` }}
      >
        <div className="absolute inset-0 bg-[#500000]/90" />
        <motion.div
          className="relative z-10 text-center px-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight">
            {title}
          </h1>
          {subtitle && <p className="mt-4 text-xl text-white">{subtitle}</p>}
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {children}
      </div>
    </main>
  );
}