"use client";

import Link from "next/link";

const stats = [
  { label: "Today", value: "$1,240.00", change: 5, trend: "up" },
  { label: "This Week", value: "$8,320.00", change: 12, trend: "up" },
  { label: "This Month", value: "$31,400.00", change: -2, trend: "down" },
  { label: "Total Revenue", value: "$248,900.00", change: 18, trend: "up" },
];

const recentSales = [
  { id: "#1042", status: "Completed", item: "Blue Denim Jacket", qty: 2, customer: "Maria Santos", price: "$119.98" },
  { id: "#1041", status: "Completed", item: "White Polo Shirt", qty: 1, customer: "John Reyes", price: "$39.99" },
  { id: "#1040", status: "Pending", item: "Black Sneakers", qty: 1, customer: "Anna Cruz", price: "$89.99" },
  { id: "#1039", status: "Completed", item: "Cargo Pants", qty: 2, customer: "Luis Garcia", price: "$74.00" },
  { id: "#1038", status: "Cancelled", item: "Red Hoodie", qty: 1, customer: "Sofia Reyes", price: "$54.99" },
];

function statusClasses(status: string) {
  if (status === "Completed") return { bg: "bg-[rgba(52,199,89,0.2)]", text: "text-[#34c759]" };
  if (status === "Pending") return { bg: "bg-[rgba(255,159,10,0.2)]", text: "text-[#ff9f0a]" };
  return { bg: "bg-[rgba(255,59,48,0.2)]", text: "text-[#ff3b30]" };
}

export default function SalesPage() {
  return (
    <div className="bg-[var(--background)] min-h-screen font-sans pb-20">
      
    

      {/* Page Header */}
      <div className="px-5 pt-4 pb-2">
        <h1 className="text-white text-[1.5rem] font-bold mb-[0.2rem]">Sales</h1>
        <p className="text-[var(--accent-2)]/50 text-[0.82rem]">Track your revenue &amp; orders</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 px-5 py-4">
        {stats.map((s) => {
          const isUp = s.trend === "up";
          return (
            <div key={s.label} className="bg-[var(--btn-bg)] rounded-[12px] p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[car(--accent-2)]/50 text-[0.78rem]">{s.label}</span>
                <span className={`text-[0.7rem] font-semibold px-[7px] py-[2px] rounded-full ${isUp ? "bg-[rgba(52,199,89,0.15)] text-[#34c759]" : "bg-[rgba(255,59,48,0.15)] text-[#ff3b30]"}`}>
                  {isUp ? "↗" : "↘"} {isUp ? "+" : ""}{s.change}%
                </span>
              </div>
              <div className="text-white text-[1.2rem] font-bold">{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Sales */}
      <div className="px-5">
        <h2 className="text-white text-base font-bold mb-4">Recent Sales</h2>
        <div className="flex flex-col gap-3">
          {recentSales.map((sale) => {
            const sc = statusClasses(sale.status);
            return (
              <Link
                key={sale.id}
                href={`/sales/${sale.id.replace("#", "")}`}
                className="bg-[var(--btn-bg)] rounded-[12px] p-4 flex justify-between items-center active:scale-95 transition-transform no-underline touch-manipulation"
              >
                <div>
                  <div className="flex items-center gap-[10px] mb-1">
                    <span className="text-[var(--accent-1)] text-[0.75rem]">{sale.id}</span>
                    <span className={`${sc.bg} ${sc.text} text-[0.65rem] font-semibold px-2 py-[2px] rounded-full`}>
                      {sale.status}
                    </span>
                  </div>
                  <div className="text-white font-semibold text-[0.92rem]">{sale.item}</div>
                  <div className="text-[#9e9e9e] text-[0.75rem]">Qty: {sale.qty} · {sale.customer}</div>
                </div>
                <div className="flex items-center gap-[6px]">
                  <span className="text-white font-bold text-[0.92rem]">{sale.price}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2" className="pointer-events-none">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
