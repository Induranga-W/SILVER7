"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const session = localStorage.getItem("auth_session");
    if (!session && pathname !== "/login") {
      window.location.href = "/login";
    } else {
      setReady(true);
    }
  }, [pathname]);

  if (!ready) return null;

  return <>{children}</>;
}