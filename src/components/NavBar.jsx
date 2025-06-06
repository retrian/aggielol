// components/NavBar.jsx
import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md font-medium transition-colors
   ${
     isActive
       ? "bg-[#500000] text-white dark:bg-[#7f0000]" // Aggie-maroon active
       : "hover:bg-gray-100 dark:hover:bg-gray-800"
   }`;

export default function NavBar() {
  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-white/95 backdrop-blur">
    <nav className="flex items-center justify-between gap-4 p-4">
      {/* left: site links */}
      <div className="flex gap-2">
        <NavLink to="/"            className={linkClass}>Home</NavLink>
        <NavLink to="/teams"       className={linkClass}>Teams</NavLink>
        <NavLink to="/players"     className={linkClass}>Players</NavLink>
        <NavLink to="/leaderboard" className={linkClass}>Leaderboard</NavLink>
        <NavLink to="/schedule"    className={linkClass}>Schedule</NavLink>
        <NavLink to="/streams"     className={linkClass}>Streams</NavLink>
        <NavLink to="/profile"     className={linkClass}>Profile</NavLink>
      </div>

      {/* right: dark-mode toggle */}
      <ThemeToggle />
    </nav>
    </header>
  );
}
