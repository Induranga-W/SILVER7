"use client";

import { useState, useEffect } from "react";
import StatCard from "../../components/dashboard/StatCard";
import Revenuechart from "../../components/dashboard/Revenuechart";

export default function DashboardPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then(r => r.json()).catch(() => []),
      fetch("/api/orders").then(r => r.json()).catch(() => []),
    ]).then(([productsData, ordersData]) => {
      setProducts(Array.isArray(productsData) ? productsData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    }).finally(() => setLoading(false));
  }, []);

  const totalSales = orders.reduce((sum, o) => sum + Number(o.total ?? 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  // TODO: wire up once the Employees table + /api/employees route exist (step 2 of the backend rollout)
  const totalEmployees = 0;

  return (
    <main className="min-h-screen bg-black pt-20 p-8 font-sans">

      <h1 className="text-[1.6rem] font-bold text-white mb-[0.2rem]">Dashboard</h1>
      <p className="text-[0.85rem] text-[var(--accent-2)]/80 mb-6">Overview of your store</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <StatCard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          value={loading ? "..." : "$" + totalSales.toFixed(2)} label="Total Sales"
        />
        <StatCard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>}
          value={loading ? "..." : String(totalOrders)} label="Total Orders"
        />
        <StatCard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
          value={loading ? "..." : String(totalEmployees)} label="Employees"
        />
        <StatCard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>}
          value={loading ? "..." : String(totalProducts)} label="Products"
        />
      </div>

      <Revenuechart orders={orders} />
    </main>
  );
}
