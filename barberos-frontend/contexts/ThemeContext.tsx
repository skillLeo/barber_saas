"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type Language = { code: string; name: string; flag: string; dir: "ltr" | "rtl" };

export const languages: Language[] = [
  { code: "en", name: "English",    flag: "🇬🇧", dir: "ltr" },
  { code: "ar", name: "العربية",    flag: "🇸🇦", dir: "rtl" },
  { code: "fr", name: "Français",   flag: "🇫🇷", dir: "ltr" },
  { code: "de", name: "Deutsch",    flag: "🇩🇪", dir: "ltr" },
  { code: "es", name: "Español",    flag: "🇪🇸", dir: "ltr" },
  { code: "it", name: "Italiano",   flag: "🇮🇹", dir: "ltr" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱", dir: "ltr" },
  { code: "tr", name: "Türkçe",     flag: "🇹🇷", dir: "ltr" },
  { code: "pl", name: "Polski",     flag: "🇵🇱", dir: "ltr" },
  { code: "pt", name: "Português",  flag: "🇵🇹", dir: "ltr" },
  { code: "ru", name: "Русский",    flag: "🇷🇺", dir: "ltr" },
  { code: "ur", name: "اردو",       flag: "🇵🇰", dir: "rtl" },
];

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
  language: languages[0],
  setLanguage: () => {},
});

const THEME_KEY = "barberos-theme-v4";
const LANG_KEY  = "barberos-language-v2";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [language, setLanguageState] = useState<Language>(languages[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") {
      setThemeState(stored);
    }
    const storedLang = localStorage.getItem(LANG_KEY);
    if (storedLang) {
      const lang = languages.find(l => l.code === storedLang);
      if (lang) setLanguageState(lang);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.dir = language.dir;
  }, [language, mounted]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState(prev => (prev === "dark" ? "light" : "dark"));
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANG_KEY, lang.code);
  };

  if (!mounted) {
    return (
      <div data-theme="dark" className="min-h-screen" style={{ background: "var(--bg-base)" }}>
        {children}
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, language, setLanguage }}>
      <div data-theme={theme} dir={language.dir} className="min-h-screen">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
