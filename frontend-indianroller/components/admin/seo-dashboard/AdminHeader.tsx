"use client";

import { MoonStar, RefreshCcw, Search, SunMedium } from "lucide-react";
import type { DashboardSection } from "./types";

const titles: Record<DashboardSection, string> = {
  dashboard: "SEO Dashboard",
  pages: "Pages Manager",
  editor: "SEO Editor",
  settings: "Global Settings",
  sitemap: "Sitemap Manager",
  redirects: "Redirect Manager",
  audit: "SEO Audit",
  roles: "Role Permissions",
};

type AdminHeaderProps = {
  activeSection: DashboardSection;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onRefresh: () => void;
};

export default function AdminHeader({
  activeSection,
  theme,
  onToggleTheme,
  onRefresh,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex flex-col gap-4 border-b border-slate-200/80 bg-white/80 px-4 py-4 backdrop-blur lg:px-8 dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="pl-14 lg:pl-0">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
            Search Operations
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
            {titles[activeSection]}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex min-w-[220px] items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <Search className="h-4 w-4" />
            <input
              readOnly
              value="Search is available in Pages Manager"
              className="w-full bg-transparent outline-none"
            />
          </label>

          <button
            type="button"
            onClick={onToggleTheme}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          >
            {theme === "dark" ? (
              <SunMedium className="h-4 w-4" />
            ) : (
              <MoonStar className="h-4 w-4" />
            )}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>

          <button
            type="button"
            onClick={onRefresh}
            className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/15 dark:bg-sky-500 dark:hover:shadow-sky-500/25"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>
    </header>
  );
}
