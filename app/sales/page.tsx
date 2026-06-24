"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

function statusClasses(status: string) {
  if (status === "completed" || status === "Completed") return { bg: "bg-[rgba(52,199,89,0.2)]", text: "text-[#34c759]" };
  if (status === "pending" || status === "Pending") return { bg: "bg-[rgba(255,159,10,0.2)]", text: "text-[#ff9f0a]" };
  return { bg: "bg-[rgba(255,59,48,0.2)]", text: "text-[#ff3b30]" };
}

export default function SalesPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay); startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const sumSince = (date: Date) =>
    orders.filter(o => new Date(o.created_at) >= date).reduce((sum, o) => sum + Number(o.total), 0);

  const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);

  const stats = [
    { label: "Today", value: `$${sumSince(startOfDay).toFixed(2)}` },
    { label: "This Week", value: `$${sumSince(startOfWeek).toFixed(2)}` },
    { label: "This Month", value: `$${sumSince(startOfMonth).toFixed(2)}` },
    { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}` },
  ];

  return (
    <div className="bg-[var(--background)] min-h-screen font-sans pb-20">

      {/* Page Header */}
      <div className="px-5 pt-4 pb-2">
        <h1 className="text-white text-[1.5rem] font-bold mb-[0.2rem]">Sales</h1>
        <p className="text-[var(--accent-2)]/50 text-[0.82rem]">Track your revenue &amp; orders</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 px-5 py-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-[var(--btn-bg)] rounded-[12px] p-4">
            <div className="text-[var(--accent-2)]/50 text-[0.78rem] mb-2">{s.label}</div>
            <div className="text-white text-[1.2rem] font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Sales */}
      <div className="px-5">
        <h2 className="text-white text-base font-bold mb-4">Recent Sales</h2>
        <div className="flex flex-col gap-3">
          {loading ? (
            <p className="text-[#8888a0] text-center mt-8">Loading sales...</p>
          ) : orders.length === 0 ? (
            <p className="text-[var(--accent-2)] text-center mt-8">No sales yet.</p>
          ) : (
            orders.map((order) => {
              const sc = statusClasses(order.status);
              const itemCount = order.order_items?.length ?? 0;
              const firstItemName = order.order_items?.[0]?.products?.name ?? "Order";
              return (
                <Link
                  key={order.id}
                  href={`/sales/${order.id}`}
                  className="bg-[var(--btn-bg)] rounded-[12px] p-4 flex justify-between items-center active:scale-95 transition-transform no-underline touch-manipulation"
                >
                  <div>
                    <div className="flex items-center gap-[10px] mb-1">
                      <span className="text-[var(--accent-1)] text-[0.75rem]">#{order.id}</span>
                      <span className={`${sc.bg} ${sc.text} text-[0.65rem] font-semibold px-2 py-[2px] rounded-full`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-white font-semibold text-[0.92rem]">
                      {firstItemName}{itemCount > 1 ? ` +${itemCount - 1} more` : ""}
                    </div>
                    <div className="text-[#9e9e9e] text-[0.75rem]">
                      {order.customers?.name ?? "Unknown customer"}
                    </div>
                  </div>
                  <div className="flex items-center gap-[6px]">
                    <span className="text-white font-bold text-[0.92rem]">${Number(order.total).toFixed(2)}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2" className="pointer-events-none">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}