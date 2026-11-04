import { useLanguage } from "../../context/LanguageContext";

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  const nextLanguage = language === "en" ? "de" : "en";

  return (
    <button
      onClick={() => setLanguage(nextLanguage)}
      className="
        rounded-md px-3 py-1
        text-sm uppercase
        text-[var(--text-muted)]
        hover:text-[var(--text)]
        hover:bg-[var(--bg-soft)]
        transition
      "
      aria-label="Toggle language"
    >
      {language}
    </button>
  );
}