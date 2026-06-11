"use client";

import { useState, useEffect } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    // Set default credentials on first run
    if (!localStorage.getItem("auth_user")) {
      localStorage.setItem("auth_user", "admin");
      localStorage.setItem("auth_pass", "admin123");
    }
    // If already logged in skip login
    if (localStorage.getItem("auth_session")) {
      window.location.href = "/";
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const storedUser = localStorage.getItem("auth_user") || "admin";
    const storedPass = localStorage.getItem("auth_pass") || "admin123";
    if (username === storedUser && password === storedPass) {
      localStorage.setItem("auth_session", "true");
      window.location.href = "/";
    } else {
      setError("Invalid username or password");
    }
  }

  const inputClass = "w-full bg-[var(--background)] border border-[#2a2a3a] rounded-[12px] px-4 py-3 text-white text-[0.9rem] outline-none";

  return (
    <div className="min-h-screen bg-[var(--background)] font-sans flex flex-col items-center justify-center px-6">

      {/* Logo */}
      <div className="mb-8 text-center">
        
        <h1 className="text-white text-[2.5rem] font-bold tracking-wide">SILVER7</h1>
        <h3 className="text-white text-[rem] font-bold tracking-wide">Store Manager (AIO)</h3>
        <p className="text-[#8888a0] text-[0.82rem] mt-1">Sign in to continue</p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col gap-4">
        <div>
          <label className="text-[var(--accent-2)] text-[0.75rem] mb-[6px] block">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={e => { setUsername(e.target.value); setError(""); }}
            className={inputClass}
            autoCapitalize="none"
          />
        </div>

        <div>
          <label className="text-[var(--accent-2)] text-[0.75rem] mb-[6px] block">Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              className={`${inputClass} pr-12`}
            />
            
              
            
             
            
          </div>
        </div>

        {error && <p className="text-[#ff3b30] text-[0.78rem] text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-[var(--accent-1)] text-white rounded-[14px] py-4 font-bold text-base mt-2 touch-manipulation"
        >
          Sign In
        </button>

        
      </form>
    </div>
  );
}