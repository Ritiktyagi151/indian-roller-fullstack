"use client";

import {
  FilePenLine,
  FileSearch,
  Globe,
  LayoutDashboard,
  Link2,
  Menu,
  ShieldCheck,
  Settings2,
  SquareLibrary,
  X,
} from "lucide-react";
import type { DashboardSection } from "./types";

const navItems: {
  id: DashboardSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "dashboard", label: "SEO Dashboard", icon: LayoutDashboard },
  { id: "pages", label: "Pages Manager", icon: SquareLibrary },
  { id: "editor", label: "SEO Editor", icon: FilePenLine },
  { id: "settings", label: "Global Settings", icon: Settings2 },
  { id: "sitemap", label: "Sitemap", icon: Globe },
  { id: "redirects", label: "Redirects", icon: Link2 },
  { id: "audit", label: "SEO Audit", icon: FileSearch },
  { id: "roles", label: "Role Permissions", icon: ShieldCheck },
];

type AdminSidebarProps = {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
  mobileOpen: boolean;
  onMobileToggle: () => void;
};

export default function AdminSidebar({
  activeSection,
  onSectionChange,
  mobileOpen,
  onMobileToggle,
}: AdminSidebarProps) {
  return (
    <>
      <button
        type="button"
        onClick={onMobileToggle}
        className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-lg lg:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-slate-950/45 lg:hidden"
          onClick={onMobileToggle}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200/80 bg-white/90 px-5 py-6 shadow-2xl backdrop-blur transition-transform duration-300 lg:translate-x-0 dark:border-slate-800 dark:bg-slate-950/90 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/20">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
              Admin Suite
            </p>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
              SEO Management
            </h1>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeSection;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSectionChange(item.id);
                  if (mobileOpen) {
                    onMobileToggle();
                  }
                }}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10 dark:bg-sky-500"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
            SEO Focus
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Keep metadata aligned, watch issues early, and ship content with clean search coverage.
          </p>
        </div>
      </aside>
    </>
  );
}
