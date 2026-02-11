"use client";
import { useState } from "react";

export function useViewMode() {
  const [view, setView] = useState<"list" | "grid">("grid");
  return { view, setView };
}
