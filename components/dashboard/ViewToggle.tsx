/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Grid, List } from "lucide-react";

export default function ViewToggle({
  view,
  setView,
}: any) {
  return (
    <div className="flex border rounded-lg p-1">
      <button
        onClick={() => setView("list")}
        className={`p-2 ${view === "list" && "bg-primary text-white rounded"}`}
      >
        <List size={20} />
      </button>
      <button
        onClick={() => setView("grid")}
        className={`p-2 ${view === "grid" && "bg-primary text-white rounded"}`}
      >
        <Grid size={20} />
      </button>
    </div>
  );
}
