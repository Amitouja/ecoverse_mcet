'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on client-side, never on server
    try {
      const savedTheme = localStorage?.getItem('ecoverse-theme');
      const prefersDark = window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
      const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark;
      setIsDark(shouldBeDark);
      applyTheme(shouldBeDark);
    } catch (error) {
      console.warn('Theme initialization error:', error);
    }
    setMounted(true);
  }, []);

  const applyTheme = (dark: boolean) => {
    try {
      const html = document.documentElement;
      if (dark) {
        html.classList.add('dark');
        html.style.colorScheme = 'dark';
      } else {
        html.classList.remove('dark');
        html.style.colorScheme = 'light';
      }
    } catch (error) {
      console.warn('Error applying theme:', error);
    }
  };

  const toggleTheme = () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      localStorage?.setItem('ecoverse-theme', newTheme ? 'dark' : 'light');
      applyTheme(newTheme);
    } catch (error) {
      console.warn('Error toggling theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    console.warn('useTheme must be used within ThemeProvider');
    // Return a safe default instead of throwing
    return {
      isDark: false,
      toggleTheme: () => {},
      mounted: false,
    };
  }
  return context;
}