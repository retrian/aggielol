// src/components/PlayerCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { profileIconUrl } from "../lib/riotApi";

export default function PlayerCard({ name, iconId }) {
  // If iconId is null/undefined, we won't attempt to load a Riot URL.
  // Instead, we use a generic gradient background for the card,
  // and show a simple avatar placeholder circle.
  const hasIcon = typeof iconId === "number" && iconId > 0;
  const iconUrl = hasIcon ? profileIconUrl(iconId) : null;

  return (
    <motion.div
      className={`
        relative
        w-56 h-72
        rounded-xl 
        overflow-hidden 
        shadow-lg hover:shadow-2xl
        transition-shadow duration-300
        ${hasIcon 
          ? "bg-gradient-to-br from-blue-500/20 to-purple-600/20" 
          : "bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800"
        }
        backdrop-blur-sm
        border border-white/20
      `}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      {/* Blurred background image for visual depth */}
      {hasIcon && (
        <>
          <div
            className="absolute inset-0 bg-center bg-cover filter blur-md opacity-30"
            style={{ backgroundImage: `url("${iconUrl}")` }}
          />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </>
      )}

      {/* Content container */}
      <div className="relative flex flex-col items-center justify-center h-full px-4 py-6">
        {/* Avatar container with enhanced styling */}
        <div
          className={`
            w-20 h-20 
            rounded-full 
            overflow-hidden 
            shadow-lg
            ring-3 ring-white/50
            ${hasIcon 
              ? "bg-white" 
              : "bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700"
            }
            transition-transform duration-200
            hover:scale-110
          `}
        >
          {hasIcon ? (
            <img
              src={iconUrl}
              alt={`${name} avatar`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder-icon.png";
              }}
            />
          ) : (
            // Enhanced placeholder with icon
            <div className="w-full h-full flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-slate-500 dark:text-slate-400" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
          )}
        </div>

        {/* Enhanced name styling */}
        <div className="mt-4 text-center">
          <h3 
            className={`
              text-base font-bold tracking-wide
              ${hasIcon 
                ? "text-white drop-shadow-lg" 
                : "text-slate-800 dark:text-slate-200"
              }
              line-clamp-2
              leading-tight
            `}
            title={name}
          >
            {name}
          </h3>
        </div>
      </div>

      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000" />
      </div>
    </motion.div>
  );
}