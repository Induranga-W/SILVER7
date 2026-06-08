"use client";

import Link from "next/link";

export default function LogisticsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <div className="w-full h-screen bg-black p-10 px-8 flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-5 mb-8">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
          </svg>
          <span className="text-xs font-bold tracking-[4px] text-[var(--accent-2)]">
            STORE MANAGEMENT SYSTEM
          </span>
        </div>

        {/* Coming Soon */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="bg-[var(--btn-bg)] rounded-[20px] p-10 flex flex-col items-center gap-5 w-full max-w-[280px]">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="1" />
              <path d="M16 8h4l3 5v3h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <div className="text-center">
              <p className="text-white font-bold text-lg mb-1">LOGISTICS</p>
              <p className="text-[var(--muted)] text-sm">Coming Soon</p>
            </div>
          </div>
          <Link href="/" className="text-[var(--accent-1)] text-sm no-underline">
            ← Back to Home
          </Link>
        </div>

      </div>
    </main>
  );
}
