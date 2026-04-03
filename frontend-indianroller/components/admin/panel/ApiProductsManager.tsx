"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, PencilLine, Plus, Search, Trash2 } from "lucide-react";
import api from "@/lib/axios";
import RichTextEditor from "@/components/admin/RichTextEditor";

type TabKey = "categories" | "products" | "add";

type Category = {
  _id: string;
  name: string;
  description?: string;
};

type Product = {
  _id: string;
  name: string;
  slug?: string;
  sku?: string;
  category?: { _id: string; name: string } | string | null;
  categories?: Array<{ _id: string; name: string } | string>;
  shortDescription?: string;
  image?: string;
  images?: string[];
  fullDescription?: string;
  description?: string;
  specifications?: Array<{ label: string; value: string }>;
  features?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  relatedProducts?: Array<{ _id: string; name: string } | string>;
};

type Props = {
  initialTab: TabKey;
};

type CategoryForm = {
  id: string;
  name: string;
  description: string;
  imageFile: File | null;
};

type ProductForm = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryIds: string[];
  shortDescription: string;
  imageFile: File | null;
  fullDescription: string;
  imageFiles: File[];
  videoFile: File | null;
  technicalDrawingFile: File | null;
  catalogFile: File | null;
  specifications: Array<{ label: string; value: string }>;
  features: string[];
  faqs: Array<{ question: string; answer: string }>;
  relatedProducts: string[];
};

const emptyCategory: CategoryForm = {
  id: "",
  name: "",
  description: "",
  imageFile: null,
};

const emptyProduct: ProductForm = {
  id: "",
  name: "",
  slug: "",
  sku: "",
  categoryIds: [],
  shortDescription: "",
  imageFile: null,
  fullDescription: "",
  imageFiles: [],
  videoFile: null,
  technicalDrawingFile: null,
  catalogFile: null,
  specifications: [{ label: "", value: "" }],
  features: [""],
  faqs: [{ question: "", answer: "" }],
  relatedProducts: [],
};

function categoryIdsOf(product: Product) {
  if (Array.isArray(product.categories) && product.categories.length) {
    return product.categories
      .map((category) => (typeof category === "string" ? category : category?._id))
      .filter(Boolean) as string[];
  }

  if (!product.category) {
    return [];
  }

  return [typeof product.category === "string" ? product.category : product.category._id].filter(Boolean);
}

export default function ApiProductsManager({ initialTab }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(emptyCategory);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [categoriesRes, productsRes] = await Promise.all([
        api.get("/categories"),
        api.get("/products"),
      ]);

      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
    } catch (loadError) {
      console.error(loadError);
      setError("Could not load products or categories from the backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      `${product.name || ""} ${product.slug || ""} ${product.sku || ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [products, search]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / 5));
  const safePage = Math.min(page, totalPages);
  const visibleProducts = filteredProducts.slice((safePage - 1) * 5, safePage * 5);

  async function saveCategory() {
    if (!categoryForm.name.trim()) {
      setError("Category name is required.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", categoryForm.name.trim());
      formData.append("description", categoryForm.description.trim());
      if (categoryForm.imageFile) formData.append("image", categoryForm.imageFile);

      if (categoryForm.id) {
        await api.put(`/categories/${categoryForm.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Category updated.");
      } else {
        await api.post("/categories", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Category created.");
      }

      setCategoryForm(emptyCategory);
      await loadData();
    } catch (saveError) {
      console.error(saveError);
      setError("Category could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  async function saveProduct() {
    if (!productForm.name.trim() || !productForm.categoryIds.length) {
      setError("Product name and at least one category are required.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", productForm.name.trim());
      formData.append("slug", productForm.slug.trim());
      formData.append("sku", productForm.sku.trim());
      formData.append("categoryIds", JSON.stringify(productForm.categoryIds));
      formData.append("shortDescription", productForm.shortDescription.trim());
      formData.append("fullDescription", productForm.fullDescription.trim());
      formData.append("description", productForm.fullDescription.trim());
      formData.append("specifications", JSON.stringify(productForm.specifications.filter((item) => item.label || item.value)));
      formData.append("features", JSON.stringify(productForm.features.filter(Boolean)));
      formData.append("faqs", JSON.stringify(productForm.faqs.filter((item) => item.question || item.answer)));
      formData.append("relatedProducts", JSON.stringify(productForm.relatedProducts));

      if (productForm.imageFile) formData.append("image", productForm.imageFile);
      productForm.imageFiles.forEach((file) => formData.append("images", file));
      if (productForm.videoFile) formData.append("video", productForm.videoFile);
      if (productForm.technicalDrawingFile) formData.append("technicalDrawing", productForm.technicalDrawingFile);
      if (productForm.catalogFile) formData.append("catalogDownload", productForm.catalogFile);

      if (productForm.id) {
        await api.put(`/products/${productForm.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Product updated.");
      } else {
        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Product created.");
      }

      setProductForm(emptyProduct);
      setActiveTab("products");
      await loadData();
    } catch (saveError) {
      console.error(saveError);
      setError("Product could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  async function removeCategory(id: string) {
    try {
      await api.delete(`/categories/${id}`);
      setMessage("Category deleted.");
      await loadData();
    } catch (deleteError) {
      console.error(deleteError);
      setError("Category could not be deleted.");
    }
  }

  async function removeProduct(id: string) {
    try {
      await api.delete(`/products/${id}`);
      setMessage("Product deleted.");
      await loadData();
    } catch (deleteError) {
      console.error(deleteError);
      setError("Product could not be deleted.");
    }
  }

  function editCategory(category: Category) {
    setCategoryForm({
      id: category._id,
      name: category.name || "",
      description: category.description || "",
      imageFile: null,
    });
    setActiveTab("categories");
  }

  function editProduct(product: Product) {
    setProductForm({
      id: product._id,
      name: product.name || "",
      slug: product.slug || "",
      sku: product.sku || "",
      categoryIds: categoryIdsOf(product),
      shortDescription: product.shortDescription || "",
      imageFile: null,
      fullDescription: product.fullDescription || product.description || "",
      imageFiles: [],
      videoFile: null,
      technicalDrawingFile: null,
      catalogFile: null,
      specifications: product.specifications?.length ? product.specifications : [{ label: "", value: "" }],
      features: product.features?.length ? product.features : [""],
      faqs: product.faqs?.length ? product.faqs : [{ question: "", answer: "" }],
      relatedProducts: (product.relatedProducts || []).map((item) => (typeof item === "string" ? item : item._id)),
    });
    setActiveTab("add");
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
              onClick={() => setActiveTab(key as TabKey)}
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

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
      {message ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}

      {loading ? (
        <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          Loading live product data...
        </section>
      ) : null}

      {!loading && activeTab === "categories" ? (
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
                onChange={(event) => setCategoryForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Category description"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setCategoryForm((current) => ({ ...current, imageFile: event.target.files?.[0] ?? null }))}
                className="w-full text-sm"
              />
              <button
                type="button"
                onClick={saveCategory}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60 dark:bg-orange-500"
              >
                <Plus className="h-4 w-4" />
                {categoryForm.id ? "Update Category" : "Add Category"}
              </button>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category._id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{category.name}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{category.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => editCategory(category)} className="rounded-xl border border-slate-200 p-2 dark:border-slate-800">
                      <PencilLine className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => removeCategory(category._id)} className="rounded-xl border border-rose-200 p-2 text-rose-600 dark:border-rose-900 dark:text-rose-300">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {!loading && activeTab === "products" ? (
        <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-3">
            {visibleProducts.map((product) => (
              <div key={product._id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between dark:border-slate-800">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{product.name}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {product.slug || "-"} | {product.sku || "-"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => editProduct(product)} className="rounded-xl border border-slate-200 p-2 dark:border-slate-800">
                    <PencilLine className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => removeProduct(product._id)} className="rounded-xl border border-rose-200 p-2 text-rose-600 dark:border-rose-900 dark:text-rose-300">
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
            <span className="text-sm text-slate-500 dark:text-slate-400">{safePage} / {totalPages}</span>
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

      {!loading && activeTab === "add" ? (
        <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {productForm.imageFile ? (
            <div className="mb-4">
              <img
                src={URL.createObjectURL(productForm.imageFile)}
                alt="Product preview"
                className="h-24 w-24 rounded-2xl object-cover border border-slate-200 dark:border-slate-800"
              />
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <input value={productForm.name} onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))} placeholder="Product Name" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
            <input value={productForm.slug} onChange={(event) => setProductForm((current) => ({ ...current, slug: event.target.value }))} placeholder="Slug" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
            <input value={productForm.sku} onChange={(event) => setProductForm((current) => ({ ...current, sku: event.target.value }))} placeholder="SKU" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
            <select multiple value={productForm.categoryIds} onChange={(event) => setProductForm((current) => ({ ...current, categoryIds: Array.from(event.target.selectedOptions).map((option) => option.value) }))} className="min-h-36 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950">
              {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
            </select>
            <p className="text-sm text-slate-500 dark:text-slate-400">Hold Ctrl or Cmd to select multiple categories.</p>
            <textarea rows={3} value={productForm.shortDescription} onChange={(event) => setProductForm((current) => ({ ...current, shortDescription: event.target.value }))} placeholder="Short Description" className="md:col-span-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
            <div className="md:col-span-2">
  <RichTextEditor
    value={productForm.fullDescription}
    onChange={(val) => setProductForm((current) => ({ ...current, fullDescription: val }))}
  />
</div>
            <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(event) => setProductForm((current) => ({ ...current, imageFile: event.target.files?.[0] ?? null }))} className="w-full text-sm" />
            <input type="file" accept="video/*" onChange={(event) => setProductForm((current) => ({ ...current, videoFile: event.target.files?.[0] ?? null }))} className="w-full text-sm" />
            <input type="file" accept="image/*,.pdf" onChange={(event) => setProductForm((current) => ({ ...current, technicalDrawingFile: event.target.files?.[0] ?? null }))} className="w-full text-sm" />
            <input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setProductForm((current) => ({ ...current, catalogFile: event.target.files?.[0] ?? null }))} className="w-full text-sm" />
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
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Features</p>
              {productForm.features.map((feature, index) => (
                <input key={`feature-${index}`} value={feature} onChange={(event) => setProductForm((current) => ({ ...current, features: current.features.map((item, itemIndex) => itemIndex === index ? event.target.value : item) }))} placeholder="Feature" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
              ))}
              <button type="button" onClick={() => setProductForm((current) => ({ ...current, features: [...current.features, ""] }))} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-800">Add feature</button>
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
            <select multiple value={productForm.relatedProducts} onChange={(event) => setProductForm((current) => ({ ...current, relatedProducts: Array.from(event.target.selectedOptions).map((option) => option.value) }))} className="min-h-36 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950">
              {products.filter((product) => product._id !== productForm.id).map((product) => <option key={product._id} value={product._id}>{product.name}</option>)}
            </select>
          </div>

          <button type="button" onClick={saveProduct} disabled={saving} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60 dark:bg-orange-500">
            <Plus className="h-4 w-4" />
            {productForm.id ? "Update Product" : "Add Product"}
          </button>
        </section>
      ) : null}
    </div>
  );
}
