"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const THEME_KEY = "zyvibe:theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === "light" || current === "dark") setTheme(current);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Ignore storage failures; the attribute still switches this page.
    }
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={theme === "light"}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {theme === "dark" ? "◐" : "◑"}
      </span>
      <span className="theme-toggle-label mono">{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
