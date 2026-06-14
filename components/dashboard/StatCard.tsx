"use client";

import React from "react";

type Trend = "up" | "down" | "neutral";

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  change: number;
  trend: Trend;
}

export default function StatCard({ icon, value, label, change, trend }: StatCardProps) {
  const badgeClass =
    trend === "up"
      ? "bg-[rgba(52,199,89,0.15)] text-[#34c759]"
      : trend === "down"
      ? "bg-[rgba(255,59,48,0.15)] text-[#ff3b30]"
      : "bg-[rgba(120,120,180,0.15)] text-[#8888aa]";

  const arrow = trend === "up" ? "↗" : trend === "down" ? "↘" : "→";

  return (
    <div className="bg-[var(--card-bg)] rounded-[12px] px-[1.4rem] pt-[1.2rem] pb-[1.4rem] flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="flex items-center text-[var(--accent-1)]">{icon}</span>
        <span className={`${badgeClass} text-[0.72rem] font-semibold px-2 py-[2px] rounded-full`}>
          {arrow} {change > 0 ? "+" : ""}{change}%
        </span>
      </div>
      <div className="text-[1.65rem] font-bold text-white leading-none mt-1">
        {value}
      </div>
      <div className="text-[0.8rem] text-[var(--accent-2)]">{label}</div>
    </div>
  );
}
