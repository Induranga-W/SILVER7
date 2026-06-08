"use client";

import StatCard from "../../components/dashboard/StatCard";
import Revenuechart from "../../components/dashboard/Revenuechart";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black pt-20 p-8 font-sans">

      <h1 className="text-[1.6rem] font-bold text-white mb-[0.2rem]">Dashboard</h1>
      <p className="text-[0.85rem] text-[#8888a0] mb-6">Overview of your store</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <StatCard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          value="$12k+" label="Total Sales" change={12} trend="up" 
        />
        {/* fix the 12k is not funtional */} 
        
        <StatCard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>}
          value="327" label="Total Orders" change={8} trend="up"
        />
        <StatCard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
          value="14" label="Employees" change={0} trend="neutral"
        />
        <StatCard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>}
          value="209" label="Products" change={-3} trend="down"
        />
      </div>

      <Revenuechart />
    </main>
  );
}
