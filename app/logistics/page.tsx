"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

type ShipStatus = "Processing" | "Dispatched" | "Delivered" | "Cancelled";

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

const initialShipments: Shipment[] = [
  { id: "SHP-884", supplier: "TextileCo Ltd", items: 3, carrier: "J&T Express", eta: "Mar 9, 2026", shipDate: "Mar 5, 2026", tracking: "TC123456X", status: "Dispatched" },
  { id: "SHP-883", supplier: "FabricHub Inc", items: 7, carrier: "Lalamove", eta: "Mar 7, 2026", shipDate: "Mar 3, 2026", tracking: "LM789012Y", status: "Delivered" },
  { id: "SHP-882", supplier: "WeaveCraft Co", items: 2, carrier: "J&T Express", eta: "Mar 14, 2026", shipDate: "Mar 10, 2026", tracking: "TC345678Z", status: "Processing" },
  { id: "SHP-881", supplier: "TextileCo Ltd", items: 5, carrier: "Ninja Van", eta: "Mar 4, 2026", shipDate: "Mar 1, 2026", tracking: "NV567890A", status: "Delivered" },
  { id: "SHP-880", supplier: "GlobalFabrics", items: 4, carrier: "Lalamove", eta: "Mar 16, 2026", shipDate: "Mar 12, 2026", tracking: "LM234567B", status: "Processing" },
];

const CARRIERS = ["J&T Express", "Lalamove", "Ninja Van", "DHL", "FedEx"];
const STATUSES: ShipStatus[] = ["Processing", "Dispatched", "Delivered", "Cancelled"];

function statusClasses(status: ShipStatus) {
  if (status === "Delivered") return "bg-[rgba(52,199,89,0.15)] text-[#34c759] border border-[#34c759]";
  if (status === "Dispatched") return "bg-[rgba(10,132,255,0.15)] text-[#0a84ff] border border-[#0a84ff]";
  if (status === "Processing") return "bg-[rgba(255,159,10,0.15)] text-[#ff9f0a] border border-[#ff9f0a]";
  return "bg-[rgba(255,59,48,0.15)] text-[#ff3b30] border border-[#ff3b30]";
}

function statusIcon(status: ShipStatus) {
  if (status === "Delivered") return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="pointer-events-none">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
  if (status === "Dispatched") return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none">
      <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  );
  return null;
}

const inputClass = "w-full bg-[var(--card-bg)] border border-[var(--accent-1)] rounded-[10px] px-4 py-3 text-white text-[0.88rem] outline-none box-border placeholder-[#555566]";
const labelClass = "text-[var(--accent-2)] text-[0.78rem] mb-[6px] block";
const selectBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238888a0' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`;

const emptyForm = {
  supplier: "", items: "", shipDate: "", eta: "",
  tracking: "", status: "Processing" as ShipStatus, carrier: "J&T Express",
};

export default function LogisticsPage() {
  const searchParams = useSearchParams();
  const showModal = searchParams.get("modal") === "add";

  const [search, setSearch] = useState("");
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState<Partial<typeof emptyForm>>({});
  const [syncing, setSyncing] = useState(false);
        function handleSync() {
        setSyncing(true);
        setTimeout(() => setSyncing(false), 2000);
      }

  const filtered = shipments.filter(s =>
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.supplier.toLowerCase().includes(search.toLowerCase()) ||
    s.carrier.toLowerCase().includes(search.toLowerCase())
  );

  const inTransit = shipments.filter(s => s.status === "Dispatched" || s.status === "Processing").length;

  function validate() {
    const errs: Partial<typeof emptyForm> = {};
    if (!form.supplier.trim()) errs.supplier = "Required";
    if (!form.items.trim()) errs.items = "Required";
    if (!form.shipDate.trim()) errs.shipDate = "Required";
    if (!form.eta.trim()) errs.eta = "Required";
    return errs;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const newId = `SHP-${900 + shipments.length}`;
    setShipments(prev => [{
      id: newId,
      supplier: form.supplier.trim(),
      items: parseInt(form.items) || 0,
      carrier: form.carrier,
      eta: form.eta.trim(),
      shipDate: form.shipDate.trim(),
      tracking: form.tracking.trim(),
      status: form.status,
    }, ...prev]);
    setForm({ ...emptyForm });
    setErrors({});
    window.location.href = "/logistics";
  }

  function Field({ name, label, placeholder, type = "text" }: {
    name: keyof typeof emptyForm; label: string; placeholder: string; type?: string;
  }) {
    return (
      <div>
        <label className={labelClass}>{label}</label>
        <input
          type={type}
          placeholder={placeholder}
          value={form[name] as string}
          onChange={e => { setForm(f => ({ ...f, [name]: e.target.value })); setErrors(er => ({ ...er, [name]: undefined })); }}
          className={`${inputClass} ${errors[name] ? "border-[#ff3b30]" : ""}`}
        />
        {errors[name] && <p className="text-[#ff3b30] text-[0.72rem] mt-1">{errors[name]}</p>}
      </div>
    );
  }

  return (
    <div className="bg-[var(--background)] min-h-screen font-sans px-5 pt-6 pb-12 overflow-x-hidden">

      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="text-white text-[1.5rem] font-bold mb-[2px]">Logistics</h1>
          <p className="text-[var(--muted)] text-[0.82rem]">Shipments &amp; supply chain</p>
        </div>
        <div className="flex gap-2 items-center">
          
          <Link
            href="?modal=add"
            className="bg-[var(--accent-1)] rounded-[10px] w-10 h-10 flex items-center justify-center no-underline touch-manipulation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="pointer-events-none">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[var(--card-bg)] rounded-[12px] p-4">
          <div className="text-white text-[2rem] font-bold leading-none mb-1">{shipments.length}</div>
          <div className="text-[#8888a0] text-[0.78rem]">Total Shipments</div>
        </div>
        <div className="bg-[var(--card-bg)] rounded-[12px] p-4">
          <div className="text-[var(--accent-1)] text-[2rem] font-bold leading-none mb-1">{inTransit}</div>
          <div className="text-[#8888a0] text-[0.78rem]">In Transit</div>
        </div>
      </div>

     

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search shipments..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={`${inputClass} pl-10`}
        />
      </div>

      {/* Shipment List */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="text-[#8888a0] text-center mt-8">No shipments found.</p>
        ) : filtered.map(s => (
          <Link
            key={s.id}
            href={`/logistics/${s.id}`}
            className="bg-[var(--card-bg)] rounded-[12px] px-4 py-4 flex items-center gap-3 no-underline touch-manipulation active:scale-95 transition-transform"
          >
            <div className="bg-[var(--accent-1)] rounded-[10px] w-[42px] h-[42px] flex items-center justify-center shrink-0 pointer-events-none">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" strokeWidth="1.8" className="pointer-events-none">
                <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-[0.92rem]">#{s.id}</div>
              <div className="text-[#8888a0] text-[0.72rem]">{s.supplier} · {s.items} items</div>
              <div className="text-[#8888a0] text-[0.72rem]">{s.carrier} · ETA: {s.eta}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`${statusClasses(s.status)} text-[0.68rem] font-semibold px-[8px] py-[3px] rounded-full flex items-center gap-1`}>
                {statusIcon(s.status)}
                {s.status}
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555566" strokeWidth="2" className="pointer-events-none">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Add Shipment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[var(--background)] z-[100] overflow-y-auto font-sans">
          <div className="flex items-center justify-center relative px-5 pt-5 pb-4">
            <Link
              href="/logistics"
              className="absolute left-5 flex items-center gap-1 text-[var(--accent-2)] text-[0.85rem] no-underline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2" className="pointer-events-none">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back
            </Link>
            <h2 className="text-white text-[1.05rem] font-bold">Add Shipment</h2>
          </div>

          <div className="mx-5 mb-4 bg-[var(--card-bg)] rounded-[16px] p-5 flex flex-col gap-4">
            <Field name="supplier" label="Supplier" placeholder="e.g. TextileCo Ltd" />
            <Field name="items" label="No. of Items" placeholder="e.g. 5" type="number" />
            <Field name="shipDate" label="Ship Date" placeholder="e.g. Mar 7, 2026" />
            <Field name="eta" label="ETA" placeholder="e.g. Mar 12, 2026" />
            <Field name="tracking" label="Tracking #" placeholder="e.g. TC123456X" />
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as ShipStatus }))}
                className={`${inputClass} appearance-none`}
                style={{ backgroundImage: selectBg, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Carrier</label>
              <select
                value={form.carrier}
                onChange={e => setForm(f => ({ ...f, carrier: e.target.value }))}
                className={`${inputClass} appearance-none`}
                style={{ backgroundImage: selectBg, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
              >
                {CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="px-5 pb-10">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleSave(); }}
              className="w-full bg-[var(--accent-1)] text-white rounded-[14px] py-4 font-bold text-base flex items-center justify-center no-underline touch-manipulation"
            >
              Save Shipment
            </a>
          </div>
        </div>
      )}

    </div>
  );
}