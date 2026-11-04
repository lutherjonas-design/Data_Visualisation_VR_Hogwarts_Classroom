import React, { createContext, useContext, useState } from "react";
import { translations, type Language } from "../i18n/Translations";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

type LeaveKeys<T> = T extends Record<Language, string>
  ? ""
  : { [K in keyof T & string]: T[K] extends object 
      ? `${K}${LeaveKeys<T[K]> extends "" ? "" : "."}${LeaveKeys<T[K]>}`
      : K 
    }[keyof T & string];

type TranslationKeys = LeaveKeys<typeof translations>;

const LanguageContext = createContext<LanguageContextValue | null>(null);

const LANGUAGE_STORAGE_KEY = "app-language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored === "de" || stored === "en" ? stored : "en";
  });

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }

  function t(key: TranslationKeys): string {
  const parts = key.split(".");
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = translations; 

  for (const part of parts) {
    current = current?.[part];
  }

  return current?.[language] ?? key;
}

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);

  if (!ctx) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return ctx;
}