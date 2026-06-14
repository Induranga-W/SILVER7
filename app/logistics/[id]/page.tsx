"use client";

import Link from "next/link";
import { use, useState } from "react";

type ShipStatus = "Order Placed" | "Processing" | "Dispatched" | "In Transit" | "Delivered";

type Shipment = {
  id: string;
  supplier: string;
  items: number;
  carrier: string;
  eta: string;
  shipDate: string;
  tracking: string;
  status: ShipStatus;
};

// ── Keep this in sync with your logistics/page.tsx data ──────────────────────
const shipments: Shipment[] = [
  { id: "SHP-884", supplier: "TextileCo Ltd",  items: 3, carrier: "J&T Express", eta: "Mar 9, 2026",  shipDate: "Mar 6, 2026",  tracking: "TC884729X", status: "Dispatched"  },
  { id: "SHP-883", supplier: "FabricHub Inc",  items: 7, carrier: "Lalamove",    eta: "Mar 7, 2026",  shipDate: "Mar 3, 2026",  tracking: "LM789012Y", status: "Delivered"   },
  { id: "SHP-882", supplier: "WeaveCraft Co",  items: 2, carrier: "J&T Express", eta: "Mar 14, 2026", shipDate: "Mar 10, 2026", tracking: "TC345678Z", status: "Processing"  },
  { id: "SHP-881", supplier: "TextileCo Ltd",  items: 5, carrier: "Ninja Van",   eta: "Mar 4, 2026",  shipDate: "Mar 1, 2026",  tracking: "NV567890A", status: "Delivered"   },
  { id: "SHP-880", supplier: "GlobalFabrics",  items: 4, carrier: "Lalamove",    eta: "Mar 16, 2026", shipDate: "Mar 12, 2026", tracking: "LM234567B", status: "Processing"  },
];

// Timeline steps in order
const TIMELINE_STEPS: ShipStatus[] = [
  "Order Placed",
  "Processing",
  "Dispatched",
  "In Transit",
  "Delivered",
];

function statusBadgeClass(status: ShipStatus) {
  if (status === "Delivered")    return "bg-[rgba(52,199,89,0.15)]  text-[#34c759] border border-[#34c759]";
  if (status === "Dispatched")   return "bg-[rgba(10,132,255,0.15)] text-[#0a84ff] border border-[#0a84ff]";
  if (status === "In Transit")   return "bg-[rgba(100,210,255,0.15)] text-[#64d2ff] border border-[#64d2ff]";
  if (status === "Processing")   return "bg-[rgba(255,159,10,0.15)] text-[#ff9f0a] border border-[#ff9f0a]";
  return "bg-[rgba(180,180,200,0.15)] text-[#aeaec0] border border-[#aeaec0]";
}

export default function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const shipment = shipments.find(s => s.id === id);

  const [status, setStatus] = useState<ShipStatus>(shipment?.status ?? "Processing");

  if (!shipment) {
    return (
      <div className="bg-[var(--background)] min-h-screen flex flex-col items-center justify-center font-sans">
        <p className="text-[#8888a0] mb-4">Shipment not found.</p>
        <Link href="/logistics" className="text-[var(--accent-1)] no-underline">← Back to Logistics</Link>
      </div>
    );
  }

  const currentIdx = TIMELINE_STEPS.indexOf(status);

  function handleDeliver() {
    setStatus("Delivered");
    // TODO: persist to your backend/database here
  }

  function handleDelete() {
    // TODO: add a confirm modal + delete from your data source
    window.location.href = "/logistics";
  }

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between py-[14px] border-b border-white/5 last:border-0">
      <span className="text-[0.82rem] text-[#8888a0] font-medium">{label}</span>
      <span className="text-[0.82rem] text-white font-semibold">{value}</span>
    </div>
  );

  return (
    <div className="bg-[var(--background)] min-h-screen font-sans px-5 pt-5 pb-12">

      {/* Main card*/}
      <div className="bg-[var(--card-bg)] rounded-[16px] p-5 mb-4">

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[0.7rem] text-[var(--accent-2)]/80 uppercase tracking-widest mb-1 font-medium">Shipment ID</p>
            <h1 className="text-[1.6rem] font-bold text-white tracking-tight">#{shipment.id}</h1>
          </div>
          <span className={`${statusBadgeClass(status)} text-[0.7rem] font-semibold px-3 py-[5px] rounded-full flex items-center gap-1.5 mt-1`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {status}
          </span>
        </div>

        {/* Info rows */}
        <div>
          <InfoRow label="Supplier"   value={shipment.supplier} />
          <InfoRow label="Carrier"    value={shipment.carrier} />
          <InfoRow label="Quantity"   value={`${shipment.items} items`} />
          <InfoRow label="Ship Date"  value={shipment.shipDate} />
          <InfoRow label="ETA"        value={shipment.eta} />
          <InfoRow label="Tracking #" value={shipment.tracking} />
        </div>
      </div>

      {/* Action buttons*/}
      <div className="grid grid-cols-3 gap-3 mb-4">

        {/* Delivered */}
        <button
          onClick={handleDeliver}
          disabled={status === "Delivered"}
          className="flex flex-col items-center gap-1.5 py-[14px] rounded-[14px]
                     bg-[rgba(52,199,89,0.1)] border border-[rgba(52,199,89,0.3)]
                     text-[#34c759] text-[0.72rem] font-semibold
                     hover:bg-[rgba(52,199,89,0.18)] active:scale-95 transition-all
                     disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Delivered
        </button>

        {/* Edit */}
        <Link
          href={`/logistics/${shipment.id}?modal=edit`}
          className="flex flex-col items-center gap-1.5 py-[14px] rounded-[14px]
                     bg-[var(--accent-1)]/70 border border-[var(--accent-1)]
                     text-[var(--accent-2)] text-[0.72rem] font-semibold
                     hover:bg-[var(--accent-1)]/25 active:scale-95 transition-all
                     no-underline touch-manipulation"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z"/>
          </svg>
          Edit
        </Link>

        {/* Delete */}
        <button
          onClick={handleDelete}
          className="flex flex-col items-center gap-1.5 py-[14px] rounded-[14px]
                     bg-[rgba(255,59,48,0.1)] border border-[rgba(255,59,48,0.3)]
                     text-[#ff3b30] text-[0.72rem] font-semibold
                     hover:bg-[rgba(255,59,48,0.18)] active:scale-95 transition-all touch-manipulation"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          Delete
        </button>
      </div>

      {/* Tracking timeline */}
      <div className="bg-[var(--card-bg)] rounded-[16px] p-5">
        <div className="flex items-center gap-2 mb-5">
          <svg className="w-4 h-4 text-[var(--accent-1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4-4.5-7-8.3-7-11a7 7 0 1114 0c0 2.7-3 6.5-7 11z"/>
            <circle cx="12" cy="10" r="2.5" fill="currentColor" strokeWidth="0"/>
          </svg>
          <span className="text-[0.82rem] font-semibold text-white tracking-wide">Tracking Timeline</span>
        </div>

        <ol>
          {TIMELINE_STEPS.map((step, i) => {
            const done    = i <= currentIdx;
            const current = i === currentIdx;

            return (
              <li key={step} className="flex items-start gap-3 pb-4 last:pb-0">
                <div className="flex flex-col items-center">
                  <span
                    className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 transition-colors ${
                      current ? "bg-[var(--accent-2)] ring-2 ring-[var(--accent-2)]"
                      : done   ? "bg-[var(--accent-1)]"
                      :          "bg-[var(--accent-2)]/10"
                    }`}
                  />
                  {i < TIMELINE_STEPS.length - 1 && (
                    <span className={`w-px flex-1 mt-1 min-h-[20px] ${done ? "bg-[var(--accent-1)]" : "bg-[var(--accent-2)]/10"}`} />
                  )}
                </div>
                <span
                  className={`text-[0.85rem] leading-tight pt-[1px] ${
                    current ? "text-white font-semibold"
                    : done   ? "text-[var(--accent-2)/10]"
                    :          "text-[var(--accent-2)/10]"
                  }`}
                >
                  {step}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
