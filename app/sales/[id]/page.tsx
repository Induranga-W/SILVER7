"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

function statusClasses(status: string) {
  if (status === "completed" || status === "Completed") return { bg: "bg-[rgba(52,199,89,0.2)]", text: "text-[#34c759]", border: "border-[#34c759]" };
  if (status === "pending" || status === "Pending") return { bg: "bg-[rgba(255,159,10,0.2)]", text: "text-[#ff9f0a]", border: "border-[#ff9f0a]" };
  return { bg: "bg-[rgba(255,59,48,0.2)]", text: "text-[#ff3b30]", border: "border-[#ff3b30]" };
}

export default function SaleDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [sale, setSale] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/orders/${id}`)
      .then(res => { if (!res.ok) throw new Error("not found"); return res.json(); })
      .then(data => { if (!cancelled) setSale(data); })
      .catch(() => { if (!cancelled) setNotFound(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[var(--background)] min-h-screen flex items-center justify-center font-sans">
        <p className="text-[#8888a0]">Loading...</p>
      </div>
    );
  }

  if (notFound || !sale) {
    return (
      <div className="bg-[#13131a] min-h-screen flex items-center justify-center text-white font-sans">
        <div className="text-center">
          <p className="mb-4">Sale not found.</p>
          <Link href="/sales" className="text-[var(--accent-1)] no-underline">← Back to Sales</Link>
        </div>
      </div>
    );
  }

  const sc = statusClasses(sale.status);
  const items = sale.order_items ?? [];

  const detailRows = [
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
      label: "Customer", value: sale.customers?.name ?? "—",
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
      label: "Date", value: new Date(sale.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>,
      label: "Order #", value: `#${sale.id}`,
    },
  ];

  return (
    <div className="bg-[var(--background)] min-h-screen font-sans p-5">

      {/* Back */}
      <Link href="/sales" className="flex items-center gap-[6px] text-white text-[0.9rem] no-underline mb-6">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Sales
      </Link>

      {/* Order ID Card */}
      <div className="bg-[var(--btn-bg)] rounded-[12px] p-5 mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-[var(--accent-1)] text-[0.78rem] mb-1">Order ID</div>
            <div className="text-white text-[1.6rem] font-bold">#{sale.id}</div>
          </div>
          <span className={`${sc.bg} ${sc.text} border ${sc.border} text-[0.75rem] font-semibold px-3 py-1 rounded-full`}>
            {sale.status}
          </span>
        </div>

        {/* Product Rows */}
        <div className="flex flex-col gap-2">
          {items.length === 0 ? (
            <p className="text-[var(--accent-2)]/60 text-[0.85rem] px-1">No items recorded for this order.</p>
          ) : items.map((item: any) => (
            <div key={item.id} className="bg-black rounded-[10px] p-[0.9rem] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-[var(--accent-1)] rounded-[10px] w-[42px] h-[42px] flex items-center justify-center shrink-0 pointer-events-none">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" strokeWidth="2" className="pointer-events-none">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold text-[0.95rem]">{item.products?.name ?? "Product"}</div>
                  <div className="text-[var(--accent-1)] text-[0.78rem]">Unit Price: ${Number(item.unit_price).toFixed(2)}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[var(--accent-2)] font-bold text-base">${(Number(item.unit_price) * Number(item.quantity)).toFixed(2)}</div>
                <div className="text-[var(--accent-1)] text-[0.78rem]">Qty: {item.quantity}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details Card */}
      <div className="bg-[var(--btn-bg)] rounded-[12px] p-5 mb-4">
        <h2 className="text-white text-base font-bold mb-4">Order Details</h2>
        {detailRows.map((row, i, arr) => (
          <div
            key={row.label}
            className={`flex justify-between items-center py-[0.9rem] ${i < arr.length - 1 ? "border-b border-[#2a2a3a]" : ""}`}
          >
            <div className="flex items-center gap-[10px]">
              {row.icon}
              <span className="text-[var(--accent-2)]/80 text-[0.85rem]">{row.label}</span>
            </div>
            <span className="text-white font-semibold text-[0.85rem]">{row.value}</span>
          </div>
        ))}
      </div>

      {/* Total Card */}
      <div className="bg-[var(--btn-bg)] rounded-[12px] p-5">
        <h2 className="text-white text-base font-bold mb-3">Total</h2>
        <p className="text-white text-[1.4rem] font-bold">${Number(sale.total).toFixed(2)}</p>
      </div>

    </div>
  );
}
