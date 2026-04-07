'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext({
  theme: 'light',
  language: 'tr',
  mounted: false,
  toggleTheme: () => {},
  toggleLanguage: () => {},
});

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('tr');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // ── Theme ─────────────────────────────────────────────────
    const savedTheme = localStorage.getItem('mc-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }

    // ── Language (timezone → country) ─────────────────────────
    const savedLang = localStorage.getItem('mc-language');
    if (savedLang) {
      setLanguage(savedLang);
    } else {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // Turkey timezone
        setLanguage(tz === 'Europe/Istanbul' ? 'tr' : 'en');
      } catch {
        setLanguage('tr');
      }
    }
  }, []);

  // Apply theme to <html data-theme="...">
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mc-theme', theme);
  }, [theme, mounted]);

  // Save language preference
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('mc-language', language);
  }, [language, mounted]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  const toggleLanguage = () => setLanguage((l) => (l === 'tr' ? 'en' : 'tr'));

  return (
    <AppContext.Provider value={{ theme, language, mounted, toggleTheme, toggleLanguage }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
