'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/app/context/ThemeContext';

export function ThemeToggle() {
  const { isDark, toggleTheme, mounted } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything on server-side
  if (!isMounted || !mounted) {
    return (
      <button
        disabled
        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
        aria-label="Theme toggle loading"
      >
        <span className="text-xl">🌙</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
      aria-label="Toggle theme"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <span className="text-xl">☀️</span>
      ) : (
        <span className="text-xl">🌙</span>
      )}
    </button>
  );
}
