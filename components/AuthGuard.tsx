"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const session = localStorage.getItem("auth_session");
    if (!session && pathname !== "/login") {
      window.location.href = "/login";
    } else {
      setChecked(true);
    }
  }, [pathname]);

  if (!checked) return null;
  return <>{children}</>;
}