// components/NavBar.jsx
import { NavLink, Link } from "react-router-dom";
import { User } from "lucide-react";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle.jsx";

const linkClass = ({ isActive }) =>
  `relative px-4 py-2 rounded-full font-medium transition-all duration-300 ease-out
   overflow-hidden group
   ${
     isActive
       ? "bg-gradient-to-r from-[#500000] via-[#7f0000] to-[#500000] text-white shadow-lg shadow-[#500000]/30 scale-105" 
       : "hover:bg-gradient-to-r hover:from-gray-100 hover:via-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:via-gray-700 dark:hover:to-gray-800 hover:scale-105 hover:shadow-md"
   }
   before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
   before:translate-x-[-200%] before:transition-transform before:duration-700
   hover:before:translate-x-[200%]
   after:absolute after:inset-0 after:rounded-full after:border after:border-transparent
   ${isActive ? 'after:border-white/30' : 'after:border-gray-200/50 dark:after:border-gray-600/50'}
   after:transition-all after:duration-300`;

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20); // Start shrinking after 20px of scroll
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup function to remove event list ener
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`
      sticky top-0 left-0 w-full z-50 
      bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl 
      border-b border-gray-200/20 dark:border-gray-700/20
      transition-all duration-300 ease-out
      ${isScrolled ? 'py-1' : 'py-0'}
    `}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10"></div>
      
      <nav className={`
        relative flex items-center justify-between gap-6 max-w-7xl mx-auto
        transition-all duration-300 ease-out
        ${isScrolled ? 'px-4 py-2' : 'px-4 py-4'}
      `}>
        {/* Logo/brand area */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center group">
            <img 
              src="/amelogo.png" 
              alt="AME Logo" 
              className={`
                mr-3 transition-all duration-300 
                group-hover:scale-110 group-hover:drop-shadow-lg
                ${isScrolled ? 'w-10 h-10' : 'w-15 h-15'}
              `}
            />
          </Link>
        </div>

        {/* Center: site links with enhanced styling */}
        <div className={`
          flex gap-1 bg-white/50 dark:bg-gray-800/50 rounded-full shadow-lg 
          backdrop-blur-sm border border-gray-200/30 dark:border-gray-600/30
          transition-all duration-300 ease-out
          ${isScrolled ? 'p-1.5 scale-95' : 'p-2 scale-100'}
        `}>
          <NavLink to="/" className={linkClass}>
            <span className={`
              relative z-10 transition-all duration-300
              ${isScrolled ? 'text-sm px-3 py-1.5' : 'text-base px-4 py-2'}
            `}>Home</span>
          </NavLink>
          <NavLink to="/teams" className={linkClass}>
            <span className={`
              relative z-10 transition-all duration-300
              ${isScrolled ? 'text-sm px-3 py-1.5' : 'text-base px-4 py-2'}
            `}>Teams</span>
          </NavLink>
          <NavLink to="/players" className={linkClass}>
            <span className={`
              relative z-10 transition-all duration-300
              ${isScrolled ? 'text-sm px-3 py-1.5' : 'text-base px-4 py-2'}
            `}>Players</span>
          </NavLink>
          <NavLink to="/leaderboard" className={linkClass}>
            <span className={`
              relative z-10 transition-all duration-300
              ${isScrolled ? 'text-sm px-3 py-1.5' : 'text-base px-4 py-2'}
            `}>Leaderboard</span>
          </NavLink>
          <NavLink to="/schedule" className={linkClass}>
            <span className={`
              relative z-10 transition-all duration-300
              ${isScrolled ? 'text-sm px-3 py-1.5' : 'text-base px-4 py-2'}
            `}>Schedule</span>
          </NavLink>
          <NavLink to="/streams" className={linkClass}>
            <span className={`
              relative z-10 transition-all duration-300
              ${isScrolled ? 'text-sm px-3 py-1.5' : 'text-base px-4 py-2'}
            `}>Streams</span>
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            <span className={`
              relative z-10 transition-all duration-300
              ${isScrolled ? 'text-sm px-3 py-1.5' : 'text-base px-4 py-2'}
            `}>About</span>
          </NavLink>
          <NavLink to="/ApiTest" className={linkClass}>
            <span className={`
              relative z-10 transition-all duration-300
              ${isScrolled ? 'text-sm px-3 py-1.5' : 'text-base px-4 py-2'}
            `}>ApiTest</span>
          </NavLink>
        </div>

        {/* Right: enhanced theme toggle and profile area */}
        <div className={`
          flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 rounded-full 
          shadow-lg backdrop-blur-sm border border-gray-200/30 dark:border-gray-600/30
          transition-all duration-300 ease-out
          ${isScrolled ? 'p-1.5 scale-95' : 'p-2 scale-100'}
        `}>
          <ThemeToggle />
          <div className="w-px h-6 bg-gray-300/50 dark:bg-gray-600/50"></div>
          <Link
            to="/profile"
            className={`
              flex items-center justify-center rounded-full transition-all duration-300 ease-out 
              hover:bg-white/70 dark:hover:bg-gray-700/70 
              hover:ring-2 hover:ring-[#500000]/50 dark:hover:ring-[#7f0000]/50
              text-gray-600 dark:text-gray-300
              hover:text-[#500000] dark:hover:text-[#7f0000]
              group
              ${isScrolled ? 'w-7 h-7' : 'w-8 h-8'}
            `}
          >
            <User className={`
              transition-all duration-300
              ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}
            `} />
          </Link>
        </div>
      </nav>

      {/* Animated bottom border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#500000]/50 to-transparent"></div>
    </header>
  );
}