"use client";
import { useEffect, useState } from "react";

export function useDashboardMode() {
  const [advanced, setAdvanced] = useState(false);



  useEffect(() => {
    const func_set_advance = async (saved: string) => {
      setAdvanced(saved === "advanced");
  }

    const saved = localStorage.getItem("dashboard_mode");
    if (saved) func_set_advance(saved);
  }, []);

  const toggle = () => {
    const next = !advanced;
    setAdvanced(next);
    localStorage.setItem("dashboard_mode", next ? "advanced" : "simple");
  };

  return { advanced, toggle };
}
