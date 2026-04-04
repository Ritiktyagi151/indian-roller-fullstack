"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeftRight,
  Download,
  Globe,
  Plus,
  ScanSearch,
  Search,
  Trash2,
  WandSparkles,
} from "lucide-react";
import api from "@/lib/axios";
import SummaryCard from "./SummaryCard";
import ToastViewport from "./ToastViewport";
import type {
  AuditIssue,
  DashboardSection,
  GlobalSettings,
  RedirectRule,
  SeoPage,
  SitemapState,
  SummaryCardData,
  ToastItem,
} from "./types";

type Props = {
  initialSection: DashboardSection;
};

const itemsPerPage = 6;

const emptySettings: GlobalSettings = {
  defaultMetaTitle: "",
  defaultMetaDescription: "",
  defaultKeywords: "",
  googleVerification: "",
  schemaType: "",
  organizationName: "",
  organizationUrl: "",
  robotsDefault: "index, follow",
  navbarProductDropdownLimit: 8,
};

export default function ApiSeoPanel({ initialSection }: Props) {
  const [pages, setPages] = useState<SeoPage[]>([]);
  const [settings, setSettings] = useState<GlobalSettings>(emptySettings);
  const [redirects, setRedirects] = useState<RedirectRule[]>([]);
  const [sitemap, setSitemap] = useState<SitemapState>({ lastGenerated: "", autoGenerate: true, xml: "" });
  const [audit, setAudit] = useState<{ score: number; issues: AuditIssue[] }>({ score: 0, issues: [] });
  const [selectedPageId, setSelectedPageId] = useState("");
  const [pageSearch, setPageSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [redirectForm, setRedirectForm] = useState({ from: "", to: "", type: "301" as "301" | "302" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [activeSection, setActiveSection] = useState(initialSection);

  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  useEffect(() => {
    if (!toasts.length) return;
    const timer = window.setTimeout(() => setToasts((current) => current.slice(1)), 2400);
    return () => window.clearTimeout(timer);
  }, [toasts]);

  function pushToast(title: string, description: string, tone: ToastItem["tone"] = "info") {
    setToasts((current) => [...current, { id: Date.now() + Math.random(), title, description, tone }]);
  }

  const loadAll = useCallback(async () => {
    setLoading(true);

    try {
      const [pagesRes, settingsRes, redirectsRes, sitemapRes, auditRes] = await Promise.all([
        api.get("/seo/pages"),
        api.get("/seo/settings"),
        api.get("/seo/redirects"),
        api.get("/seo/sitemap"),
        api.get("/seo/audit"),
      ]);

      const nextPages = Array.isArray(pagesRes.data) ? pagesRes.data : [];
      setPages(nextPages);
      setSelectedPageId((current) => current || nextPages[0]?.id || "");
      setSettings(settingsRes.data || emptySettings);
      setRedirects(
        (Array.isArray(redirectsRes.data) ? redirectsRes.data : []).map((item) => ({
          id: item._id || item.id,
          from: item.from,
          to: item.to,
          type: item.type,
          hits: item.hits || 0,
        })),
      );
      setSitemap(sitemapRes.data || { lastGenerated: "", autoGenerate: true, xml: "" });
      setAudit(auditRes.data || { score: 0, issues: [] });
    } catch (error) {
      console.error(error);
      pushToast("SEO load failed", "Backend SEO APIs could not be loaded.", "warning");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const selectedPage = useMemo(
    () => pages.find((page) => page.id === selectedPageId) || pages[0] || null,
    [pages, selectedPageId],
  );

  const filteredPages = useMemo(() => {
    return pages.filter((page) =>
      `${page.name} ${page.url} ${page.metaTitle}`.toLowerCase().includes(pageSearch.toLowerCase()),
    );
  }, [pageSearch, pages]);

  const totalPages = Math.max(1, Math.ceil(filteredPages.length / itemsPerPage));
  const safePageNumber = Math.min(pageNumber, totalPages);
  const visiblePages = filteredPages.slice((safePageNumber - 1) * itemsPerPage, safePageNumber * itemsPerPage);

  const summaryCards: SummaryCardData[] = useMemo(() => {
    const missingTitles = pages.filter((page) => !page.metaTitle?.trim()).length;
    const duplicates = audit.issues.filter((issue) => issue.type === "Duplicate Tags").length;
    const indexed = pages.filter((page) => page.indexed).length;

    return [
      {
        id: "indexed",
        title: "Total Indexed Pages",
        value: String(indexed),
        hint: `${pages.length - indexed} pages still need index review`,
        icon: Globe,
        accent: "from-indigo-500 to-sky-500",
      },
      {
        id: "missing",
        title: "Missing Meta Titles",
        value: String(missingTitles),
        hint: "Pages that still need title optimization",
        icon: Search,
        accent: "from-amber-500 to-orange-500",
      },
      {
        id: "duplicate",
        title: "Duplicate Tag Warnings",
        value: String(duplicates),
        hint: "Pages sharing duplicate search metadata",
        icon: WandSparkles,
        accent: "from-rose-500 to-pink-500",
      },
      {
        id: "health",
        title: "SEO Health Score",
        value: `${audit.score}/100`,
        hint: "Live score from the backend audit API",
        icon: ScanSearch,
        accent: "from-emerald-500 to-teal-500",
      },
    ];
  }, [audit, pages]);

  async function saveSelectedPage() {
    if (!selectedPage) return;

    setSaving(true);
    try {
      await api.put(`/seo/pages/${(selectedPage as SeoPage & { entityType?: string }).entityType}/${selectedPage.id}`, {
        metaTitle: selectedPage.metaTitle,
        metaDescription: selectedPage.metaDescription,
        keywords: selectedPage.keywords,
        canonicalUrl: selectedPage.canonicalUrl,
        robots: selectedPage.robots,
        openGraphTitle: selectedPage.openGraphTitle,
        openGraphDescription: selectedPage.openGraphDescription,
        openGraphImage: selectedPage.openGraphImage,
        twitterTitle: selectedPage.twitterTitle,
        twitterDescription: selectedPage.twitterDescription,
        twitterCard: selectedPage.twitterCard,
      });
      pushToast("SEO page saved", "Metadata changes were saved through the backend API.", "success");
      await loadAll();
    } catch (error) {
      console.error(error);
      pushToast("Save failed", "The SEO page could not be updated.", "warning");
    } finally {
      setSaving(false);
    }
  }

  async function deleteSelectedSeo() {
    if (!selectedPage) return;

    try {
      await api.delete(`/seo/pages/${selectedPage.entityType}/${selectedPage.id}`);
      pushToast("SEO tags removed", "Custom SEO tags were deleted for this page.", "success");
      await loadAll();
    } catch (error) {
      console.error(error);
      pushToast("Delete failed", "The SEO tags could not be deleted.", "warning");
    }
  }

  async function saveSettings() {
    setSaving(true);
    try {
      const response = await api.put("/seo/settings", settings);
      setSettings(response.data || settings);
      pushToast("Settings saved", "Global SEO settings were updated.", "success");
    } catch (error) {
      console.error(error);
      pushToast("Save failed", "Global SEO settings could not be updated.", "warning");
    } finally {
      setSaving(false);
    }
  }

  async function addRedirect() {
    if (!redirectForm.from.trim() || !redirectForm.to.trim()) {
      pushToast("Redirect not saved", "Both old and new URLs are required.", "warning");
      return;
    }

    try {
      await api.post("/seo/redirects", redirectForm);
      setRedirectForm({ from: "", to: "", type: "301" });
      pushToast("Redirect created", "The redirect rule was saved.", "success");
      await loadAll();
    } catch (error) {
      console.error(error);
      pushToast("Redirect failed", "The redirect could not be created.", "warning");
    }
  }

  async function removeRedirect(id: string) {
    try {
      await api.delete(`/seo/redirects/${id}`);
      pushToast("Redirect removed", "The redirect rule was deleted.", "success");
      await loadAll();
    } catch (error) {
      console.error(error);
      pushToast("Delete failed", "The redirect could not be removed.", "warning");
    }
  }

  async function refreshAudit() {
    try {
      const auditRes = await api.get("/seo/audit");
      setAudit(auditRes.data || { score: 0, issues: [] });
      pushToast("Audit refreshed", "Latest SEO audit results are now visible.", "success");
    } catch (error) {
      console.error(error);
      pushToast("Audit failed", "The audit API could not be refreshed.", "warning");
    }
  }

  async function refreshSitemap() {
    try {
      const sitemapRes = await api.get("/seo/sitemap");
      setSitemap(sitemapRes.data || sitemap);
      pushToast("Sitemap refreshed", "The sitemap preview was reloaded from the backend.", "success");
    } catch (error) {
      console.error(error);
      pushToast("Sitemap failed", "The sitemap API could not be refreshed.", "warning");
    }
  }

  function downloadSitemap() {
    const blob = new Blob([sitemap.xml], { type: "application/xml" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "sitemap.xml";
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  function updateSelectedPage<K extends keyof SeoPage>(field: K, value: SeoPage[K]) {
    if (!selectedPage) return;
    setPages((current) => current.map((page) => (page.id === selectedPage.id ? { ...page, [field]: value } : page)));
  }

  return (
    <div className="space-y-6">
      <ToastViewport toasts={toasts} />

      <div className="flex flex-wrap gap-3">
        {[
          ["dashboard", "SEO Dashboard"],
          ["pages", "Pages Manager"],
          ["editor", "SEO Editor"],
          ["settings", "Global SEO Settings"],
          ["sitemap", "Sitemap Manager"],
          ["redirects", "Redirect Manager"],
          ["audit", "SEO Audit"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveSection(key as DashboardSection)}
            className={`rounded-2xl px-4 py-3 text-sm font-medium ${
              activeSection === key
                ? "bg-slate-900 text-white dark:bg-orange-500"
                : "border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {(activeSection === "dashboard" || activeSection === "pages") && (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <SummaryCard key={card.id} card={card} />
          ))}
        </section>
      )}

      {loading ? (
        <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          Loading live SEO data...
        </section>
      ) : null}

      {!loading && activeSection === "dashboard" ? (
        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Quick Actions</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">SEO workflow</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <button type="button" onClick={() => setActiveSection("editor")} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white dark:bg-orange-500">Fix Missing Tags</button>
              <button type="button" onClick={() => setActiveSection("pages")} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium dark:border-slate-800">View All Pages</button>
              <button type="button" onClick={refreshAudit} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium dark:border-slate-800">Run Audit</button>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Recent SEO Pages</p>
            <div className="mt-6 space-y-3">
              {[...pages]
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 4)
                .map((page) => (
                  <div key={page.id} className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800">
                    <p className="font-medium text-slate-900 dark:text-white">{page.name}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{page.url}</p>
                  </div>
                ))}
            </div>
          </div>
        </section>
      ) : null}

      {!loading && activeSection === "pages" ? (
        <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
              <Search className="h-4 w-4 text-slate-400" />
              <input value={pageSearch} onChange={(event) => setPageSearch(event.target.value)} placeholder="Search pages" className="bg-transparent text-sm outline-none" />
            </label>
          </div>
          <div className="space-y-3">
            {visiblePages.map((page) => (
              <button key={page.id} type="button" onClick={() => { setSelectedPageId(page.id); setActiveSection("editor"); }} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{page.name}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{page.url}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${page.status === "complete" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {page.status}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-end gap-2 text-sm text-slate-500 dark:text-slate-400">
            <button type="button" onClick={() => setPageNumber((current) => Math.max(1, current - 1))}>Prev</button>
            <span>{safePageNumber} / {totalPages}</span>
            <button type="button" onClick={() => setPageNumber((current) => Math.min(totalPages, current + 1))}>Next</button>
          </div>
        </section>
      ) : null}

      {!loading && activeSection === "editor" && selectedPage ? (
        <section className="grid gap-6 xl:grid-cols-[0.36fr_0.64fr]">
          <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pages</p>
            <div className="mt-4 space-y-3">
              {pages.slice(0, 8).map((page) => (
                <button key={page.id} type="button" onClick={() => setSelectedPageId(page.id)} className={`w-full rounded-2xl border px-4 py-3 text-left ${selectedPage.id === page.id ? "border-slate-900 bg-slate-900 text-white dark:bg-orange-500 dark:border-orange-500" : "border-slate-200 dark:border-slate-800"}`}>
                  {page.name}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="grid gap-4 md:grid-cols-2">
              <input value={selectedPage.metaTitle} onChange={(event) => updateSelectedPage("metaTitle", event.target.value)} placeholder="Meta Title" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
              <input value={selectedPage.canonicalUrl} onChange={(event) => updateSelectedPage("canonicalUrl", event.target.value)} placeholder="Canonical URL" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
              <textarea rows={3} value={selectedPage.metaDescription} onChange={(event) => updateSelectedPage("metaDescription", event.target.value)} placeholder="Meta Description" className="md:col-span-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
              <input value={selectedPage.keywords} onChange={(event) => updateSelectedPage("keywords", event.target.value)} placeholder="Keywords" className="md:col-span-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
              <input value={selectedPage.openGraphTitle} onChange={(event) => updateSelectedPage("openGraphTitle", event.target.value)} placeholder="Open Graph Title" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
              <input value={selectedPage.twitterTitle} onChange={(event) => updateSelectedPage("twitterTitle", event.target.value)} placeholder="Twitter Title" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
              <textarea rows={3} value={selectedPage.openGraphDescription} onChange={(event) => updateSelectedPage("openGraphDescription", event.target.value)} placeholder="Open Graph Description" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
              <textarea rows={3} value={selectedPage.twitterDescription} onChange={(event) => updateSelectedPage("twitterDescription", event.target.value)} placeholder="Twitter Description" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
              <input value={selectedPage.openGraphImage} onChange={(event) => updateSelectedPage("openGraphImage", event.target.value)} placeholder="Open Graph Image URL" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
              <input value={selectedPage.robots} onChange={(event) => updateSelectedPage("robots", event.target.value)} placeholder="Robots Meta" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={saveSelectedPage} disabled={saving} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60 dark:bg-orange-500">
                Save SEO Changes
              </button>
              <button type="button" onClick={deleteSelectedSeo} className="rounded-2xl border border-rose-200 px-4 py-3 text-sm font-medium text-rose-600 dark:border-rose-900 dark:text-rose-300">
                Delete SEO Tags
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {!loading && activeSection === "settings" ? (
        <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-4 md:grid-cols-2">
            <input value={settings.defaultMetaTitle} onChange={(event) => setSettings((current) => ({ ...current, defaultMetaTitle: event.target.value }))} placeholder="Default Meta Title" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
            <input value={settings.googleVerification} onChange={(event) => setSettings((current) => ({ ...current, googleVerification: event.target.value }))} placeholder="Google Verification" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
            <textarea rows={3} value={settings.defaultMetaDescription} onChange={(event) => setSettings((current) => ({ ...current, defaultMetaDescription: event.target.value }))} placeholder="Default Meta Description" className="md:col-span-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
            <input value={settings.defaultKeywords} onChange={(event) => setSettings((current) => ({ ...current, defaultKeywords: event.target.value }))} placeholder="Default Keywords" className="md:col-span-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
            <input value={settings.organizationName} onChange={(event) => setSettings((current) => ({ ...current, organizationName: event.target.value }))} placeholder="Organization Name" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
            <input value={settings.organizationUrl} onChange={(event) => setSettings((current) => ({ ...current, organizationUrl: event.target.value }))} placeholder="Organization URL" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
            <input value={settings.schemaType} onChange={(event) => setSettings((current) => ({ ...current, schemaType: event.target.value }))} placeholder="Schema Type" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
            <input value={settings.robotsDefault} onChange={(event) => setSettings((current) => ({ ...current, robotsDefault: event.target.value }))} placeholder="Default Robots" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
            <input
              type="number"
              min={1}
              value={settings.navbarProductDropdownLimit}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  navbarProductDropdownLimit: Math.max(1, Number(event.target.value) || 1),
                }))
              }
              placeholder="Navbar Product Dropdown Items Per Section"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950"
            />
          </div>
          <button type="button" onClick={saveSettings} disabled={saving} className="mt-6 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60 dark:bg-orange-500">
            Save Global Settings
          </button>
        </section>
      ) : null}

      {!loading && activeSection === "sitemap" ? (
        <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sitemap manager</p>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Last generated: {sitemap.lastGenerated || "-"}</p>
            <div className="mt-6 grid gap-3">
              <button type="button" onClick={refreshSitemap} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white dark:bg-orange-500">Generate Sitemap</button>
              <button type="button" onClick={downloadSitemap} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium dark:border-slate-800"><Download className="mr-2 inline h-4 w-4" />Download sitemap.xml</button>
              <button type="button" onClick={refreshSitemap} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium dark:border-slate-800"><ArrowLeftRight className="mr-2 inline h-4 w-4" />Ping Search Engines</button>
            </div>
          </div>
          <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <pre className="max-h-[560px] overflow-auto rounded-3xl bg-slate-950 p-5 text-xs leading-6 text-slate-100">{sitemap.xml}</pre>
          </div>
        </section>
      ) : null}

      {!loading && activeSection === "redirects" ? (
        <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="space-y-4">
              <input value={redirectForm.from} onChange={(event) => setRedirectForm((current) => ({ ...current, from: event.target.value }))} placeholder="Old URL" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
              <input value={redirectForm.to} onChange={(event) => setRedirectForm((current) => ({ ...current, to: event.target.value }))} placeholder="New URL" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
              <select value={redirectForm.type} onChange={(event) => setRedirectForm((current) => ({ ...current, type: event.target.value as "301" | "302" }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950">
                <option value="301">301 Permanent</option>
                <option value="302">302 Temporary</option>
              </select>
              <button type="button" onClick={addRedirect} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white dark:bg-orange-500"><Plus className="mr-2 inline h-4 w-4" />Add Redirect</button>
            </div>
          </div>
          <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="space-y-3">
              {redirects.map((redirect) => (
                <div key={redirect.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{redirect.from}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Redirects to {redirect.to}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">{redirect.type}</span>
                    <button type="button" onClick={() => removeRedirect(redirect.id)} className="rounded-xl border border-rose-200 p-2 text-rose-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {!loading && activeSection === "audit" ? (
        <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
              <p className="text-sm text-slate-500 dark:text-slate-400">SEO score</p>
              <p className="mt-2 text-4xl font-semibold text-slate-900 dark:text-white">{audit.score}<span className="text-lg text-slate-400">/100</span></p>
            </div>
            <button type="button" onClick={refreshAudit} className="mt-6 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white dark:bg-orange-500"><ScanSearch className="mr-2 inline h-4 w-4" />Run SEO Audit</button>
          </div>
          <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="space-y-3">
              {audit.issues.map((issue) => (
                <div key={issue.id} className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800">
                  <p className="font-medium text-slate-900 dark:text-white">{issue.pageName}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{issue.url}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{issue.message}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
