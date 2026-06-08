"use client";

import Link from "next/link";
import { use, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

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
  { id: 1, name: "Baseball Caps", category: "Accessories", sku: "FTZ_102", description: "Classic baseball cap", costPrice: 10, sellPrice: 23.00, stock: 0, minStock: 5 },
  { id: 2, name: "White Denim Jacket", category: "Pants", sku: "FTZ-0012", description: "White denim jacket", costPrice: 25, sellPrice: 55.00, stock: 200, minStock: 10 },
  { id: 3, name: "Black Chinos", category: "Pants", sku: "FTZ-003", description: "Slim fit black chinos", costPrice: 20, sellPrice: 49.99, stock: 22, minStock: 10 },
  { id: 4, name: "Hoodie Gray", category: "Hoodies", sku: "FTZ-006", description: "Gray pullover hoodie", costPrice: 30, sellPrice: 69.99, stock: 105, minStock: 10 },
  { id: 5, name: "White Polo Shirt", category: "Shirts", sku: "FTZ-002", description: "Classic white polo", costPrice: 15, sellPrice: 39.99, stock: 7, minStock: 10 },
  { id: 6, name: "Cargo Pants", category: "Pants", sku: "FTZ-005", description: "Multi-pocket cargo pants", costPrice: 22, sellPrice: 49.99, stock: 18, minStock: 10 },
  { id: 7, name: "Red Hoodie", category: "Hoodies", sku: "FTZ-009", description: "Red zip-up hoodie", costPrice: 25, sellPrice: 54.99, stock: 14, minStock: 10 },
  { id: 8, name: "Blue Denim Jacket", category: "Jackets", sku: "FTZ-011", description: "Classic blue denim jacket", costPrice: 28, sellPrice: 59.99, stock: 30, minStock: 10 },
];

const CATEGORIES = ["Accessories", "Pants", "Hoodies", "Shirts", "Jackets"];

// SVG arrow kept as a style prop — data URLs with quotes/special chars break PostCSS when used inside Tailwind arbitrary values
const selectArrowStyle: React.CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238888a0' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
};

type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

function getStatus(stock: number, minStock: number): StockStatus {
  if (stock === 0) return "Out of Stock";
  if (stock <= minStock) return "Low Stock";
  return "In Stock";
}

function statusBadgeClass(status: StockStatus) {
  if (status === "In Stock") return "bg-[rgba(52,199,89,0.15)] text-[#34c759] border border-[#34c759]";
  if (status === "Low Stock") return "bg-[rgba(255,159,10,0.15)] text-[#ff9f0a] border border-[#ff9f0a]";
  return "bg-[rgba(255,59,48,0.15)] text-[#ff3b30] border border-[#ff3b30]";
}

const inputClass = "w-full bg-[#13131a] border border-[#2a2a3a] rounded-[10px] px-4 py-3 text-white text-[0.88rem] outline-none box-border";
const labelClass = "text-[#8888a0] text-[0.75rem] mb-[6px] block";
const sectionLabelClass = "text-[#8888a0] text-[0.7rem] font-bold tracking-widest mb-4 block uppercase";

export default function InventoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const showEdit = searchParams.get("modal") === "edit";
  const showConfirm = searchParams.get("modal") === "confirm";

  const product = initialProducts.find(p => p.id === Number(id));

  const [stock, setStock] = useState(product?.stock ?? 0);
  const [exactInput, setExactInput] = useState(false);
  const [exactVal, setExactVal] = useState("");
  const [editForm, setEditForm] = useState<Product | null>(null);
  const [profitMargin, setProfitMargin] = useState("0");

  useEffect(() => {
    if (showEdit && product) {
      setEditForm({ ...product, stock });
    }
  }, [showEdit]);

  useEffect(() => {
    if (editForm) {
      const margin = editForm.sellPrice > 0
        ? (((editForm.sellPrice - editForm.costPrice) / editForm.sellPrice) * 100).toFixed(1)
        : "0";
      setProfitMargin(margin);
    }
  }, [editForm?.costPrice, editForm?.sellPrice]);

  if (!product) {
    return (
      <div className="bg-[#13131a] min-h-screen flex flex-col items-center justify-center font-sans">
        <p className="text-[#8888a0] mb-4">Product not found.</p>
        <Link href="/inventory" className="text-[#7c3aed] no-underline">← Back to Inventory</Link>
      </div>
    );
  }

  const status = getStatus(stock, product.minStock);
  const margin = product.sellPrice > 0 ? (((product.sellPrice - product.costPrice) / product.sellPrice) * 100).toFixed(1) : "0";
  const totalValue = stock * product.sellPrice;

  function handleSaveEdit() {
    if (!editForm) return;
    setStock(editForm.stock);
    window.location.href = `/inventory/${id}`;
  }

  function handleRemove() {
    window.location.href = "/inventory";
  }

  function handleSetExact() {
    const val = parseInt(exactVal);
    if (!isNaN(val) && val >= 0) {
      setStock(val);
    }
    setExactInput(false);
    setExactVal("");
  }

  return (
    <div className="bg-[var(--background)] min-h-screen font-sans px-5 pt-5 pb-12">

      {/* Back */}
      <Link href="/inventory" className="flex items-center gap-1 text-[#8888a0] text-[0.88rem] no-underline mb-5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8888a0" strokeWidth="2" className="pointer-events-none">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back
      </Link>

      {/* Product Card */}
      <div className="bg-[var(--card-bg)] rounded-[16px] p-5 mb-4">
        <div className="flex items-center gap-4 mb-5">
          <div className="bg-[var(--accent-1)] rounded-[12px] w-[52px] h-[52px] flex items-center justify-center shrink-0 pointer-events-none">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" className="pointer-events-none">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h1 className="text-white text-[1.1rem] font-bold leading-tight">{product.name}</h1>
            <p className="text-[var(--muted)] text-[0.78rem] mt-[2px]">{product.category}</p>
            <p className="text-[var(--muted)] text-[0.75rem]">SKU: {product.sku}</p>
          </div>
        </div>

        {/* Edit / Remove */}
        <div className="flex gap-3">
          <Link
            href={`/inventory/${id}?modal=edit`}
            className="flex-1 bg-[var(--accent-1)] rounded-[12px] py-3 text-white font-semibold text-[0.88rem] flex items-center justify-center gap-2 no-underline touch-manipulation"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="pointer-events-none">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </Link>
          <Link
            href={`/inventory/${id}?modal=confirm`}
            className="flex-1 bg-[rgba(255,59,48,0.1)] border border-[rgba(255,59,48,0.4)] rounded-[12px] py-3 text-[#ff3b30] font-semibold text-[0.88rem] flex items-center justify-center gap-2 no-underline touch-manipulation"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" strokeWidth="2" className="pointer-events-none">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
            Remove
          </Link>
        </div>
      </div>

      {/* Stock Card */}
      <div className="bg-[var(--card-bg)] rounded-[16px] p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className={sectionLabelClass}>STOCK</span>
          <span className={`${statusBadgeClass(status)} text-[0.7rem] font-semibold px-3 py-1 rounded-full`}>
            {status}
          </span>
        </div>

        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="text-white text-[2.5rem] font-bold leading-none">{stock}</div>
            <div className="text-[var(--accent-2)] text-[0.75rem] mt-1">Min alert: {product.minStock} units</div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setStock(s => Math.max(0, s - 1)); }}
              className="w-10 h-10 bg-[var(--btn-bg)] rounded-full flex items-center justify-center text-white text-lg font-bold no-underline touch-manipulation"
            >
              −
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setStock(s => s + 1); }}
              className="w-10 h-10 bg-[var(--accent-1)] rounded-full flex items-center justify-center text-white text-lg font-bold no-underline touch-manipulation"
            >
              +
            </a>
          </div>
        </div>

        {exactInput ? (
          <div className="flex gap-2 mt-4">
            <input
              type="number"
              value={exactVal}
              onChange={e => setExactVal(e.target.value)}
              placeholder="Enter quantity"
              className={`${inputClass} flex-1`}
            />
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleSetExact(); }}
              className="bg-[var(--accent-1)] text-white px-4 rounded-[10px] flex items-center justify-center text-[0.85rem] font-semibold no-underline touch-manipulation"
            >
              Set
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setExactInput(false); setExactVal(""); }}
              className="bg-[var(--btn-bg)] text-white px-4 rounded-[10px] flex items-center justify-center text-[0.85rem] no-underline touch-manipulation"
            >
              Cancel
            </a>
          </div>
        ) : (
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setExactInput(true); }}
            className="w-full mt-4 bg-[var(--btn-bg)] rounded-[10px] py-3 text-[var(--accent-2)] text-[0.85rem] font-medium flex items-center justify-center no-underline touch-manipulation"
          >
            Set Exact Quantity
          </a>
        )}
      </div>

      {/* Pricing Card */}
      <div className="bg-[var(--card-bg)] rounded-[16px] p-5">
        <span className={sectionLabelClass}>PRICING</span>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <div className="text-[var(--nuted)] text-[0.72rem] mb-1">Cost</div>
            <div className="text-white font-bold text-[1rem]">${product.costPrice.toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-[var(--nuted)] text-[0.72rem] mb-1">Sell</div>
            <div className="text-[var(--accent-1)] font-bold text-[1rem]">${product.sellPrice.toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-[var(--muted)] text-[0.72rem] mb-1">Margin</div>
            <div className="text-[#34c759] font-bold text-[1rem]">{margin}%</div>
          </div>
        </div>

        <div className="border-t border-[#2a2a3a] pt-4 flex justify-between items-center">
          <span className="text-[--muted] text-[0.85rem]">Total Inventory Value</span>
          <span className="text-white font-bold text-[0.95rem]">${totalValue.toFixed(2)}</span>
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && editForm && (
        <div className="fixed inset-0 bg-[var(--background)] z-[100] overflow-y-auto font-sans">
          <div className="flex items-center justify-center relative px-5 pt-5 pb-4">
            <Link href={`/inventory/${id}`} className="absolute left-5 flex items-center gap-1 text-[#8888a0] text-[0.85rem] no-underline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8888a0" strokeWidth="2" className="pointer-events-none">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back
            </Link>
            <h2 className="text-white text-[1.05rem] font-bold">Edit Product</h2>
          </div>

          {/* PRODUCT INFO */}
          <div className="mx-5 mb-4 bg-[var(--card-bg)] rounded-[16px] p-5 flex flex-col gap-4">
            <span className={sectionLabelClass}>PRODUCT INFO</span>

            <div>
              <label className={labelClass}>Product Name <span className="text-[#ff3b30]">*</span></label>
              <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f!, name: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>SKU <span className="text-[#ff3b30]">*</span></label>
              <input value={editForm.sku} onChange={e => setEditForm(f => ({ ...f!, sku: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <input value={editForm.description} placeholder="Short description (optional)" onChange={e => setEditForm(f => ({ ...f!, description: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={editForm.category}
                onChange={e => setEditForm(f => ({ ...f!, category: e.target.value }))}
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
                <input type="number" value={editForm.stock} onChange={e => setEditForm(f => ({ ...f!, stock: Number(e.target.value) }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Min Stock Alert</label>
                <input type="number" value={editForm.minStock} onChange={e => setEditForm(f => ({ ...f!, minStock: Number(e.target.value) }))} className={inputClass} />
              </div>
            </div>
          </div>

          {/* PRICING */}
          <div className="mx-5 mb-4 bg-[var(--card-bg)] rounded-[16px] p-5">
            <span className={sectionLabelClass}>PRICING</span>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>Cost Price ($)</label>
                <input type="number" value={editForm.costPrice} onChange={e => setEditForm(f => ({ ...f!, costPrice: Number(e.target.value) }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Sell Price ($)</label>
                <input type="number" value={editForm.sellPrice} onChange={e => setEditForm(f => ({ ...f!, sellPrice: Number(e.target.value) }))} className={inputClass} />
              </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-[#2a2a3a]">
              <span className="text-[#var(--muted)] text-[0.82rem]">Profit Margin</span>
              <span className="text-[#34c759] font-bold text-[0.88rem]">{profitMargin}%</span>
            </div>
          </div>

          <div className="px-5 pb-10">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleSaveEdit(); }}
              className="w-full bg-[var(--accent-1)] text-white rounded-[14px] py-4 font-bold text-base flex items-center justify-center no-underline touch-manipulation"
            >
              Save Product
            </a>
          </div>
        </div>
      )}

      {/* Confirm Remove Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 z-[200] flex items-end justify-center">
          <div className="bg-[var(--card-bg)] rounded-t-[20px] px-5 pt-6 pb-10 w-full max-w-[480px]">
            <h3 className="text-white text-[1.05rem] font-bold text-center mb-2">Remove Product?</h3>
            <p className="text-[var(--muted)] text-[0.85rem] text-center mb-6">
              This will permanently remove <span className="text-white">{product.name}</span> from inventory.
            </p>
            <div className="flex gap-3">
              <Link
                href={`/inventory/${id}`}
                className="flex-1 bg-[var(--btn-bg)] rounded-[12px] py-[0.85rem] text-white font-semibold text-[0.9rem] flex items-center justify-center no-underline touch-manipulation"
              >
                Cancel
              </Link>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleRemove(); }}
                className="flex-1 bg-[#ff3b30] rounded-[12px] py-[0.85rem] text-white font-semibold text-[0.9rem] flex items-center justify-center no-underline touch-manipulation"
              >
                Remove
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
