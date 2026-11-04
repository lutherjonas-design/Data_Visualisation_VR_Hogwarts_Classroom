import ThemeSwitch from "./ThemeSwitch";
import LanguageSwitch from "./LanguageSwitch.tsx";
import { useLanguage } from "../../context/LanguageContext.tsx";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { t } = useLanguage()
  return (
    <header className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
        <Link to={"/"} className="font-semibold tracking-tight">
          {t("nav.name")} 
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitch />
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
}