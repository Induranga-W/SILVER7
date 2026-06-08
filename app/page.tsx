"use client";

import Link from "next/link";

const navItems = [
  {
    label: "DASHBOARD",
    href: "/dashboard",
    icon: (
      <svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    label: "SALES",
    href: "/sales",
    icon: (
      <svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 17V13" />
        <path d="M12 17V9" />
        <path d="M17 17V11" />
      </svg>
    ),
  },
  {
    label: "EMPLOYEES",
    href: "/employees",
    icon: (
      <svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "INVENTORY",
    href: "/inventory",
    icon: (
      <svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6" />
        <path d="M9 16h4" />
      </svg>
    ),
  },
  {
    label: "LOGISTICS",
    href: "/logistics",
    icon: (
      <svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    label: "SETTINGS",
    href: "/settings",
    icon: (
      <svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <main className="min-h-screen h-screen bg-[var(--background)] font-sans px-8 py-10 flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-5 mb-8">
        <span className="text-white text-[18px] font-bold tracking-wide">
          STORE MANAGER
        </span>
      </div>

      {/* Nav Grid */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-[16px] flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200 bg-[var(--card-bg)] hover:bg-[var(--btn-bg)] active:scale-95 no-underline"
          >
            {item.icon}
            <span className="text-white text-[16px] font-bold tracking-wide">
              {item.label}
            </span>
          </Link>
        ))}
      </div>

    </main>
  );
}
