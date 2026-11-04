import { useTheme } from "../../context/ThemeContext";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        rounded-md px-3 py-1
        text-sm
        text-[var(--text-muted)]
        hover:text-[var(--text)]
        hover:bg-[var(--bg-soft)]
        transition
      "
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}