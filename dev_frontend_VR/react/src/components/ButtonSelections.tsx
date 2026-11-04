import { useState, useEffect, useRef } from "react";

import { useLanguage } from "../context/LanguageContext"

type ButtonBarProp<T> = {
    currentMode: T;
    options: readonly T[];
    setMode: (mode: T) => void;
}

export const ButtonBar = <T extends string>({
    currentMode, options, setMode
}: ButtonBarProp<T>) => {
    const { t } = useLanguage();
    return (
        <div className="space-y-4">
            <div className="inline-flex rounded-lg border border-custom-border bg-custom-bg-soft p-1 space-x-1">
                {options.map((option) => (
                    <button key={option} onClick={() => setMode(option)}
                        className={`rounded-md px-4 py-1.5 text-sm font-medium 
                            transition-colors duration-300
                            ${currentMode === option
                                ? "bg-custom-accent text-custom-text shadow-sm"
                                : "text-custom-text-muted hover:text-custom-text cursor-pointer"
                            }`}
                    >
                        {t(`buttonBar.${option}`)}
                    </button>
                ))}
            </div>
        </div>
    )
}

type DropdownProps<T> = {
    currentMode: T;
    options: readonly T[];
    setMode: (mode: T) => void;
};

export const Dropdown = <T extends string>({
  currentMode,
  options,
  setMode,
}: DropdownProps<T>) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  // Schließt das Dropdown, wenn man außerhalb klickt
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex min-w-[120px] justify-between items-center rounded-md bg-custom-bg px-3 py-1.5 text-sm font-medium text-custom-text shadow-sm ring-1 ring-inset ring-custom-border hover:bg-custom-bg-soft transition cursor-pointer"
      >
        <span>{t(`fileInfo.${currentMode}`)}</span>
        <span className={`text-custom-text transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute left-0 z-10 mt-1 min-w-full origin-top-left rounded-md bg-custom-bg shadow-lg ring-1 ring-custom-border ring-opacity-5 focus:outline-none py-1">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setMode(opt);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                opt === currentMode
                  ? "bg-custom-accent/20 text-custom-text font-semibold"
                  : "text-custom-text-muted hover:bg-custom-bg-soft"
              }`}
            >
              {t(`fileInfo.${opt}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};