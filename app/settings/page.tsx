"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const CURRENCIES = ["USD", "EUR", "GBP", "LKR", "AUD", "CAD", "JPY", "SGD"];

const selectBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238888a0' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`;
const inputClass = "w-full bg-[var(--accent-1)] border border-[var(--accent-1)] rounded-[10px] px-4 py-3 text-white text-[0.88rem] outline-none";
const labelClass = "text-[#8888a0] text-[0.75rem] mb-[6px] block";

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    
     <a href="#"
      onClick={e => { e.preventDefault(); onToggle(); }}
      className={`relative inline-flex w-[52px] h-[28px] rounded-full transition-colors duration-200 touch-manipulation no-underline shrink-0 ${on ? "bg-[var(--accent-1)]" : "bg-[var(--card-bg)]"}`}>
      <span className={`absolute top-[3px] left-[3px] w-[22px] h-[22px] bg-white rounded-full shadow transition-transform duration-200 pointer-events-none ${on ? "translate-x-[24px]" : "translate-x-0"}`} />
    </a>
  );
}

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const showPasswordModal = searchParams.get("modal") === "password";

  const [currency, setCurrency] = useState("USD");
  const [pushNotif, setPushNotif] = useState(true);
  const [lowStockAlert, setLowStockAlert] = useState(true);

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);

  function handleLogout() {
    localStorage.removeItem("auth_session");
    window.location.href = "/login";
  }

  function handleSaveCredentials() {
    const storedPass = localStorage.getItem("auth_pass") || "admin123";
    if (currentPass !== storedPass) { setPassError("Current password is incorrect"); return; }
    if (newPass.length < 6) { setPassError("New password must be at least 6 characters"); return; }
    if (newPass !== confirmPass) { setPassError("Passwords do not match"); return; }
    if (newUsername.trim()) localStorage.setItem("auth_user", newUsername.trim());
    localStorage.setItem("auth_pass", newPass);
    setPassSuccess(true);
    setPassError("");
    setCurrentPass(""); setNewPass(""); setConfirmPass(""); setNewUsername("");
    setTimeout(() => {
      setPassSuccess(false);
      window.location.href = "/settings";
    }, 1500);
  }

  return (
    <div className="bg-[var(--background)] min-h-screen font-sans px-5 pt-6 pb-12">

      {/* Header */}
      <h1 className="text-white text-[1.5rem] font-bold mb-[2px]">Settings</h1>
      <p className="text-[var(--muted)] text-[0.82rem] mb-6">Customize your store</p>

      {/* Currency */}
      <div className="bg-[var(--card-bg)] rounded-[14px] p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          <span className="text-white font-bold text-[0.95rem]">Currency</span>
        </div>
        <label className={labelClass}>Select Currency</label>
        <select
          value={currency}
          onChange={e => setCurrency(e.target.value)}
          className="w-full bg-[var(--background)] border border-[var(--border)] rounded-[10px] px-4 py-3 text-white text-[0.88rem] outline-none appearance-none"
          style={{ backgroundImage: selectBg, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
        >
          {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Notifications */}
      <div className="bg-[var(--card-bg)] rounded-[14px] p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="text-white font-bold text-[0.95rem]">Notifications</span>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-[#2a2a3a]">
          <div>
            <div className="text-white text-[0.88rem] font-medium">Push Notifications</div>
            <div className="text-[var(--muted)] text-[0.75rem]">Receive app notifications</div>
          </div>
          <Toggle on={pushNotif} onToggle={() => setPushNotif(v => !v)} />
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <div className="text-white text-[0.88rem] font-medium">Low Stock Alerts</div>
            <div className="text-[var(--muted)] text-[0.75rem]">Alert when stock is low</div>
          </div>
          <Toggle on={lowStockAlert} onToggle={() => setLowStockAlert(v => !v)} />
        </div>
      </div>

      {/* Privacy & Security + Help */}
      <div className="bg-[var(--card-bg)] rounded-[14px] px-5 mb-4">
        <div className="border-b border-[#2a2a3a]">
          <Link href="/settings?modal=password" className="flex items-center justify-between py-4 no-underline touch-manipulation">
            <div className="flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span className="text-white text-[0.92rem] font-medium">Privacy &amp; Security</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555566" strokeWidth="2" className="pointer-events-none">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        </div>
        <Link href="/settings" className="flex items-center justify-between py-4 no-underline touch-manipulation">
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span className="text-white text-[0.92rem] font-medium">Help &amp; Support</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555566" strokeWidth="2" className="pointer-events-none">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </Link>
      </div>

      {/* Log Out */}
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); handleLogout(); }}
        className="w-full bg-[rgba(255,59,48,0.1)] border border-[rgba(255,59,48,0.3)] rounded-[14px] py-4 text-[#ff3b30] font-bold text-base flex items-center justify-center no-underline touch-manipulation">
        Log Out
      </a>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-[#13131a] z-[100] overflow-y-auto">
          <div className="flex items-center justify-center relative px-5 pt-5 pb-4">
            <Link href="/settings" className="absolute left-5 flex items-center gap-1 text-[#8888a0] text-[0.85rem] no-underline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8888a0" strokeWidth="2" className="pointer-events-none">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back
            </Link>
            <h2 className="text-white text-[1.05rem] font-bold">Privacy &amp; Security</h2>
          </div>

          <div className="mx-5 mb-4 bg-[#1e1e2e] rounded-[16px] p-5 flex flex-col gap-4">
            <p className="text-[#8888a0] text-[0.78rem]">Change your login credentials below.</p>
            <div>
              <label className={labelClass}>New Username (optional)</label>
              <input type="text" placeholder="Enter new username" value={newUsername} onChange={e => { setNewUsername(e.target.value); setPassError(""); }} className={inputClass} autoCapitalize="none" />
            </div>
            <div>
              <label className={labelClass}>Current Password</label>
              <input type="password" placeholder="Enter current password" value={currentPass} onChange={e => { setCurrentPass(e.target.value); setPassError(""); }} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>New Password</label>
              <input type="password" placeholder="Min. 6 characters" value={newPass} onChange={e => { setNewPass(e.target.value); setPassError(""); }} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Confirm New Password</label>
              <input type="password" placeholder="Repeat new password" value={confirmPass} onChange={e => { setConfirmPass(e.target.value); setPassError(""); }} className={inputClass} />
            </div>
            {passError && <p className="text-[#ff3b30] text-[0.78rem]">{passError}</p>}
            {passSuccess && <p className="text-[#34c759] text-[0.78rem]">Credentials updated!</p>}
          </div>

          <div className="px-5 pb-10">
            <a
              href="#"
              onClick={e => { e.preventDefault(); handleSaveCredentials(); }}
              className="w-full bg-[#7c3aed] text-white rounded-[14px] py-4 font-bold text-base flex items-center justify-center no-underline touch-manipulation"
            >
              Save Changes
            </a>
          </div>
        </div>
      )}

    </div>
  );
}