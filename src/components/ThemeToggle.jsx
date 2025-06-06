// components/ThemeToggle.jsx
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "../lib/theme.jsx";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      className="
        rounded-full
        bg-white text-black
        dark:bg-black dark:text-white
      "
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </Button>
  );
}
