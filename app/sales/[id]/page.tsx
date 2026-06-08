"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const salesData: Record<string, {
  id: string; status: string; item: string; unitPrice: string;
  qty: number; price: string; customer: string;
  date: string; payment: string;
}> = {
  "1042": { id: "#1042", status: "Completed", item: "Blue Denim Jacket", unitPrice: "$59.99", qty: 2, price: "$119.98", customer: "Maria Santos", date: "Mar 7, 2026", payment: "Credit Card" },
  "1041": { id: "#1041", status: "Completed", item: "White Polo Shirt", unitPrice: "$39.99", qty: 1, price: "$39.99", customer: "John Reyes", date: "Mar 6, 2026", payment: "Cash" },
  "1040": { id: "#1040", status: "Pending", item: "Black Sneakers", unitPrice: "$89.99", qty: 1, price: "$89.99", customer: "Anna Cruz", date: "Mar 5, 2026", payment: "Credit Card" },
  "1039": { id: "#1039", status: "Completed", item: "Cargo Pants", unitPrice: "$37.00", qty: 2, price: "$74.00", customer: "Luis Garcia", date: "Mar 4, 2026", payment: "Cash" },
  "1038": { id: "#1038", status: "Cancelled", item: "Red Hoodie", unitPrice: "$54.99", qty: 1, price: "$54.99", customer: "Sofia Reyes", date: "Mar 3, 2026", payment: "Credit Card" },
};

function statusClasses(status: string) {
  if (status === "Completed") return { bg: "bg-[rgba(52,199,89,0.2)]", text: "text-[#34c759]", border: "border-[#34c759]" };
  if (status === "Pending") return { bg: "bg-[rgba(255,159,10,0.2)]", text: "text-[#ff9f0a]", border: "border-[#ff9f0a]" };
  return { bg: "bg-[rgba(255,59,48,0.2)]", text: "text-[#ff3b30]", border: "border-[#ff3b30]" };
}

export default function SaleDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const sale = salesData[id];

  if (!sale) return (
    <div className="bg-[#13131a] min-h-screen flex items-center justify-center text-white">
      Sale not found.
    </div>
  );

  const sc = statusClasses(sale.status);

  const detailRows = [
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
      label: "Customer", value: sale.customer,
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
      label: "Date", value: sale.date,
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
      label: "Payment", value: sale.payment,
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>,
      label: "Order #", value: sale.id,
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
            <div className="text-[#8888a0] text-[0.78rem] mb-1">Order ID</div>
            <div className="text-white text-[1.6rem] font-bold">{sale.id}</div>
          </div>
          <span className={`${sc.bg} ${sc.text} border ${sc.border} text-[0.75rem] font-semibold px-3 py-1 rounded-full`}>
            {sale.status}
          </span>
        </div>

        {/* Product Row */}
        <div className="bg-black rounded-[10px] p-[0.9rem] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[var(--accent-1)] rounded-[10px] w-[42px] h-[42px] flex items-center justify-center shrink-0 pointer-events-none">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" strokeWidth="2" className="pointer-events-none">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <div>
              <div className="text-white font-semibold text-[0.95rem]">{sale.item}</div>
              <div className="text-[#8888a0] text-[0.78rem]">Unit Price: {sale.unitPrice}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[var(--accent-2)] font-bold text-base">{sale.price}</div>
            <div className="text-[#8888a0] text-[0.78rem]">Qty: {sale.qty}</div>
          </div>
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
              <span className="text-[#8888a0] text-[0.85rem]">{row.label}</span>
            </div>
            <span className="text-white font-semibold text-[0.85rem]">{row.value}</span>
          </div>
        ))}
      </div>

      {/* Note Card */}
      <div className="bg-[var(--btn-bg)] rounded-[12px] p-5">
        <h2 className="text-white text-base font-bold mb-3">Note</h2>
        <p className="text-[#8888a0] text-[0.85rem]">No notes added for this order.</p>
      </div>

    </div>
  );
}
