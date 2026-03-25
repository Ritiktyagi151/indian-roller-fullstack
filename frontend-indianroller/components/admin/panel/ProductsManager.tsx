"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, PencilLine, Plus, Search, Trash2 } from "lucide-react";

type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  video: string;
  specifications: { label: string; value: string }[];
  technicalDrawings: string[];
  faqs: { question: string; answer: string }[];
  relatedProducts: string[];
  catalogDownload: string;
};

const STORAGE_KEY = "indianroller-admin-products";
const CATEGORY_KEY = "indianroller-admin-categories";

const defaultCategories: Category[] = [
  { id: "cat-1", name: "Rubber Rollers", description: "Industrial rubber rollers", image: "" },
  { id: "cat-2", name: "Polyurethane Rollers", description: "PU-coated rollers", image: "" },
];

const defaultProducts: Product[] = [
  {
    id: "prod-1",
    name: "Paper Mill Drive Roller",
    slug: "paper-mill-drive-roller",
    sku: "IR-PAPER-001",
    categoryId: "cat-1",
    shortDescription: "Durable roller for paper lines",
    fullDescription: "Built for long-run paper line performance with balanced grip and wear resistance.",
    images: [],
    video: "",
    specifications: [
      { label: "Diameter", value: "240 mm" },
      { label: "Length", value: "1800 mm" },
    ],
    technicalDrawings: [],
    faqs: [{ question: "Can this be custom coated?", answer: "Yes, custom compounds are available." }],
    relatedProducts: [],
    catalogDownload: "",
  },
];

type ProductsManagerProps = {
  initialTab: "categories" | "products" | "add";
};

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProductsManager({ initialTab }: ProductsManagerProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window === "undefined") {
      return defaultCategories;
    }

    const saved = window.localStorage.getItem(CATEGORY_KEY);
    return saved ? JSON.parse(saved) : defaultCategories;
  });
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window === "undefined") {
      return defaultProducts;
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultProducts;
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [categoryForm, setCategoryForm] = useState<Category>({ id: "", name: "", description: "", image: "" });
  const [productForm, setProductForm] = useState<Product>({
    id: "",
    name: "",
    slug: "",
    sku: "",
    categoryId: "",
    shortDescription: "",
    fullDescription: "",
    images: [],
    video: "",
    specifications: [{ label: "", value: "" }],
    technicalDrawings: [],
    faqs: [{ question: "", answer: "" }],
    relatedProducts: [],
    catalogDownload: "",
  });

  useEffect(() => {
    window.localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        `${product.name} ${product.slug} ${product.sku}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [products, search],
  );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / 5));
  const safePage = Math.min(page, totalPages);
  const visibleProducts = filteredProducts.slice((safePage - 1) * 5, safePage * 5);

  async function handleCategoryImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const image = await readFileAsDataUrl(file);
    setCategoryForm((current) => ({ ...current, image }));
  }

  async function handleProductFile(
    event: React.ChangeEvent<HTMLInputElement>,
    field: "images" | "technicalDrawings" | "video" | "catalogDownload",
  ) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    if (field === "video" || field === "catalogDownload") {
      const asset = await readFileAsDataUrl(files[0]);
      setProductForm((current) => ({ ...current, [field]: asset }));
      return;
    }

    const assets = await Promise.all(files.map((file) => readFileAsDataUrl(file)));
    setProductForm((current) => ({ ...current, [field]: assets }));
  }

  function saveCategory() {
    if (!categoryForm.name.trim()) return;
    if (categoryForm.id) {
      setCategories((current) =>
        current.map((category) => (category.id === categoryForm.id ? categoryForm : category)),
      );
    } else {
      setCategories((current) => [{ ...categoryForm, id: `cat-${Date.now()}` }, ...current]);
    }
    setCategoryForm({ id: "", name: "", description: "", image: "" });
  }

  function saveProduct() {
    if (!productForm.name.trim()) return;
    const payload = {
      ...productForm,
      slug: productForm.slug || productForm.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };
    if (payload.id) {
      setProducts((current) => current.map((product) => (product.id === payload.id ? payload : product)));
    } else {
      setProducts((current) => [{ ...payload, id: `prod-${Date.now()}` }, ...current]);
    }
    setProductForm({
      id: "",
      name: "",
      slug: "",
      sku: "",
      categoryId: "",
      shortDescription: "",
      fullDescription: "",
      images: [],
      video: "",
      specifications: [{ label: "", value: "" }],
      technicalDrawings: [],
      faqs: [{ question: "", answer: "" }],
      relatedProducts: [],
      catalogDownload: "",
    });
    setActiveTab("products");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          {[
            ["categories", "Product Categories"],
            ["products", "All Products"],
            ["add", "Add Product"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key as ProductsManagerProps["initialTab"])}
              className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                activeTab === key
                  ? "bg-slate-900 text-white dark:bg-orange-500"
                  : "border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "products" ? (
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              className="bg-transparent text-sm outline-none"
            />
          </label>
        ) : null}
      </div>

      {activeTab === "categories" ? (
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="space-y-4">
              <input
                value={categoryForm.name}
                onChange={(event) => setCategoryForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Category name"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950"
              />
              <textarea
                rows={4}
                value={categoryForm.description}
                onChange={(event) =>
                  setCategoryForm((current) => ({ ...current, description: event.target.value }))
                }
                placeholder="Category description"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950"
              />
              <input type="file" accept="image/*" onChange={handleCategoryImage} className="w-full text-sm" />
              <button
                type="button"
                onClick={saveCategory}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white dark:bg-orange-500"
              >
                <Plus className="h-4 w-4" />
                {categoryForm.id ? "Update Category" : "Add Category"}
              </button>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{category.name}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{category.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCategoryForm(category)}
                      className="rounded-xl border border-slate-200 p-2 dark:border-slate-800"
                    >
                      <PencilLine className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategories((current) => current.filter((entry) => entry.id !== category.id))}
                      className="rounded-xl border border-rose-200 p-2 text-rose-600 dark:border-rose-900 dark:text-rose-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {activeTab === "products" ? (
        <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-3">
            {visibleProducts.map((product) => (
              <div key={product.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between dark:border-slate-800">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{product.name}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {product.slug} | {product.sku}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setProductForm(product);
                      setActiveTab("add");
                    }}
                    className="rounded-xl border border-slate-200 p-2 dark:border-slate-800"
                  >
                    <PencilLine className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setProducts((current) => current.filter((entry) => entry.id !== product.id))}
                    className="rounded-xl border border-rose-200 p-2 text-rose-600 dark:border-rose-900 dark:text-rose-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-xl border border-slate-200 p-2 disabled:opacity-40 dark:border-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              className="rounded-xl border border-slate-200 p-2 disabled:opacity-40 dark:border-slate-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      ) : null}

      {activeTab === "add" ? (
        <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-4 md:grid-cols-2">
            <input value={productForm.name} onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))} placeholder="Product Name" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
            <input value={productForm.slug} onChange={(event) => setProductForm((current) => ({ ...current, slug: event.target.value }))} placeholder="Slug" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
            <input value={productForm.sku} onChange={(event) => setProductForm((current) => ({ ...current, sku: event.target.value }))} placeholder="SKU" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
            <select value={productForm.categoryId} onChange={(event) => setProductForm((current) => ({ ...current, categoryId: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950">
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <textarea rows={3} value={productForm.shortDescription} onChange={(event) => setProductForm((current) => ({ ...current, shortDescription: event.target.value }))} placeholder="Short Description" className="md:col-span-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
            <textarea rows={5} value={productForm.fullDescription} onChange={(event) => setProductForm((current) => ({ ...current, fullDescription: event.target.value }))} placeholder="Full Description" className="md:col-span-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
            <input type="file" multiple accept="image/*" onChange={(event) => handleProductFile(event, "images")} className="w-full text-sm" />
            <input type="file" accept="video/*" onChange={(event) => handleProductFile(event, "video")} className="w-full text-sm" />
            <input type="file" multiple accept="image/*,.pdf" onChange={(event) => handleProductFile(event, "technicalDrawings")} className="w-full text-sm" />
            <input type="file" accept=".pdf,.doc,.docx" onChange={(event) => handleProductFile(event, "catalogDownload")} className="w-full text-sm" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Specifications</p>
              {productForm.specifications.map((specification, index) => (
                <div key={`spec-${index}`} className="grid gap-3 md:grid-cols-2">
                  <input value={specification.label} onChange={(event) => setProductForm((current) => ({ ...current, specifications: current.specifications.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item) }))} placeholder="Label" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
                  <input value={specification.value} onChange={(event) => setProductForm((current) => ({ ...current, specifications: current.specifications.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item) }))} placeholder="Value" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
                </div>
              ))}
              <button type="button" onClick={() => setProductForm((current) => ({ ...current, specifications: [...current.specifications, { label: "", value: "" }] }))} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-800">Add specification</button>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">FAQs</p>
              {productForm.faqs.map((faq, index) => (
                <div key={`faq-${index}`} className="space-y-3">
                  <input value={faq.question} onChange={(event) => setProductForm((current) => ({ ...current, faqs: current.faqs.map((item, itemIndex) => itemIndex === index ? { ...item, question: event.target.value } : item) }))} placeholder="Question" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
                  <textarea rows={2} value={faq.answer} onChange={(event) => setProductForm((current) => ({ ...current, faqs: current.faqs.map((item, itemIndex) => itemIndex === index ? { ...item, answer: event.target.value } : item) }))} placeholder="Answer" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
                </div>
              ))}
              <button type="button" onClick={() => setProductForm((current) => ({ ...current, faqs: [...current.faqs, { question: "", answer: "" }] }))} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-800">Add FAQ</button>
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Related Products</label>
            <select
              multiple
              value={productForm.relatedProducts}
              onChange={(event) =>
                setProductForm((current) => ({
                  ...current,
                  relatedProducts: Array.from(event.target.selectedOptions).map((option) => option.value),
                }))
              }
              className="min-h-36 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950"
            >
              {products
                .filter((product) => product.id !== productForm.id)
                .map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
            </select>
          </div>

          <button
            type="button"
            onClick={saveProduct}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white dark:bg-orange-500"
          >
            <Plus className="h-4 w-4" />
            {productForm.id ? "Update Product" : "Add Product"}
          </button>
        </section>
      ) : null}
    </div>
  );
}
