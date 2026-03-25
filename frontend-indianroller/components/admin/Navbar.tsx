"use client";

import { LogOut, RefreshCcw, Search, User } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const pageTitles = {
  "/admin": "Dashboard",
  "/admin/dashboard": "Dashboard",
  "/admin/products": "Products",
  "/admin/categories": "Product Categories",
  "/admin/add-product": "Add Product",
  "/admin/seo": "SEO Management",
  "/admin/enquiries": "Enquiries",
  "/admin/settings": "Settings",
  "/admin/blogs": "Blogs",
  "/admin/seo/dashboard": "SEO Dashboard",
  "/admin/seo/pages": "Pages Manager",
  "/admin/seo/editor": "SEO Editor",
  "/admin/seo/settings": "SEO Settings",
  "/admin/seo/sitemap": "Sitemap Manager",
  "/admin/seo/redirects": "Redirect Manager",
  "/admin/seo/audit": "SEO Audit",
};

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const role =
    typeof window !== "undefined" ? window.localStorage.getItem("adminRole") : "super_admin";

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 px-4 py-4 backdrop-blur lg:px-8 dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
            Content Management
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
            {pageTitles[pathname as keyof typeof pageTitles] ?? "Admin Panel"}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex min-w-[220px] items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <Search className="h-4 w-4" />
            <input
              readOnly
              value={searchParams.get("tab") || searchParams.get("section") || "Admin search"}
              className="w-full bg-transparent outline-none"
            />
          </label>

          <button
            type="button"
            onClick={() => router.refresh()}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-300">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Admin User</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                {role === "seo_manager" ? "SEO Manager" : "Super Admin"}
              </p>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 text-xs text-rose-500"
              >
                <LogOut className="h-3 w-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
