"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Save } from "lucide-react";
import api from "@/lib/axios";

type DisplayType = "category" | "product";
type SectionKey = "industry" | "material";

type NavbarItemConfig = {
  type: DisplayType;
  refId: string;
  enabled: boolean;
  order: number;
  icon: string;
  categoryReference: string;
};

type NavbarItemView = NavbarItemConfig & {
  name: string;
  slug: string;
};

type NavbarSectionConfig = {
  key: SectionKey;
  title: string;
  displayType: DisplayType;
  items: NavbarItemConfig[];
};

type CategoryRecord = {
  _id: string;
  name: string;
  slug: string;
};

type ProductCategoryRecord = {
  _id?: string;
  name?: string;
  slug?: string;
};

type ProductRecord = {
  _id: string;
  name: string;
  slug: string;
  category?: ProductCategoryRecord | string | null;
  categories?: Array<ProductCategoryRecord | string>;
};

function safeNumber(value: unknown, fallback = 0) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function normalizeItems<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => safeNumber(a.order, 0) - safeNumber(b.order, 0));
}

function normalizeSequential<T extends { order: number }>(items: T[]): T[] {
  return normalizeItems(items).map((item, index) => ({
    ...item,
    order: index + 1,
  })) as T[];
}

function getProductCategoryReference(product: ProductRecord) {
  if (Array.isArray(product.categories) && product.categories.length > 0) {
    const firstCategory = product.categories[0];
    return typeof firstCategory === "string" ? firstCategory : firstCategory?.slug || firstCategory?.name || "";
  }

  if (product.category && typeof product.category !== "string") {
    return product.category.slug || product.category.name || "";
  }

  return typeof product.category === "string" ? product.category : "";
}

export default function NavbarSettingsPanel() {
  const [sections, setSections] = useState<NavbarSectionConfig[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      setError("");

      try {
        const [configRes, categoriesRes, productsRes] = await Promise.all([
          api.get("/navbar/products-dropdown/config"),
          api.get("/categories"),
          api.get("/products"),
        ]);

        setSections(Array.isArray(configRes.data?.sections) ? configRes.data.sections : []);
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
        setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      } catch (loadError) {
        console.error(loadError);
        setError("Could not load navbar dropdown settings.");
      } finally {
        setLoading(false);
      }
    }

    void loadAll();
  }, []);

  const categoryOptions = useMemo(
    () => categories.map((category) => ({
      refId: category._id,
      name: category.name,
      slug: category.slug,
      categoryReference: "",
    })),
    [categories],
  );

  const productOptions = useMemo(
    () => products.map((product) => ({
      refId: product._id,
      name: product.name,
      slug: product.slug,
      categoryReference: getProductCategoryReference(product),
    })),
    [products],
  );

  function updateSection(sectionKey: SectionKey, updater: (section: NavbarSectionConfig) => NavbarSectionConfig) {
    setSections((current) => current.map((section) => (section.key === sectionKey ? updater(section) : section)));
    setMessage("");
  }

function getMergedItems(section: NavbarSectionConfig, itemType: DisplayType): NavbarItemView[] {
    const sourceItems = itemType === "category" ? categoryOptions : productOptions;

    return normalizeItems(
      sourceItems.map((source, index) => {
        const existing = section.items.find((item) => item.type === itemType && item.refId === source.refId);
        return {
          type: itemType,
          refId: source.refId,
          enabled: existing?.enabled ?? false,
          order: existing?.order ?? index + 1,
          icon: existing?.icon ?? "",
          categoryReference: existing?.categoryReference ?? source.categoryReference,
          name: source.name,
          slug: source.slug,
        };
      }),
    );
  }

  function replaceItemsForType(sectionKey: SectionKey, itemType: DisplayType, items: NavbarItemView[]) {
    updateSection(sectionKey, (section) => {
      const otherItems = section.items.filter((item) => item.type !== itemType);
      const cleanedItems: NavbarItemConfig[] = items.map((item) => ({
        type: itemType,
        refId: item.refId,
        enabled: item.enabled,
        order: safeNumber(item.order, 0),
        icon: item.icon || "",
        categoryReference: item.categoryReference || "",
      }));

      return {
        ...section,
        items: [...otherItems, ...cleanedItems],
      };
    });
  }

  function updateDisplayType(sectionKey: SectionKey, displayType: DisplayType) {
    updateSection(sectionKey, (section) => ({ ...section, displayType }));
  }

  function updateItemField(sectionKey: SectionKey, itemType: DisplayType, refId: string, field: keyof NavbarItemConfig, value: string | number | boolean) {
    const section = sections.find((entry) => entry.key === sectionKey);
    if (!section) return;

    const nextItems = getMergedItems(section, itemType).map((item) =>
      item.refId === refId ? { ...item, [field]: value } : item,
    );

    replaceItemsForType(sectionKey, itemType, nextItems);
  }

  function moveItem(sectionKey: SectionKey, itemType: DisplayType, refId: string, direction: "up" | "down") {
    const section = sections.find((entry) => entry.key === sectionKey);
    if (!section) return;

    const currentItems = normalizeSequential(getMergedItems(section, itemType));
    const currentIndex = currentItems.findIndex((item) => item.refId === refId);
    if (currentIndex === -1) return;

    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (swapIndex < 0 || swapIndex >= currentItems.length) return;

    const nextItems = [...currentItems];
    [nextItems[currentIndex], nextItems[swapIndex]] = [nextItems[swapIndex], nextItems[currentIndex]];
    replaceItemsForType(sectionKey, itemType, normalizeSequential(nextItems));
  }

  async function saveSettings() {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        sections: sections.map((section) => ({
          ...section,
          items: section.items.map((item) => ({
            type: item.type,
            refId: item.refId,
            enabled: item.enabled,
            order: safeNumber(item.order, 0),
            icon: item.icon || "",
            categoryReference: item.categoryReference || "",
          })),
        })),
      };

      const response = await api.put("/navbar/products-dropdown/config", payload);
      setSections(Array.isArray(response.data?.sections) ? response.data.sections : payload.sections);
      setMessage("Navbar dropdown settings updated.");
    } catch (saveError) {
      console.error(saveError);
      setError("Navbar dropdown settings could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Dynamic Navbar Management</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Control each Products dropdown section, switch between category mode and product mode, and manage ordering without frontend edits.
          </p>
        </div>
        <button
          type="button"
          onClick={saveSettings}
          disabled={loading || saving}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60 dark:bg-orange-500"
        >
          <Save className="h-4 w-4" />
          Save Navbar Settings
        </button>
      </div>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
      {message ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}

      {loading ? (
        <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          Loading navbar settings...
        </section>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {sections.map((section) => {
            const activeItems = getMergedItems(section, section.displayType);

            return (
              <section
                key={section.key}
                className="rounded-[30px] border border-slate-200/80 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.18),_transparent_38%),linear-gradient(180deg,#0f172a,#020617)] p-6 text-white shadow-sm"
              >
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">Products Dropdown</p>
                    <h3 className="mt-2 text-2xl font-semibold">{section.title}</h3>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-1">
                    {["category", "product"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => updateDisplayType(section.key, type as DisplayType)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${
                          section.displayType === type ? "bg-orange-500 text-white" : "text-slate-300"
                        }`}
                      >
                        Show {type === "category" ? "Categories" : "Products"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
                  Display type is set to <span className="font-semibold text-orange-300">{section.displayType}</span>. Use enable toggles, ordering, and optional icon/category reference fields below.
                </div>

                <div className="space-y-3">
                  {activeItems.map((item, index) => (
                    <div key={item.refId} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-white">{item.name}</p>
                          <p className="mt-1 text-sm text-slate-300">/{item.slug}</p>
                        </div>

                        <label className="inline-flex items-center gap-2 text-sm text-slate-200">
                          <input
                            type="checkbox"
                            checked={item.enabled}
                            onChange={(event) => updateItemField(section.key, section.displayType, item.refId, "enabled", event.target.checked)}
                            className="h-4 w-4 rounded border-white/20 bg-transparent"
                          />
                          Enabled
                        </label>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <label className="text-sm text-slate-300">
                          <span className="mb-2 block">Order</span>
                          <input
                            type="number"
                            min={1}
                            value={item.order}
                            onChange={(event) => updateItemField(section.key, section.displayType, item.refId, "order", Math.max(1, safeNumber(event.target.value, 1)))}
                            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none"
                          />
                        </label>

                        <label className="text-sm text-slate-300">
                          <span className="mb-2 block">Icon Key (Optional)</span>
                          <input
                            value={item.icon}
                            onChange={(event) => updateItemField(section.key, section.displayType, item.refId, "icon", event.target.value)}
                            placeholder="industry, textile, box"
                            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none"
                          />
                        </label>

                        <label className="text-sm text-slate-300">
                          <span className="mb-2 block">Category Reference</span>
                          <select
                            value={item.categoryReference || ""}
                            onChange={(event) => updateItemField(section.key, section.displayType, item.refId, "categoryReference", event.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none"
                          >
                            <option value="">None</option>
                            {categories.map((category) => (
                              <option key={category._id} value={category.slug}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </label>

                        <div className="flex items-end gap-2">
                          <button
                            type="button"
                            onClick={() => moveItem(section.key, section.displayType, item.refId, "up")}
                            disabled={index === 0}
                            className="rounded-xl border border-white/10 bg-black/30 p-3 text-white disabled:opacity-40"
                            aria-label={`Move ${item.name} up`}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem(section.key, section.displayType, item.refId, "down")}
                            disabled={index === activeItems.length - 1}
                            className="rounded-xl border border-white/10 bg-black/30 p-3 text-white disabled:opacity-40"
                            aria-label={`Move ${item.name} down`}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
