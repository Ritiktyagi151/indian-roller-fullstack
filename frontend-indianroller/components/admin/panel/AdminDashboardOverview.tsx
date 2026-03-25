"use client";

import { useEffect, useState } from "react";
import { Boxes, FolderTree, Globe, MailOpen } from "lucide-react";
import api from "@/lib/axios";

type DashboardStats = {
  totalProducts: number;
  totalCategories: number;
  totalEnquiries: number;
  seoHealth: number;
  indexedPages: number;
};

const initialStats: DashboardStats = {
  totalProducts: 0,
  totalCategories: 0,
  totalEnquiries: 0,
  seoHealth: 0,
  indexedPages: 0,
};

const cards = [
  { key: "totalProducts", label: "Total Products", icon: Boxes, accent: "from-orange-500 to-amber-500" },
  { key: "totalCategories", label: "Total Categories", icon: FolderTree, accent: "from-sky-500 to-cyan-500" },
  { key: "totalEnquiries", label: "Total Enquiries", icon: MailOpen, accent: "from-emerald-500 to-teal-500" },
  { key: "seoHealth", label: "SEO Health Score", icon: Globe, accent: "from-fuchsia-500 to-pink-500" },
  { key: "indexedPages", label: "Indexed Pages", icon: Globe, accent: "from-indigo-500 to-violet-500" },
] as const;

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      try {
        const [productsRes, categoriesRes, enquiriesRes, auditRes, pagesRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
          api.get("/enquiries"),
          api.get("/seo/audit"),
          api.get("/seo/pages"),
        ]);

        const products = Array.isArray(productsRes.data) ? productsRes.data : [];
        const categories = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
        const enquiries = Array.isArray(enquiriesRes.data) ? enquiriesRes.data : [];
        const pages = Array.isArray(pagesRes.data) ? pagesRes.data : [];

        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          totalEnquiries: enquiries.length,
          seoHealth: Number(auditRes.data?.score || 0),
          indexedPages: pages.filter((page: { indexed?: boolean }) => page.indexed).length,
        });
      } catch (loadError) {
        console.error("Failed to load dashboard stats", loadError);
        setError("Dashboard data could not be loaded from the backend APIs.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          const value =
            card.key === "seoHealth" ? `${stats.seoHealth}/100` : String(stats[card.key]);

          return (
            <article
              key={card.key}
              className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                  <h3 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
                    {loading ? "..." : value}
                  </h3>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-white shadow-lg`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Overview</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">Admin control center</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
              <p className="text-sm text-slate-500 dark:text-slate-400">Products module</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                Live product and category counts now come directly from the backend product APIs.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
              <p className="text-sm text-slate-500 dark:text-slate-400">SEO access</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                SEO health and indexed pages are loaded from the existing backend SEO endpoints.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
              <p className="text-sm text-slate-500 dark:text-slate-400">Enquiries</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                Contact and website-form submissions are pulled from the enquiry database in real time.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
              <p className="text-sm text-slate-500 dark:text-slate-400">System status</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                {error || "All dashboard cards are backed by live API responses."}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Backend checks</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">Live module status</h3>
          <div className="mt-6 space-y-3">
            {[
              `Products API: ${loading ? "loading" : `${stats.totalProducts} records available`}`,
              `Categories API: ${loading ? "loading" : `${stats.totalCategories} records available`}`,
              `Enquiries API: ${loading ? "loading" : `${stats.totalEnquiries} records available`}`,
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 px-4 py-4 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
