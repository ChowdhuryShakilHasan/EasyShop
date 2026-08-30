"use client";

import { useState, useEffect } from "react";

function getInitialTheme(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("easyshop_theme") === "dark";
}

export function useTheme() {
  const [isDark, setIsDark] = useState(getInitialTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("easyshop_theme", next ? "dark" : "light");
  };

  return { isDark, toggleTheme, mounted };
}