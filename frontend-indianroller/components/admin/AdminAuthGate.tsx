"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminAuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const isLoggedIn = window.localStorage.getItem("isAdminLoggedIn") === "true";

    if (!isLoggedIn) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!window.localStorage.getItem("adminRole")) {
      window.localStorage.setItem("adminRole", "super_admin");
    }

    setAllowed(true);
  }, [pathname, router]);

  if (!allowed) {
    return <div className="min-h-screen bg-slate-100 dark:bg-slate-950" />;
  }

  return <>{children}</>;
}
