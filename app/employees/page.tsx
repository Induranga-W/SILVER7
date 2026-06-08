"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Employee = {
  id: number;
  name: string;
  role: string;
  status: "Active" | "On Leave" | "Inactive";
  phone?: string;
  email?: string;
  hours?: string;
  memberSince?: string;
};

const initialEmployees: Employee[] = [
  { id: 1, name: "James Carter", role: "Store Manager", status: "Active", phone: "+1 555-0001", email: "james@fitz.com", hours: "40h/wk", memberSince: "Jan 2022" },
  { id: 2, name: "Angela Moore", role: "Sales Associate", status: "Active", phone: "+1 555-0002", email: "angela@fitz.com", hours: "40h/wk", memberSince: "Mar 2022" },
  { id: 3, name: "Carlos Rivera", role: "Warehouse Staff", status: "On Leave", phone: "+1 555-0003", email: "carlos@fitz.com", hours: "32h/wk", memberSince: "Jun 2023" },
  { id: 4, name: "Sandra Blake", role: "Cashier", status: "Active", phone: "+1 555-0004", email: "sandra@fitz.com", hours: "40h/wk", memberSince: "Aug 2023" },
  { id: 5, name: "Tony Nguyen", role: "Sales Associate", status: "Inactive", phone: "+1 555-0005", email: "tony@fitz.com", hours: "20h/wk", memberSince: "Jan 2024" },
];

const ROLES = ["Store Manager", "Sales Associate", "Warehouse Staff", "Cashier", "Supervisor", "Security"];

function statusClasses(status: string) {
  if (status === "Active") return "bg-[rgba(52,199,89,0.15)] text-[#34c759] border border-[#34c759]";
  if (status === "On Leave") return "bg-[rgba(255,159,10,0.15)] text-[#ff9f0a] border border-[#ff9f0a]";
  return "bg-[rgba(255,59,48,0.15)] text-[#ff3b30] border border-[#ff3b30]";
}

const inputClass = "w-full bg-[var(--card-bg)] border border-[var(--border)] rounded-[10px] px-4 py-3 text-white text-[0.88rem] outline-none box-border";
const labelClass = "text-[var(--muted)] text-[0.75rem] mb-[6px] block";
const selectBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238888a0' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`;

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  hours: "",
  memberSince: "",
  role: "Sales Associate" as string,
  status: "Active" as Employee["status"],
};

export default function EmployeesPage() {
  const searchParams = useSearchParams();
  const showModal = searchParams.get("modal") === "add";

  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState<Partial<typeof emptyForm>>({});

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase())
  );

  function validate() {
    const errs: Partial<typeof emptyForm> = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.phone.trim()) errs.phone = "Required";
    if (!form.email.trim()) errs.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.hours.trim()) errs.hours = "Required";
    if (!form.memberSince.trim()) errs.memberSince = "Required";
    return errs;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setEmployees(prev => [...prev, {
      id: Date.now(),
      name: form.name.trim(),
      role: form.role,
      status: form.status,
      phone: form.phone.trim(),
      email: form.email.trim(),
      hours: form.hours.trim(),
      memberSince: form.memberSince.trim(),
    }]);
    setForm({ ...emptyForm });
    setErrors({});
    window.location.href = "/employees";
  }

  function Field({ fkey, label, placeholder, type = "text" }: {
    fkey: keyof typeof emptyForm; label: string; placeholder: string; type?: string;
  }) {
    return (
      <div>
        <label className={labelClass}>{label}</label>
        <input
          type={type}
          placeholder={placeholder}
          value={form[fkey] as string}
          onChange={e => { setForm(f => ({ ...f, [fkey]: e.target.value })); setErrors(errs => ({ ...errs, [fkey]: undefined })); }}
          className={`${inputClass} ${errors[fkey] ? "border-[#ff3b30]" : "border-[var(--border)]"}`}
        />
        {errors[fkey] && <p className="text-[#ff3b30] text-[0.72rem] mt-1 ml-[2px]">{errors[fkey]}</p>}
      </div>
    );
  }

  return (
    <div className="bg-[var(--background)] min-h-screen font-sans px-5 py-6">

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-white text-[1.5rem] font-bold mb-[0.2rem]">Employees</h1>
          <p className="text-[var(--accent-1)] text-[0.82rem]">{employees.length} staff members</p>
        </div>
        <Link
          href="?modal=add"
          className="bg-[var(--accent-1)] rounded-full w-[42px] h-[42px] flex items-center justify-center shrink-0 touch-manipulation"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="pointer-events-none">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <svg className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-transparent border border-[var(--accent-1)] rounded-[12px] py-3 pl-10 pr-4 text-white text-[0.85rem] outline-none"
        />
      </div>

      {/* Employee List */}
      <div className="flex flex-col gap-[0.6rem]">
        {filtered.length === 0 ? (
          <p className="text-[var(--accent-2)] text-center mt-8">No employees found.</p>
        ) : (
          filtered.map(e => (
            <Link
              key={e.id}
              href={`/employees/${e.id}`}
              className="bg-[var(--btn-bg)] rounded-[12px] p-4 flex justify-between items-center active:scale-95 transition-transform no-underline touch-manipulation"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[var(--accent-1)] rounded-full w-[42px] h-[42px] flex items-center justify-center shrink-0 pointer-events-none">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" strokeWidth="2" className="pointer-events-none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold text-[0.95rem]">{e.name}</div>
                  <div className="text-[var(--accent-1)] text-[0.78rem]">{e.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-[10px]">
                <span className={`${statusClasses(e.status)} text-[0.72rem] font-semibold px-[10px] py-[3px] rounded-full`}>
                  {e.status}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" strokeWidth="2" className="pointer-events-none">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[var(--background)] z-[100] overflow-y-auto font-sans">

          {/* Top Bar */}
          <div className="flex items-center justify-center relative px-5 pt-5 pb-4">
            <Link
              href="/employees"
              className="absolute left-5 flex items-center gap-1 text-white text-[0.85rem] no-underline"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2" className="pointer-events-none">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </Link>
            <h2 className="text-white text-[1.05rem] font-bold">Add Employee</h2>
          </div>

          {/* Form Card */}
          <div className="mx-5 mb-6 bg-[var(--card-bg)] rounded-[16px] p-5 flex flex-col gap-4">
            <Field fkey="name" label="Full Name" placeholder="John Doe" />
            <Field fkey="phone" label="Phone" placeholder="+1 555-0000" type="tel" />
            <Field fkey="email" label="Email" placeholder="name@fitz.com" type="email" />
            <Field fkey="hours" label="Hours" placeholder="40h/wk" />
            <Field fkey="memberSince" label="Member Since" placeholder="Jan 2024" />

            <div>
              <label className={labelClass}>Role</label>
              <select
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className={`${inputClass} appearance-none`}
                style={{ backgroundImage: selectBg, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as Employee["status"] }))}
                className={`${inputClass} appearance-none`}
                style={{ backgroundImage: selectBg, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="px-5 pb-10">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleSave(); }}
              className="w-full bg-[var(--accent-1)] text-white rounded-[14px] py-4 font-bold text-base flex items-center justify-center no-underline touch-manipulation"
            >
              Save Employee
            </a>
          </div>

        </div>
      )}

    </div>
  );
}
