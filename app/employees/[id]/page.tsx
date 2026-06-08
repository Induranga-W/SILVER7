"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { employeesData } from "@/lib/employees";
import Link from "next/link";

type Employee = {
  id: number;
  name: string;
  role: string;
  status: "Active" | "On Leave" | "Inactive";
  phone?: string;
  email?: string;
  hours?: string;
  memberSince?: string;
  schedule?: Record<string, string>;
};

const ROLES = ["Store Manager", "Sales Associate", "Warehouse Staff", "Cashier", "Supervisor", "Security"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEFAULT_SCHEDULE: Record<string, string> = { Mon: "9:00 AM – 5:00 PM", Tue: "9:00 AM – 5:00 PM", Wed: "9:00 AM – 5:00 PM", Thu: "9:00 AM – 5:00 PM", Fri: "9:00 AM – 5:00 PM", Sat: "Off", Sun: "Off" };

function statusClasses(status: string) {
  if (status === "Active") return "bg-[rgba(52,199,89,0.15)] text-[#34c759] border border-[#34c759]";
  if (status === "On Leave") return "bg-[rgba(255,159,10,0.15)] text-[#ff9f0a] border border-[#ff9f0a]";
  return "bg-[rgba(255,59,48,0.15)] text-[#ff3b30] border border-[#ff3b30]";
}

const inputClass = "w-full bg-[var(--card-bg)] border border-[var(--border)] rounded-[10px] px-4 py-3 text-white text-[0.88rem] outline-none box-border";
const labelClass = "text-[var(--accent-1)] text-[0.75rem] mb-[6px] block";
const selectBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238888a0' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`;

export default function EmployeeDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = Number(params?.id);

  const showEdit = searchParams.get("modal") === "edit";
  const showConfirmRemove = searchParams.get("modal") === "confirm";

  const [employees, setEmployees] = useState<Employee[]>(employeesData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const employee = employees.find(e => e.id === id);

  const [editForm, setEditForm] = useState<Employee | null>(
    () => employee ? { ...employee, schedule: { ...(employee.schedule ?? {}) } } : null
  );

  useEffect(() => {
    if (showEdit && employee) {
      setEditForm({ ...employee, schedule: { ...(employee.schedule ?? {}) } });
      setErrors({});
    }
  }, [showEdit]);

  if (!employee) {
    return (
      <div className="bg-[var(--background)] min-h-screen flex items-center justify-center font-sans">
        <div className="text-center">
          <p className="text-[var(--accent-2)] mb-4">Employee not found.</p>
          <Link href="/employees" className="text-[var(--accent-1)] no-underline text-[0.9rem]">
            ← Back to Employees
          </Link>
        </div>
      </div>
    );
  }

  function validateEdit() {
    const errs: Record<string, string> = {};
    if (!editForm!.name.trim()) errs.name = "Required";
    if (!editForm!.phone?.trim()) errs.phone = "Required";
    if (!editForm!.email?.trim()) errs.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(editForm!.email!)) errs.email = "Invalid email";
    return errs;
  }

  function handleSaveEdit() {
    const errs = validateEdit();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setEmployees(prev => prev.map(e => e.id === editForm!.id ? { ...editForm! } : e));
    window.location.href = `/employees/${id}`;
  }

  function handleRemove() {
    setEmployees(prev => prev.filter(e => e.id !== id));
    window.location.href = "/employees";
  }

  const schedule = employee.schedule ?? DEFAULT_SCHEDULE;

  return (
    <div className="bg-[var(--background)] min-h-screen font-sans px-5 pt-5 pb-12">

      {/* Back */}
      <Link href="/employees" className="flex items-center gap-1 text-[var(--accent-2)] text-[0.88rem] pb-5 mb-1 no-underline">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </Link>

      {/* Profile Card */}
      <div className="bg-[var(--card-bg)] rounded-[16px] px-5 pt-6 pb-5 mb-4 text-center">
        <div className="bg-[var(--accent-1)] rounded-full w-[72px] h-[72px] flex items-center justify-center mx-auto mb-4 border-2 border-[var(--accent-2)]">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" strokeWidth="1.8">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h1 className="text-white text-[1.2rem] font-bold mb-[0.2rem]">{employee.name}</h1>
        <p className="text-[var(--accent-1)] text-[0.85rem] mb-3">{employee.role}</p>
        <span className={`${statusClasses(employee.status)} text-[0.75rem] font-semibold px-[14px] py-1 rounded-full inline-block mb-5`}>
          {employee.status}
        </span>

        {/* Edit / Remove */}
        <div className="flex gap-3">
          <Link href={`/employees/${id}?modal=edit`} className="flex-1 bg-[var(--accent-1)] rounded-[12px] py-3 text-white font-semibold text-[0.9rem] flex items-center justify-center gap-2 no-underline" style={{ touchAction: "manipulation" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ pointerEvents: "none" }}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </Link>
          <Link href={`/employees/${id}?modal=confirm`} className="flex-1 bg-[rgba(255,59,48,0.1)] border border-[rgba(255,59,48,0.3)] rounded-[12px] py-3 text-[#ff3b30] font-semibold text-[0.9rem] flex items-center justify-center gap-2 no-underline" style={{ touchAction: "manipulation" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" strokeWidth="2" style={{ pointerEvents: "none" }}>
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
            Remove
          </Link>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-[var(--card-bg)] rounded-[16px] p-5 mb-4">
        <h2 className="text-white text-base font-bold mb-4">Contact Info</h2>
        {[
          { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.05 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/></svg>, label: "Phone", value: employee.phone || "—" },
          { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label: "Email", value: employee.email || "—" },
          { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label: "Hours", value: employee.hours || "—" },
        ].map((item, i, arr) => (
          <div key={item.label}>
            <div className="flex items-center gap-3 py-[0.6rem]">
              <div className="shrink-0">{item.icon}</div>
              <div>
                <div className="text-[var(--accent-1)] text-[0.75rem]">{item.label}</div>
                <div className="text-white text-[0.9rem] font-medium">{item.value}</div>
              </div>
            </div>
            {i < arr.length - 1 && <div className="border-b border-[var(--border)]" />}
          </div>
        ))}
      </div>

      {/* Work Schedule */}
      <div className="bg-[var(--card-bg)] rounded-[16px] p-5">
        <h2 className="text-white text-base font-bold mb-4">Work Schedule</h2>
        {DAYS.map((day, i) => (
          <div key={day}>
            <div className="flex justify-between items-center py-[0.65rem]">
              <span className={`text-[0.9rem] ${schedule[day] === "Off" ? "text-[var(--muted)]" : "text-white"}`}>{day}</span>
              <span className={`text-[0.88rem] ${schedule[day] === "Off" ? "text-[var(--muted)]" : "text-[var(--accent-2)]"}`}>{schedule[day]}</span>
            </div>
            {i < DAYS.length - 1 && <div className="border-b border-[var(--border)]" />}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEdit && editForm && (
        <div className="fixed inset-0 bg-[var(--background)] z-[100] overflow-y-auto font-sans">
          <div className="flex items-center justify-center relative px-5 pt-5 pb-4">
            <Link href={`/employees/${id}`} className="absolute left-5 flex items-center gap-1 text-white text-[0.85rem] no-underline">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </Link>
            <h2 className="text-white text-[1.05rem] font-bold">Edit Employee</h2>
          </div>

          <div className="mx-5 mb-4 bg-[var(--card-bg)] rounded-[16px] p-5 flex flex-col gap-4">
            {(["name", "phone", "email", "hours", "memberSince"] as const).map(key => (
              <div key={key}>
                <label className={labelClass}>
                  {key === "memberSince" ? "Member Since" : key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type="text"
                  value={(editForm as Record<string, string>)[key] ?? ""}
                  onChange={e => { setEditForm(f => ({ ...f!, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: "" })); }}
                  className={`${inputClass} ${errors[key] ? "border-[#ff3b30]" : "border-[var(--border)]"}`}
                />
                {errors[key] && <p className="text-[#ff3b30] text-[0.72rem] mt-1 ml-[2px]">{errors[key]}</p>}
              </div>
            ))}
            <div>
              <label className={labelClass}>Role</label>
              <select value={editForm.role} onChange={e => setEditForm(f => ({ ...f!, role: e.target.value }))} className={`${inputClass} appearance-none`} style={{ backgroundImage: selectBg, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={editForm.status} onChange={e => setEditForm(f => ({ ...f!, status: e.target.value as Employee["status"] }))} className={`${inputClass} appearance-none`} style={{ backgroundImage: selectBg, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mx-5 mb-6 bg-[var(--card-bg)] rounded-[16px] p-5">
            <h3 className="text-white text-[0.95rem] font-bold mb-4">Work Schedule</h3>
            <div className="flex flex-col gap-3">
              {DAYS.map(day => (
                <div key={day} className="flex items-center gap-[10px]">
                  <span className="text-[var(--muted)] text-[0.82rem] w-8 shrink-0">{day}</span>
                  <input type="text" value={editForm.schedule?.[day] ?? "Off"} onChange={e => setEditForm(f => ({ ...f!, schedule: { ...f!.schedule, [day]: e.target.value } }))} className={`${inputClass} py-2 px-3 text-[0.82rem]`} />
                </div>
              ))}
            </div>
          </div>

          <div className="px-5 pb-10">
            <a href="#" onClick={(e) => { e.preventDefault(); handleSaveEdit(); }} className="w-full bg-[var(--accent-1)] text-white rounded-[14px] py-4 font-bold text-base flex items-center justify-center no-underline">
              Save Changes
            </a>
          </div>
        </div>
      )}

      {/* Confirm Remove Modal */}
      {showConfirmRemove && (
        <div className="fixed inset-0 bg-black/70 z-[200] flex items-end justify-center">
          <div className="bg-[var(--card-bg)] rounded-t-[20px] px-5 pt-6 pb-10 w-full max-w-[480px]">
            <h3 className="text-white text-[1.05rem] font-bold text-center mb-2">Remove Employee?</h3>
            <p className="text-[#8888a0] text-[0.85rem] text-center mb-6">
              This will permanently remove <span className="text-white">{employee.name}</span> from the system.
            </p>
            <div className="flex gap-3">
              <Link href={`/employees/${id}`} className="flex-1 bg-[var(--card-bg)] border border-[var(--border)] rounded-[12px] py-[0.85rem] text-white font-semibold text-[0.9rem] flex items-center justify-center no-underline">
                Cancel
              </Link>
              <a href="#" onClick={(e) => { e.preventDefault(); handleRemove(); }} className="flex-1 bg-[#ff3b30] rounded-[12px] py-[0.85rem] text-white font-semibold text-[0.9rem] flex items-center justify-center no-underline">
                Remove
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
