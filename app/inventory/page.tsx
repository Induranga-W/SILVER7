"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

type Product = {
  id: number;
  name: string;
  category: string;
  sku: string;
  description: string;
  costPrice: number;
  sellPrice: number;
  stock: number;
  minStock: number;
};

const initialProducts: Product[] = [
  { id: 1, name: "Baseball Caps", category: "Accessories", sku: "FTZ_102", description: "", costPrice: 10, sellPrice: 23.00, stock: 0, minStock: 5 },
  { id: 2, name: "White Denim Jacket", category: "Pants", sku: "FTZ-0012", description: "", costPrice: 25, sellPrice: 55.00, stock: 200, minStock: 10 },
  { id: 3, name: "Black Chinos", category: "Pants", sku: "FTZ-003", description: "", costPrice: 20, sellPrice: 49.99, stock: 22, minStock: 10 },
  { id: 4, name: "Hoodie Gray", category: "Hoodies", sku: "FTZ-006", description: "", costPrice: 30, sellPrice: 69.99, stock: 105, minStock: 10 },
  { id: 5, name: "White Polo Shirt", category: "Shirts", sku: "FTZ-002", description: "", costPrice: 15, sellPrice: 39.99, stock: 7, minStock: 10 },
  { id: 6, name: "Cargo Pants", category: "Pants", sku: "FTZ-005", description: "", costPrice: 22, sellPrice: 49.99, stock: 18, minStock: 10 },
  { id: 7, name: "Red Hoodie", category: "Hoodies", sku: "FTZ-009", description: "", costPrice: 25, sellPrice: 54.99, stock: 14, minStock: 10 },
  { id: 8, name: "Blue Denim Jacket", category: "Jackets", sku: "FTZ-011", description: "", costPrice: 28, sellPrice: 59.99, stock: 30, minStock: 10 },
];

const CATEGORIES = ["Accessories", "Pants", "Hoodies", "Shirts", "Jackets"];

// SVG arrow kept as a style prop — data URLs with quotes/special chars break PostCSS when used inside Tailwind arbitrary values
const selectArrowStyle: React.CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238888a0' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
};

function getStatus(stock: number, minStock: number): StockStatus {
  if (stock === 0) return "Out of Stock";
  if (stock <= minStock) return "Low Stock";
  return "In Stock";
}

function stockBadgeClass(status: StockStatus) {
  if (status === "In Stock") return "bg-[rgba(52,199,89,0.15)] text-[#34c759]";
  if (status === "Low Stock") return "bg-[rgba(255,159,10,0.15)] text-[#ff9f0a]";
  return "bg-[rgba(255,59,48,0.15)] text-[#ff3b30]";
}

const inputClass = "w-full bg-[var(--card-bg)] border border-[var(--accent-1)] rounded-[10px] px-4 py-3 text-white text-[0.88rem] outline-none box-border";
const labelClass = "text-[var(--muted)] text-[0.75rem] mb-[6px] block";
const sectionLabelClass = "text-[var(--muted)] text-[0.7rem] font-bold tracking-[1px] mb-4 block";

const emptyForm = {
  name: "", sku: "", description: "", category: "Shirts",
  stock: "0", minStock: "5", costPrice: "0.00", sellPrice: "0.00",
};

export default function InventoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showModal = searchParams.get("modal") === "add";
  const showFilter = searchParams.get("filter") === "true";

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState<StockStatus | "All">("All");
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState<Partial<typeof emptyForm>>({});

  const totalValue = products.reduce((sum, p) => sum + p.sellPrice * p.stock, 0);
  const lowStock = products.filter(p => getStatus(p.stock, p.minStock) === "Low Stock").length;
  const outStock = products.filter(p => getStatus(p.stock, p.minStock) === "Out of Stock").length;

  const filtered = products.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "All" || p.category === filterCategory;
    const matchStatus = filterStatus === "All" || getStatus(p.stock, p.minStock) === filterStatus;
    return matchSearch && matchCategory && matchStatus;
  });

  function validate() {
    const errs: Partial<typeof emptyForm> = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.sku.trim()) errs.sku = "Required";
    if (isNaN(Number(form.stock))) errs.stock = "Enter a valid number";
    if (isNaN(Number(form.costPrice))) errs.costPrice = "Enter a valid price";
    if (isNaN(Number(form.sellPrice))) errs.sellPrice = "Enter a valid price";
    return errs;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setProducts(prev => [...prev, {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      sku: form.sku.trim(),
      description: form.description.trim(),
      costPrice: parseFloat(form.costPrice) || 0,
      sellPrice: parseFloat(form.sellPrice) || 0,
      stock: parseInt(form.stock) || 0,
      minStock: parseInt(form.minStock) || 5,
    }]);
    router.push("/inventory");
    setForm({ ...emptyForm });
    setErrors({});
  }

  function Field({ name, label, placeholder, type = "text", required = false }: {
    name: keyof typeof emptyForm; label: string; placeholder: string; type?: string; required?: boolean;
  }) {
    return (
      <div>
        <label className={labelClass}>
          {label}{required && <span className="text-[#ff3b30]"> *</span>}
        </label>
        <input
          type={type}
          placeholder={placeholder}
          value={form[name]}
          onChange={e => { setForm(f => ({ ...f, [name]: e.target.value })); setErrors(er => ({ ...er, [name]: undefined })); }}
          className={`${inputClass} ${errors[name] ? "border-[#ff3b30]" : "border-[#2a2a3a]"}`}
        />
        {errors[name] && <p className="text-[#ff3b30] text-[0.72rem] mt-1 ml-[2px]">{errors[name]}</p>}
      </div>
    );
  }

  function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        className={`border rounded-full px-[14px] py-[5px] text-[0.78rem] cursor-pointer transition-colors ${
          active
            ? "bg-[var(--accent-1)] border-[var(--accent-1)] text-white font-semibold"
            : "bg-transparent border-[var(--border)] text-[var(--muted)] font-normal"
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="bg-[var(--background)] min-h-screen font-sans px-5 pt-6 pb-12 overflow-x-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="text-white text-[1.5rem] font-bold mb-[0.2rem]">Inventory</h1>
          <p className="text-[var(--accent-1)] text-[0.82rem]">{products.length} products</p>
        </div>
        <div className="flex gap-[0.6rem] relative z-50">
          <Link
            href={showFilter ? "/inventory" : "?filter=true"}
            className={`border rounded-[10px] w-12 h-12 flex items-center justify-center cursor-pointer transition-colors select-none touch-manipulation ${
              showFilter
                ? "bg-[var(--accent-1)] border-[var(--accent-1)]"
                : "bg-[var(--card-bg)] border-[var(--border)]"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={showFilter ? "#fff" : "var(--muted)"} strokeWidth="2" className="pointer-events-none">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="12" y1="17" x2="12" y2="17" strokeLinecap="round" strokeWidth="3"/>
            </svg>
          </Link>
          <Link
            href="?modal=add"
            className="bg-[var(--accent-1)] rounded-[10px] w-12 h-12 flex items-center justify-center cursor-pointer select-none touch-manipulation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="pointer-events-none">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-[0.6rem] mb-5">
        {[
          { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>, value: products.length.toString(), label: "Products", color: "text-[var(--accent-2)]" },
          { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34c759" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, value: `$${(totalValue / 1000).toFixed(1)}K`, label: "Value", color: "text-[#34c759]" },
          { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff9f0a" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, value: lowStock.toString(), label: "Low Stock", color: "text-[#ff9f0a]" },
          { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, value: outStock.toString(), label: "Out Stock", color: "text-[#ff3b30]" },
        ].map(card => (
          <div key={card.label} className="bg-[var(--card-bg)] rounded-[12px] px-[0.6rem] py-[0.8rem] flex flex-col items-center gap-1">
            {card.icon}
            <div className={`${card.color} text-[1.1rem] font-bold`}>{card.value}</div>
            <div className="text-[var(--muted)] text-[0.65rem] text-center">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search by name, SKU or category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={`${inputClass} pl-10`}
        />
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="bg-[var(--background)] rounded-[14px] p-5 mb-4">
          <h3 className="text-white font-bold text-[0.95rem] mb-4">Filters</h3>
          <div className="mb-4">
            <p className="text-[var(--accent-1)] text-[0.78rem] mb-[0.6rem]">Category</p>
            <div className="flex flex-wrap gap-2">
              <Pill label="All" active={filterCategory === "All"} onClick={() => setFilterCategory("All")} />
              {CATEGORIES.map(c => <Pill key={c} label={c} active={filterCategory === c} onClick={() => setFilterCategory(c)} />)}
            </div>
          </div>
          <div>
            <p className="text-[#8888a0] text-[0.78rem] mb-[0.6rem]">Stock Status</p>
            <div className="flex flex-wrap gap-2">
              {(["All", "In Stock", "Low Stock", "Out of Stock"] as const).map(s =>
                <Pill key={s} label={s} active={filterStatus === s} onClick={() => setFilterStatus(s)} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="flex flex-col gap-[0.6rem]">
        {filtered.length === 0
          ? <p className="text-[#8888a0] text-center mt-8">No products found.</p>
          : filtered.map(p => {
            const status = getStatus(p.stock, p.minStock);
            return (
              <Link
                key={p.id}
                href={`/inventory/${p.id}`}
                className="bg-[var(--card-bg)] rounded-[12px] px-5 py-4 flex items-center justify-between cursor-pointer active:scale-95 transition-transform no-underline touch-manipulation"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[var(--accent-1)] rounded-[10px] w-[42px] h-[42px] flex items-center justify-center shrink-0 pointer-events-none">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" strokeWidth="2" className="pointer-events-none">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-[0.95rem]">{p.name}</div>
                    <div className="text-[var(--muted)] text-[0.75rem]">{p.category} · {p.sku}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-[0.95rem] mb-1">${p.sellPrice.toFixed(2)}</div>
                  <span className={`${stockBadgeClass(status)} text-[0.65rem] font-semibold px-2 py-[2px] rounded-full`}>
                    {p.stock} · {status}
                  </span>
                </div>
              </Link>
            );
          })}
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[var(--background)] z-[100] overflow-y-auto font-sans">

          {/* Top Bar */}
          <div className="flex items-center justify-center relative px-5 pt-5 pb-4">
            <button
              type="button"
              onClick={() => { router.push("/inventory"); setForm({ ...emptyForm }); setErrors({}); }}
              className="absolute left-5 bg-transparent border-none cursor-pointer flex items-center gap-1 text-[var(--accent-1)] text-[0.85rem] p-0"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back
            </button>
            <h2 className="text-white text-[1.05rem] font-bold">Add Product</h2>
          </div>

          {/* PRODUCT INFO */}
          <div className="mx-5 mb-4 bg-[var(--card-bg)] rounded-[16px] p-5 flex flex-col gap-4">
            <span className={sectionLabelClass}>PRODUCT INFO</span>
            <Field name="name" label="Product Name" placeholder="e.g. Blue Denim Jacket" required />
            <Field name="sku" label="SKU" placeholder="e.g. FTZ-007" required />
            <Field name="description" label="Description" placeholder="Short description (optional)" />
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className={`${inputClass} appearance-none`}
                style={selectArrowStyle}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* STOCK */}
          <div className="mx-5 mb-4 bg-[var(--card-bg)] rounded-[16px] p-5">
            <span className={sectionLabelClass}>STOCK</span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Stock Qty</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={e => { setForm(f => ({ ...f, stock: e.target.value })); setErrors(er => ({ ...er, stock: undefined })); }}
                  className={`${inputClass} ${errors.stock ? "border-[#ff3b30]" : "border-[var(--border)]"}`}
                />
                {errors.stock && <p className="text-[#ff3b30] text-[0.72rem] mt-1">{errors.stock}</p>}
              </div>
              <div>
                <label className={labelClass}>Min Stock Alert</label>
                <input
                  type="number"
                  value={form.minStock}
                  onChange={e => setForm(f => ({ ...f, minStock: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* PRICING */}
          <div className="mx-5 mb-4 bg-[var(--card-bg)] rounded-[16px] p-5">
            <span className={sectionLabelClass}>PRICING</span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Cost Price ($)</label>
                <input
                  type="number"
                  value={form.costPrice}
                  onChange={e => { setForm(f => ({ ...f, costPrice: e.target.value })); setErrors(er => ({ ...er, costPrice: undefined })); }}
                  className={`${inputClass} ${errors.costPrice ? "border-[#ff3b30]" : "border-[var(--border)]"}`}
                />
                {errors.costPrice && <p className="text-[#ff3b30] text-[0.72rem] mt-1">{errors.costPrice}</p>}
              </div>
              <div>
                <label className={labelClass}>Sell Price ($)</label>
                <input
                  type="number"
                  value={form.sellPrice}
                  onChange={e => { setForm(f => ({ ...f, sellPrice: e.target.value })); setErrors(er => ({ ...er, sellPrice: undefined })); }}
                  className={`${inputClass} ${errors.sellPrice ? "border-[#ff3b30]" : "border-[var(--border)]"}`}
                />
                {errors.sellPrice && <p className="text-[#ff3b30] text-[0.72rem] mt-1">{errors.sellPrice}</p>}
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="px-5 pb-10">
            <button
              onClick={handleSave}
              className="w-full bg-[var(--accent-1)] text-white border-none rounded-[14px] py-4 font-bold text-base cursor-pointer"
            >
              Save Product
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
