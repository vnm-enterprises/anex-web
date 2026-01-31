"use client";

import { Grid, List, Map } from "lucide-react";
import { ListingView } from "@/types/view";

interface Props {
  view: ListingView;
  onViewChange: (v: ListingView) => void;
  count: number;
}

export default function ListingToolbar({ view, onViewChange, count }: Props) {
  return (
    <div className="-mt-10 mb-6 flex justify-between items-center">
      <h2 className="font-semibold">{count} properties found</h2>

      <div className="flex gap-2">
        <button onClick={() => onViewChange("grid")}><Grid /></button>
        <button onClick={() => onViewChange("list")}><List /></button>
        <button onClick={() => onViewChange("map")}><Map /></button>
      </div>
    </div>
  );
}
