"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  FilePlus2,
  Globe,
  PencilLine,
  Plus,
  ScanSearch,
  Search,
  Trash2,
  WandSparkles,
} from "lucide-react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import {
  baseSummaryCards,
  initialGlobalSettings,
  initialPages,
  initialRedirects,
  initialRoles,
  initialSitemap,
} from "./mock-data";
import SummaryCard from "./SummaryCard";
import ToastViewport from "./ToastViewport";
import type {
  AuditIssue,
  DashboardSection,
  GlobalSettings,
  RedirectRule,
  RolePermission,
  SeoPage,
  SitemapState,
  ToastItem,
} from "./types";

const STORAGE_KEY = "indianroller-seo-admin-state";
const ITEMS_PER_PAGE = 5;

type PersistedState = {
  pages: SeoPage[];
  globalSettings: GlobalSettings;
  sitemap: SitemapState;
  redirects: RedirectRule[];
  roles: RolePermission[];
  theme: "light" | "dark";
};

type PageManagerForm = {
  id?: string;
  name: string;
  url: string;
  status: "complete" | "incomplete";
  indexed: boolean;
};

const blankPageManagerForm: PageManagerForm = {
  name: "",
  url: "",
  status: "incomplete",
  indexed: false,
};

function getPersistedState() {
  if (typeof window === "undefined") {
    return null;
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved) as PersistedState;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function createSitemapXml(pages: SeoPage[]) {
  const entries = pages
    .map(
      (page) => `  <url>
    <loc>https://indianroller.com${page.url}</loc>
    <lastmod>${new Date(page.updatedAt).toISOString()}</lastmod>
    <changefreq>${page.status === "complete" ? "weekly" : "monthly"}</changefreq>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

function buildAudit(pages: SeoPage[]) {
  const duplicateMap = new Map<string, SeoPage[]>();
  const issues: AuditIssue[] = [];

  pages.forEach((page) => {
    const normalizedTitle = page.metaTitle.trim().toLowerCase();
    if (normalizedTitle) {
      const existing = duplicateMap.get(normalizedTitle) ?? [];
      duplicateMap.set(normalizedTitle, [...existing, page]);
    }

    if (!page.metaTitle.trim()) {
      issues.push({
        id: `${page.id}-missing-title`,
        pageName: page.name,
        url: page.url,
        type: "Missing Title",
        message: "Meta title is empty and needs a descriptive search snippet.",
      });
    }

    if (!page.metaDescription.trim()) {
      issues.push({
        id: `${page.id}-missing-description`,
        pageName: page.name,
        url: page.url,
        type: "Missing Description",
        message: "Meta description is missing, so snippets may be inconsistent.",
      });
    }
  });

  duplicateMap.forEach((duplicates) => {
    if (duplicates.length > 1) {
      duplicates.forEach((page) => {
        issues.push({
          id: `${page.id}-duplicate`,
          pageName: page.name,
          url: page.url,
          type: "Duplicate Tags",
          message: "This page shares a meta title with another page.",
        });
      });
    }
  });

  const score = Math.max(45, Math.round(100 - issues.length * 7));

  return { issues, score };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function slugifyName(name: string) {
  return (
    "/" +
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

type SeoAdminShellProps = {
  embedded?: boolean;
  initialSection?: DashboardSection;
};

export default function SeoAdminShell({
  embedded = false,
  initialSection = "dashboard",
}: SeoAdminShellProps) {
  const persistedState = getPersistedState();
  const [activeSection, setActiveSection] = useState<DashboardSection>(initialSection);
  const [pages, setPages] = useState<SeoPage[]>(
    () => persistedState?.pages?.length ? persistedState.pages : initialPages,
  );
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(
    () => persistedState?.globalSettings ?? initialGlobalSettings,
  );
  const [sitemap, setSitemap] = useState<SitemapState>(
    () =>
      persistedState?.sitemap ?? {
        ...initialSitemap,
        xml: createSitemapXml(persistedState?.pages?.length ? persistedState.pages : initialPages),
      },
  );
  const [redirects, setRedirects] = useState<RedirectRule[]>(
    () => persistedState?.redirects ?? initialRedirects,
  );
  const [roles, setRoles] = useState<RolePermission[]>(
    () => persistedState?.roles ?? initialRoles,
  );
  const [theme, setTheme] = useState<"light" | "dark">(
    () => persistedState?.theme ?? "light",
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pageSearch, setPageSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "complete" | "incomplete">(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [managerForm, setManagerForm] =
    useState<PageManagerForm>(blankPageManagerForm);
  const [managerErrors, setManagerErrors] = useState<Record<string, string>>({});
  const [selectedPageId, setSelectedPageId] = useState<string>(initialPages[0]?.id ?? "");
  const [editorErrors, setEditorErrors] = useState<Record<string, string>>({});
  const [redirectForm, setRedirectForm] = useState({
    from: "",
    to: "",
    type: "301" as "301" | "302",
  });
  const [redirectErrors, setRedirectErrors] = useState<Record<string, string>>({});
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditRefreshKey, setAuditRefreshKey] = useState(0);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const state: PersistedState = {
      pages,
      globalSettings,
      sitemap,
      redirects,
      roles,
      theme,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [globalSettings, pages, redirects, roles, sitemap, theme]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (!toasts.length) {
      return;
    }
    const timer = window.setTimeout(() => {
      setToasts((current) => current.slice(1));
    }, 2600);

    return () => window.clearTimeout(timer);
  }, [toasts]);

  const resolvedSelectedPageId =
    pages.some((page) => page.id === selectedPageId) ? selectedPageId : (pages[0]?.id ?? "");

  const selectedPage = useMemo(
    () => pages.find((page) => page.id === resolvedSelectedPageId) ?? pages[0] ?? null,
    [pages, resolvedSelectedPageId],
  );

  const filteredPages = useMemo(() => {
    return pages.filter((page) => {
      const matchesSearch =
        page.name.toLowerCase().includes(pageSearch.toLowerCase()) ||
        page.url.toLowerCase().includes(pageSearch.toLowerCase()) ||
        page.metaTitle.toLowerCase().includes(pageSearch.toLowerCase());
      const matchesFilter = statusFilter === "all" ? true : page.status === statusFilter;
      return matchesSearch && matchesFilter;
    });
  }, [pageSearch, pages, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPages.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedPages = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredPages.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPages, safeCurrentPage]);

  const auditResult = useMemo(() => {
    void auditRefreshKey;
    return buildAudit(pages);
  }, [auditRefreshKey, pages]);

  const summaryCards = useMemo(() => {
    const duplicateCount = auditResult.issues.filter(
      (issue) => issue.type === "Duplicate Tags",
    ).length;
    const missingTitles = pages.filter((page) => !page.metaTitle.trim()).length;
    const indexed = pages.filter((page) => page.indexed).length;

    return baseSummaryCards.map((card) => {
      switch (card.id) {
        case "indexed":
          return {
            ...card,
            value: String(indexed),
            hint: `${pages.length - indexed} pages still need indexing review`,
          };
        case "missing":
          return {
            ...card,
            value: String(missingTitles),
            hint: missingTitles ? "Priority pages should be fixed first" : "No missing title issues",
          };
        case "duplicate":
          return {
            ...card,
            value: String(duplicateCount),
            hint: duplicateCount ? "Duplicate metadata weakens clarity" : "Meta tags are unique",
          };
        default:
          return {
            ...card,
            value: `${auditResult.score}/100`,
            hint: "Calculated from audit issues and completion status",
          };
      }
    });
  }, [auditResult, pages]);

  function pushToast(title: string, description: string, tone: ToastItem["tone"] = "info") {
    setToasts((current) => [
      ...current,
      { id: Date.now() + Math.random(), title, description, tone },
    ]);
  }

  function validateManagerForm(form: PageManagerForm) {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) {
      errors.name = "Page name is required.";
    }
    if (!form.url.trim()) {
      errors.url = "URL is required.";
    } else if (!form.url.startsWith("/")) {
      errors.url = "URL must start with /";
    }
    return errors;
  }

  function validateEditorForm(page: SeoPage) {
    const errors: Record<string, string> = {};
    if (!page.metaTitle.trim()) {
      errors.metaTitle = "Meta title is required.";
    }
    if (!page.metaDescription.trim()) {
      errors.metaDescription = "Meta description is required.";
    }
    if (!page.canonicalUrl.trim()) {
      errors.canonicalUrl = "Canonical URL is required.";
    }
    return errors;
  }

  function handleRefresh() {
    setAuditRefreshKey((current) => current + 1);
    setSitemap((current) => ({
      ...current,
      lastGenerated: new Date().toISOString(),
      xml: createSitemapXml(pages),
    }));
    pushToast("Dashboard refreshed", "Latest SEO metrics and sitemap data are now in sync.", "success");
  }

  function handleManagerSubmit() {
    const errors = validateManagerForm(managerForm);
    setManagerErrors(errors);
    if (Object.keys(errors).length) {
      pushToast("Validation failed", "Please complete the required page details.", "warning");
      return;
    }

    if (managerForm.id) {
      setPages((current) =>
        current.map((page) =>
          page.id === managerForm.id
            ? {
                ...page,
                name: managerForm.name.trim(),
                url: managerForm.url.trim(),
                status: managerForm.status,
                indexed: managerForm.indexed,
                updatedAt: new Date().toISOString(),
              }
            : page,
        ),
      );
      pushToast("Page updated", "The page entry was updated successfully.", "success");
    } else {
      const nextUrl = managerForm.url.trim() || slugifyName(managerForm.name);
      const newPage: SeoPage = {
        id: `page-${Date.now()}`,
        name: managerForm.name.trim(),
        url: nextUrl,
        status: managerForm.status,
        indexed: managerForm.indexed,
        metaTitle: "",
        metaDescription: "",
        keywords: "",
        canonicalUrl: `https://indianroller.com${nextUrl}`,
        robots: globalSettings.robotsDefault,
        openGraphTitle: "",
        openGraphDescription: "",
        openGraphImage: "",
        twitterTitle: "",
        twitterDescription: "",
        twitterCard: "summary_large_image",
        updatedAt: new Date().toISOString(),
      };

      setPages((current) => [newPage, ...current]);
      setSelectedPageId(newPage.id);
      pushToast("Page added", "A new SEO page was created and is ready for optimization.", "success");
    }

    setManagerForm(blankPageManagerForm);
    setManagerErrors({});
  }

  function handleDeletePage(id: string) {
    setPages((current) => current.filter((page) => page.id !== id));
    if (selectedPageId === id) {
      const remaining = pages.filter((page) => page.id !== id);
      setSelectedPageId(remaining[0]?.id ?? "");
    }
    pushToast("Page deleted", "The selected page has been removed from the manager.", "warning");
  }

  function updateSelectedPage(field: keyof SeoPage, value: string | boolean) {
    if (!selectedPage) {
      return;
    }

    setPages((current) =>
      current.map((page) =>
        page.id === selectedPage.id
          ? {
              ...page,
              [field]: value,
              updatedAt: new Date().toISOString(),
            }
          : page,
      ),
    );
  }

  function handleSaveEditor() {
    if (!selectedPage) {
      return;
    }

    const errors = validateEditorForm(selectedPage);
    setEditorErrors(errors);
    if (Object.keys(errors).length) {
      pushToast("SEO data incomplete", "Fill in the required SEO fields before saving.", "warning");
      return;
    }

    setPages((current) =>
      current.map((page) =>
        page.id === selectedPage.id
          ? { ...page, status: "complete", updatedAt: new Date().toISOString() }
          : page,
      ),
    );
    pushToast("SEO page saved", "Metadata changes were saved successfully.", "success");
  }

  function handleFixMissingTags() {
    const target = pages.find((page) => !page.metaTitle.trim()) ?? pages[0];
    if (!target) {
      return;
    }
    setSelectedPageId(target.id);
    setActiveSection("editor");
    pushToast("Quick action ready", `Opened ${target.name} so you can fix its missing metadata.`, "info");
  }

  function handleGenerateSitemap() {
    setSitemap({
      autoGenerate: sitemap.autoGenerate,
      lastGenerated: new Date().toISOString(),
      xml: createSitemapXml(pages),
    });
    pushToast("Sitemap generated", "A fresh sitemap.xml was generated from the latest page list.", "success");
  }

  function handleDownloadSitemap() {
    const blob = new Blob([sitemap.xml], { type: "application/xml" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "sitemap.xml";
    anchor.click();
    window.URL.revokeObjectURL(url);
    pushToast("Download started", "The sitemap.xml file has been downloaded.", "success");
  }

  function handlePingSearchEngines() {
    pushToast("Ping sent", "Search engines were notified about the latest sitemap update.", "success");
  }

  function handleRedirectSubmit() {
    const errors: Record<string, string> = {};
    if (!redirectForm.from.trim()) {
      errors.from = "Old URL is required.";
    }
    if (!redirectForm.to.trim()) {
      errors.to = "New URL is required.";
    }
    setRedirectErrors(errors);
    if (Object.keys(errors).length) {
      pushToast("Redirect not saved", "Add both old and new URLs before saving.", "warning");
      return;
    }

    setRedirects((current) => [
      {
        id: `redirect-${Date.now()}`,
        from: redirectForm.from.trim(),
        to: redirectForm.to.trim(),
        type: redirectForm.type,
        hits: 0,
      },
      ...current,
    ]);
    setRedirectForm({ from: "", to: "", type: "301" });
    setRedirectErrors({});
    pushToast("Redirect created", "The redirect rule is now active in the dashboard.", "success");
  }

  function handleAuditScan() {
    setAuditLoading(true);
    window.setTimeout(() => {
      setAuditRefreshKey((current) => current + 1);
      setAuditLoading(false);
      pushToast("Audit complete", "SEO issues and health score were refreshed.", "success");
    }, 900);
  }

  function toggleRolePermission(id: string, key: keyof Omit<RolePermission, "id" | "role">) {
    setRoles((current) =>
      current.map((role) =>
        role.id === id ? { ...role, [key]: !role[key] } : role,
      ),
    );
  }

  const recentPages = [...pages]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  const content = (
    <main className={embedded ? "" : "px-4 py-6 lg:px-8"}>
      <div className={embedded ? "space-y-6" : "mx-auto max-w-7xl space-y-6"}>
            {(activeSection === "dashboard" || activeSection === "pages") && (
              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => (
                  <SummaryCard key={card.id} card={card} />
                ))}
              </section>
            )}

            {activeSection === "dashboard" ? (
              <>
                <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
                  <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          Quick Actions
                        </p>
                        <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                          Stay on top of your SEO workflow
                        </h3>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <button
                          type="button"
                          onClick={handleFixMissingTags}
                          className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-sky-500"
                        >
                          <WandSparkles className="h-4 w-4" />
                          Fix Missing Tags
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveSection("pages")}
                          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                        >
                          <Globe className="h-4 w-4" />
                          View All Pages
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setManagerForm(blankPageManagerForm);
                            setActiveSection("pages");
                          }}
                          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                        >
                          <FilePlus2 className="h-4 w-4" />
                          Add SEO Page
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Sitemap Status
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                      Auto-generated and ready to publish
                    </h3>
                    <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-950">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Last generated
                      </span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {formatDate(sitemap.lastGenerated)}
                      </span>
                    </div>
                  </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          Recent SEO Pages
                        </p>
                        <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                          Recently edited pages
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveSection("editor")}
                        className="text-sm font-medium text-sky-600 dark:text-sky-400"
                      >
                        Open editor
                      </button>
                    </div>

                    <div className="mt-6 space-y-3">
                      {recentPages.map((page) => (
                        <button
                          key={page.id}
                          type="button"
                          onClick={() => {
                            setSelectedPageId(page.id);
                            setActiveSection("editor");
                          }}
                          className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-left transition hover:border-sky-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-sky-700 dark:hover:bg-slate-950"
                        >
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{page.name}</p>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              {page.url}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                page.status === "complete"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                  : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                              }`}
                            >
                              {page.status}
                            </span>
                            <p className="mt-2 text-xs text-slate-400">{formatDate(page.updatedAt)}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          Audit Overview
                        </p>
                        <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                          Most recent scan results
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={handleAuditScan}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-100 dark:hover:bg-slate-950"
                      >
                        <ScanSearch className="h-4 w-4" />
                        {auditLoading ? "Scanning..." : "Scan pages"}
                      </button>
                    </div>

                    <div className="mt-6 space-y-3">
                      {auditResult.issues.slice(0, 4).map((issue) => (
                        <div
                          key={issue.id}
                          className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">
                                {issue.pageName}
                              </p>
                              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                {issue.message}
                              </p>
                            </div>
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                              {issue.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </>
            ) : null}

            {activeSection === "pages" ? (
              <section className="grid gap-6 xl:grid-cols-[0.9fr_1.3fr]">
                <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Add or edit page
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                        Page form
                      </h3>
                    </div>
                    {managerForm.id ? (
                      <button
                        type="button"
                        onClick={() => {
                          setManagerForm(blankPageManagerForm);
                          setManagerErrors({});
                        }}
                        className="text-sm font-medium text-sky-600 dark:text-sky-400"
                      >
                        Clear form
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                        Page name
                      </label>
                      <input
                        value={managerForm.name}
                        onChange={(event) =>
                          setManagerForm((current) => ({
                            ...current,
                            name: event.target.value,
                            url:
                              current.id || current.url
                                ? current.url
                                : slugifyName(event.target.value),
                          }))
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                        placeholder="Example: Careers"
                      />
                      {managerErrors.name ? (
                        <p className="mt-2 text-sm text-rose-500">{managerErrors.name}</p>
                      ) : null}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                        URL
                      </label>
                      <input
                        value={managerForm.url}
                        onChange={(event) =>
                          setManagerForm((current) => ({ ...current, url: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                        placeholder="/careers"
                      />
                      {managerErrors.url ? (
                        <p className="mt-2 text-sm text-rose-500">{managerErrors.url}</p>
                      ) : null}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                          Status
                        </label>
                        <select
                          value={managerForm.status}
                          onChange={(event) =>
                            setManagerForm((current) => ({
                              ...current,
                              status: event.target.value as "complete" | "incomplete",
                            }))
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                        >
                          <option value="complete">complete</option>
                          <option value="incomplete">incomplete</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                          Indexed
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setManagerForm((current) => ({
                              ...current,
                              indexed: !current.indexed,
                            }))
                          }
                          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                            managerForm.indexed
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                          }`}
                        >
                          {managerForm.indexed ? "Indexed" : "Not indexed"}
                          {managerForm.indexed ? <Check className="h-4 w-4" /> : null}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleManagerSubmit}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-sky-500"
                    >
                      <Plus className="h-4 w-4" />
                      {managerForm.id ? "Update Page" : "Add Page"}
                    </button>
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        All website pages
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                        Pages Manager
                      </h3>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
                        <Search className="h-4 w-4 text-slate-400" />
                        <input
                          value={pageSearch}
                          onChange={(event) => {
                            setPageSearch(event.target.value);
                            setCurrentPage(1);
                          }}
                          placeholder="Search pages"
                          className="bg-transparent text-sm outline-none"
                        />
                      </label>

                      <select
                        value={statusFilter}
                        onChange={(event) => {
                          setStatusFilter(
                            event.target.value as "all" | "complete" | "incomplete",
                          );
                          setCurrentPage(1);
                        }}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none dark:border-slate-800 dark:bg-slate-950"
                      >
                        <option value="all">All statuses</option>
                        <option value="complete">Complete</option>
                        <option value="incomplete">Incomplete</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
                    <div className="hidden grid-cols-[1.2fr_1.1fr_0.7fr_0.7fr_0.9fr] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 md:grid dark:bg-slate-950">
                      <span>Page</span>
                      <span>URL</span>
                      <span>Status</span>
                      <span>Indexed</span>
                      <span>Actions</span>
                    </div>

                    <div className="divide-y divide-slate-200 dark:divide-slate-800">
                      {paginatedPages.map((page) => (
                        <div
                          key={page.id}
                          className="grid gap-4 px-4 py-4 md:grid-cols-[1.2fr_1.1fr_0.7fr_0.7fr_0.9fr] md:items-center"
                        >
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{page.name}</p>
                            <p className="mt-1 text-xs text-slate-400">
                              Updated {formatDate(page.updatedAt)}
                            </p>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{page.url}</p>
                          <span
                            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                              page.status === "complete"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            }`}
                          >
                            {page.status}
                          </span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {page.indexed ? "Yes" : "No"}
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setManagerForm({
                                  id: page.id,
                                  name: page.name,
                                  url: page.url,
                                  status: page.status,
                                  indexed: page.indexed,
                                })
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-100 dark:hover:bg-slate-950"
                            >
                              <PencilLine className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePage(page.id)}
                              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Showing {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}-
                      {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredPages.length)} of{" "}
                      {filteredPages.length} pages
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={safeCurrentPage === 1}
                        onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
                        className="rounded-xl border border-slate-200 p-2 disabled:opacity-40 dark:border-slate-800"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        {safeCurrentPage} / {totalPages}
                      </span>
                      <button
                        type="button"
                        disabled={safeCurrentPage === totalPages}
                        onClick={() =>
                          setCurrentPage((current) => Math.min(totalPages, current + 1))
                        }
                        className="rounded-xl border border-slate-200 p-2 disabled:opacity-40 dark:border-slate-800"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            ) : null}

            {activeSection === "editor" && selectedPage ? (
              <section className="grid gap-6 xl:grid-cols-[0.85fr_1.35fr]">
                <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Select page
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                    SEO pages
                  </h3>
                  <div className="mt-6 space-y-3">
                    {pages.map((page) => (
                      <button
                        key={page.id}
                        type="button"
                        onClick={() => {
                          setSelectedPageId(page.id);
                          setEditorErrors({});
                        }}
                        className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                          page.id === resolvedSelectedPageId
                            ? "border-sky-300 bg-sky-50 dark:border-sky-700 dark:bg-sky-950/30"
                            : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{page.name}</p>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              {page.url}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              page.status === "complete"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            }`}
                          >
                            {page.status}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Editing {selectedPage.name}
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                        Metadata editor
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveEditor}
                      className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-sky-500"
                    >
                      <Check className="h-4 w-4" />
                      Save SEO Data
                    </button>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                        Meta Title
                      </label>
                      <input
                        value={selectedPage.metaTitle}
                        onChange={(event) => updateSelectedPage("metaTitle", event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                      />
                      {editorErrors.metaTitle ? (
                        <p className="mt-2 text-sm text-rose-500">{editorErrors.metaTitle}</p>
                      ) : null}
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                        Meta Description
                      </label>
                      <textarea
                        rows={4}
                        value={selectedPage.metaDescription}
                        onChange={(event) =>
                          updateSelectedPage("metaDescription", event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                      />
                      {editorErrors.metaDescription ? (
                        <p className="mt-2 text-sm text-rose-500">{editorErrors.metaDescription}</p>
                      ) : null}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                        Keywords
                      </label>
                      <input
                        value={selectedPage.keywords}
                        onChange={(event) => updateSelectedPage("keywords", event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                        Canonical URL
                      </label>
                      <input
                        value={selectedPage.canonicalUrl}
                        onChange={(event) =>
                          updateSelectedPage("canonicalUrl", event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                      />
                      {editorErrors.canonicalUrl ? (
                        <p className="mt-2 text-sm text-rose-500">{editorErrors.canonicalUrl}</p>
                      ) : null}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                        Robots Meta Tag
                      </label>
                      <select
                        value={selectedPage.robots}
                        onChange={(event) => updateSelectedPage("robots", event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                      >
                        <option value="index, follow">index, follow</option>
                        <option value="noindex, follow">noindex, follow</option>
                        <option value="noindex, nofollow">noindex, nofollow</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                        Twitter Card
                      </label>
                      <select
                        value={selectedPage.twitterCard}
                        onChange={(event) => updateSelectedPage("twitterCard", event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                      >
                        <option value="summary">summary</option>
                        <option value="summary_large_image">summary_large_image</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                        Open Graph Title
                      </label>
                      <input
                        value={selectedPage.openGraphTitle}
                        onChange={(event) =>
                          updateSelectedPage("openGraphTitle", event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                        Open Graph Image
                      </label>
                      <input
                        value={selectedPage.openGraphImage}
                        onChange={(event) =>
                          updateSelectedPage("openGraphImage", event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                        Open Graph Description
                      </label>
                      <textarea
                        rows={3}
                        value={selectedPage.openGraphDescription}
                        onChange={(event) =>
                          updateSelectedPage("openGraphDescription", event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                        Twitter Title
                      </label>
                      <input
                        value={selectedPage.twitterTitle}
                        onChange={(event) =>
                          updateSelectedPage("twitterTitle", event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                        Twitter Description
                      </label>
                      <input
                        value={selectedPage.twitterDescription}
                        onChange={(event) =>
                          updateSelectedPage("twitterDescription", event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                      />
                    </div>
                  </div>
                </div>
              </section>
            ) : null}

            {activeSection === "settings" ? (
              <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Global SEO defaults
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                      Default meta tags and verification settings
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      pushToast(
                        "Settings saved",
                        "Global SEO defaults were updated successfully.",
                        "success",
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-sky-500"
                  >
                    <Check className="h-4 w-4" />
                    Save Settings
                  </button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                      Default Meta Title
                    </label>
                    <input
                      value={globalSettings.defaultMetaTitle}
                      onChange={(event) =>
                        setGlobalSettings((current) => ({
                          ...current,
                          defaultMetaTitle: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                      Default Meta Description
                    </label>
                    <textarea
                      rows={4}
                      value={globalSettings.defaultMetaDescription}
                      onChange={(event) =>
                        setGlobalSettings((current) => ({
                          ...current,
                          defaultMetaDescription: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                      Default Keywords
                    </label>
                    <input
                      value={globalSettings.defaultKeywords}
                      onChange={(event) =>
                        setGlobalSettings((current) => ({
                          ...current,
                          defaultKeywords: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                      Google Verification
                    </label>
                    <input
                      value={globalSettings.googleVerification}
                      onChange={(event) =>
                        setGlobalSettings((current) => ({
                          ...current,
                          googleVerification: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                      Schema Type
                    </label>
                    <select
                      value={globalSettings.schemaType}
                      onChange={(event) =>
                        setGlobalSettings((current) => ({
                          ...current,
                          schemaType: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                    >
                      <option value="Organization">Organization</option>
                      <option value="WebSite">WebSite</option>
                      <option value="Product">Product</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                      Default Robots
                    </label>
                    <select
                      value={globalSettings.robotsDefault}
                      onChange={(event) =>
                        setGlobalSettings((current) => ({
                          ...current,
                          robotsDefault: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                    >
                      <option value="index, follow">index, follow</option>
                      <option value="noindex, follow">noindex, follow</option>
                      <option value="noindex, nofollow">noindex, nofollow</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                      Organization Name
                    </label>
                    <input
                      value={globalSettings.organizationName}
                      onChange={(event) =>
                        setGlobalSettings((current) => ({
                          ...current,
                          organizationName: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                      Organization URL
                    </label>
                    <input
                      value={globalSettings.organizationUrl}
                      onChange={(event) =>
                        setGlobalSettings((current) => ({
                          ...current,
                          organizationUrl: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                    />
                  </div>
                </div>
              </section>
            ) : null}

            {activeSection === "sitemap" ? (
              <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Sitemap manager
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                    Generate, download and ping search engines
                  </h3>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Auto-generate sitemap</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Update sitemap when pages change
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSitemap((current) => ({
                            ...current,
                            autoGenerate: !current.autoGenerate,
                          }))
                        }
                        className={`rounded-full px-4 py-2 text-sm font-medium ${
                          sitemap.autoGenerate
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-950 dark:text-slate-300"
                        }`}
                      >
                        {sitemap.autoGenerate ? "Enabled" : "Disabled"}
                      </button>
                    </div>

                    <div className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Last generated</p>
                      <p className="mt-2 font-medium text-slate-900 dark:text-white">
                        {formatDate(sitemap.lastGenerated)}
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <button
                        type="button"
                        onClick={handleGenerateSitemap}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-sky-500"
                      >
                        <WandSparkles className="h-4 w-4" />
                        Generate
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadSitemap}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-100 dark:hover:bg-slate-950"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                      <button
                        type="button"
                        onClick={handlePingSearchEngines}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-100 dark:hover:bg-slate-950"
                      >
                        <ArrowLeftRight className="h-4 w-4" />
                        Ping
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Preview
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                    sitemap.xml
                  </h3>
                  <pre className="mt-6 max-h-[520px] overflow-auto rounded-3xl bg-slate-950 p-5 text-xs leading-6 text-slate-100">
                    {sitemap.xml}
                  </pre>
                </div>
              </section>
            ) : null}

            {activeSection === "redirects" ? (
              <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
                <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Redirect manager
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                    Add 301 and 302 redirects
                  </h3>

                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                        Old URL
                      </label>
                      <input
                        value={redirectForm.from}
                        onChange={(event) =>
                          setRedirectForm((current) => ({
                            ...current,
                            from: event.target.value,
                          }))
                        }
                        placeholder="/old-url"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                      />
                      {redirectErrors.from ? (
                        <p className="mt-2 text-sm text-rose-500">{redirectErrors.from}</p>
                      ) : null}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                        New URL
                      </label>
                      <input
                        value={redirectForm.to}
                        onChange={(event) =>
                          setRedirectForm((current) => ({
                            ...current,
                            to: event.target.value,
                          }))
                        }
                        placeholder="/new-url"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                      />
                      {redirectErrors.to ? (
                        <p className="mt-2 text-sm text-rose-500">{redirectErrors.to}</p>
                      ) : null}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                        Redirect Type
                      </label>
                      <select
                        value={redirectForm.type}
                        onChange={(event) =>
                          setRedirectForm((current) => ({
                            ...current,
                            type: event.target.value as "301" | "302",
                          }))
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950"
                      >
                        <option value="301">301 Permanent</option>
                        <option value="302">302 Temporary</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={handleRedirectSubmit}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-sky-500"
                    >
                      <Plus className="h-4 w-4" />
                      Add Redirect
                    </button>
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Active redirects
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                    Redirect old URLs to new URLs
                  </h3>

                  <div className="mt-6 space-y-3">
                    {redirects.map((redirect) => (
                      <div
                        key={redirect.id}
                        className="flex flex-col gap-4 rounded-2xl border border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between dark:border-slate-800"
                      >
                        <div className="grid gap-2">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {redirect.from}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Redirects to {redirect.to}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                            {redirect.type}
                          </span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {redirect.hits} hits
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setRedirects((current) =>
                                current.filter((item) => item.id !== redirect.id),
                              )
                            }
                            className="rounded-xl border border-rose-200 p-2 text-rose-600 dark:border-rose-900 dark:text-rose-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {activeSection === "audit" ? (
              <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
                <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Audit controls
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                    Scan pages and measure SEO health
                  </h3>

                  <div className="mt-6 rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
                    <p className="text-sm text-slate-500 dark:text-slate-400">SEO score</p>
                    <p className="mt-2 text-4xl font-semibold text-slate-900 dark:text-white">
                      {auditResult.score}
                      <span className="text-lg text-slate-400">/100</span>
                    </p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Based on missing metadata, duplicates and completion status.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAuditScan}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-sky-500"
                  >
                    <ScanSearch className="h-4 w-4" />
                    {auditLoading ? "Scanning pages..." : "Run SEO Audit"}
                  </button>
                </div>

                <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Audit results
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                    Missing titles, duplicate tags and content gaps
                  </h3>

                  <div className="mt-6 space-y-3">
                    {auditResult.issues.map((issue) => (
                      <div
                        key={issue.id}
                        className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {issue.pageName}
                            </p>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              {issue.url}
                            </p>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                              {issue.message}
                            </p>
                          </div>
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                            {issue.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {activeSection === "roles" ? (
              <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Role permissions
                </p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                  Control access by team role
                </h3>

                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                        <th className="pb-4 pr-4">Role</th>
                        <th className="pb-4 pr-4">Dashboard</th>
                        <th className="pb-4 pr-4">Pages</th>
                        <th className="pb-4 pr-4">Editor</th>
                        <th className="pb-4 pr-4">Settings</th>
                        <th className="pb-4 pr-4">Sitemap</th>
                        <th className="pb-4 pr-4">Redirects</th>
                        <th className="pb-4 pr-4">Audit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {roles.map((role) => (
                        <tr key={role.id}>
                          <td className="py-4 pr-4 font-medium text-slate-900 dark:text-white">
                            {role.role}
                          </td>
                          {(
                            [
                              "dashboard",
                              "pages",
                              "editor",
                              "settings",
                              "sitemap",
                              "redirects",
                              "audit",
                            ] as const
                          ).map((key) => (
                            <td key={key} className="py-4 pr-4">
                              <button
                                type="button"
                                onClick={() => toggleRolePermission(role.id, key)}
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  role[key]
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                    : "bg-slate-100 text-slate-500 dark:bg-slate-950 dark:text-slate-400"
                                }`}
                              >
                                {role[key] ? "Allowed" : "Blocked"}
                              </button>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : null}
      </div>
    </main>
  );

  if (embedded) {
    return (
      <div className="min-h-screen bg-transparent text-slate-900 transition-colors dark:text-slate-100">
        <ToastViewport toasts={toasts} />
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <ToastViewport toasts={toasts} />
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        mobileOpen={mobileOpen}
        onMobileToggle={() => setMobileOpen((current) => !current)}
      />

      <div className="lg:pl-72">
        <AdminHeader
          activeSection={activeSection}
          theme={theme}
          onToggleTheme={() =>
            setTheme((current) => (current === "light" ? "dark" : "light"))
          }
          onRefresh={handleRefresh}
        />
        {content}
      </div>
    </div>
  );
}
