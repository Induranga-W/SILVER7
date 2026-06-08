"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Legend, Tooltip } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Legend, Tooltip);

const data = {
  labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
  datasets: [
    {
      label: "Revenue",
      data: [28000, 31000, 47000, 29000, 22000, 36000],
      backgroundColor: "#1197cc",
      borderRadius: { topLeft: 3, topRight: 3 },
      borderSkipped: false as const,
      barPercentage: 0.55,
      categoryPercentage: 0.75,
    },
    {
      label: "Profit",
      data: [8000, 9500, 13000, 7500, 6000, 10500],
      backgroundColor: "#ffffff",
      borderRadius: { topLeft: 3, topRight: 3 },
      borderSkipped: false as const,
      barPercentage: 0.55,
      categoryPercentage: 0.75,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: { color: "#c0c0d0", usePointStyle: true, pointStyle: "rect" as const, padding: 20 },
    },
    tooltip: { backgroundColor: "var(--card-bg)", titleColor: "#fff", bodyColor: "#c0c0d0" },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: "#8888a0" }, border: { display: false } },
    y: {
      grid: { color: "rgba(255,255,255,0.05)" },
      ticks: {
        color: "#8888a0",
        maxTicksLimit: 6,
        callback: (v: string | number) =>
          Number(v) === 0 ? "$0.00" : `$${(Number(v) / 1000).toFixed(0)}.0K`,
      },
      border: { display: false },
      beginAtZero: true,
    },
  },
};

export default function RevenueChart() {
  return (
    <div className="bg-[var(--card-bg)] rounded-[12px] px-6 pt-[1.4rem] pb-[1.2rem] mt-8">
      <h2 className="text-base font-bold text-white mb-[0.2rem]">Revenue &amp; Profit</h2>
      <p className="text-[0.78rem] text-[#8888a0] mb-5">Past 6 months</p>
      <div className="relative w-full h-[260px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
