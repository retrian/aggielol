// src/lib/theme.jsx
import { createContext, useContext, useEffect, useState } from "react";

/* ---------- Context ---------- */
const ThemeCtx = createContext(null);

/* ---------- Provider ---------- */
export function ThemeProvider({ children }) {
  // Initial value → localStorage → OS preference → "light"
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return (
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  });

  // Keep <html> class & localStorage in sync
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

/* ---------- Hook ---------- */
export const useTheme = () => useContext(ThemeCtx);
