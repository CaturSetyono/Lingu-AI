import React, { useState, useEffect } from "react";

export function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check localStorage and system preference on mount
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme) {
      setIsDark(savedTheme === "dark");
      applyTheme(savedTheme === "dark");
    } else if (prefersDark) {
      setIsDark(true);
      applyTheme(true);
    }
  }, []);

  const applyTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 border-nb-regular border-nb-primary dark:border-nb-light bg-nb-white dark:bg-nb-dark-surface text-nb-dark dark:text-nb-dark-text font-black text-lg hover:bg-nb-bright dark:hover:bg-nb-bright rounded-nb transition-all duration-200 shadow-sm"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? "◯" : "◒"}
    </button>
  );
}
