"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  return (
    <button aria-label="Toggle theme" onClick={toggle} className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface2)] text-[var(--text)] transition hover:scale-105">
      {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
