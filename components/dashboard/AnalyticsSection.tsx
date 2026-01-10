"use client";
import { useDashboardMode } from "./useDashboardMode";

export default function AnalyticsSection() {
  const { advanced } = useDashboardMode();
  if (!advanced) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* reuse your existing stat cards exactly */}
    </div>
  );
}
