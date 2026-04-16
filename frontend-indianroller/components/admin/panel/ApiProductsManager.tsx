"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, PencilLine, Plus, Search, Trash2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import RichTextEditor from "@/components/admin/RichTextEditor";

type TabKey = "categories" | "products" | "add";

type Category = {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  banner?: {
    desktop?: string;
    mobile?: string;
    height?: string;
  };
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
  video?: string;
  technicalDrawings?: string[];
  catalogDownload?: string;
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
  slug: string;
  description: string;
  bannerHeight: string;
  desktopBannerFile: File | null;
  mobileBannerFile: File | null;
  existingDesktopBanner: string;
  existingMobileBanner: string;
  removeDesktopBanner: boolean;
  removeMobileBanner: boolean;
};

type ProductForm = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryIds: string[];
  shortDescription: string;
  imageFile: File | null;
  existingImage: string;
  fullDescription: string;
  imageFiles: File[];
  existingImages: string[];
  videoFile: File | null;
  existingVideo: string;
  technicalDrawingFile: File | null;
  existingTechnicalDrawings: string[];
  catalogFile: File | null;
  existingCatalogFile: string;
  specifications: Array<{ label: string; value: string }>;
  features: string[];
  faqs: Array<{ question: string; answer: string }>;
  relatedProducts: string[];
};

const emptyCategory: CategoryForm = {
  id: "",
  name: "",
  slug: "",
  description: "",
  bannerHeight: "",
  desktopBannerFile: null,
  mobileBannerFile: null,
  existingDesktopBanner: "",
  existingMobileBanner: "",
  removeDesktopBanner: false,
  removeMobileBanner: false,
};

const emptyProduct: ProductForm = {
  id: "",
  name: "",
  slug: "",
  sku: "",
  categoryIds: [],
  shortDescription: "",
  imageFile: null,
  existingImage: "",
  fullDescription: "",
  imageFiles: [],
  existingImages: [],
  videoFile: null,
  existingVideo: "",
  technicalDrawingFile: null,
  existingTechnicalDrawings: [],
  catalogFile: null,
  existingCatalogFile: "",
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

const allowedBannerMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const maxBannerSizeBytes = 2 * 1024 * 1024;

function resolveAssetUrl(value?: string) {
  if (!value) {
    return "";
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
  return value.startsWith("/") ? `${baseUrl}${value}` : value;
}

export default function ApiProductsManager({ initialTab }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
  const editingProductId = searchParams.get("productId");

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

  useEffect(() => {
    if (initialTab !== "add" || !editingProductId) {
      return;
    }

    let cancelled = false;

    async function hydrateEditingProduct() {
      setError("");

      try {
        const response = await api.get(`/products/${editingProductId}`);
        if (cancelled || !response.data) {
          return;
        }

        setMessage("");
        editProduct(response.data as Product);
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        console.error(loadError);
        setError("The selected product could not be loaded for editing.");
      }
    }

    void hydrateEditingProduct();

    return () => {
      cancelled = true;
    };
  }, [editingProductId, initialTab]);

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
  const desktopBannerPreview = useMemo(() => {
    if (categoryForm.desktopBannerFile) {
      return URL.createObjectURL(categoryForm.desktopBannerFile);
    }

    return resolveAssetUrl(categoryForm.existingDesktopBanner);
  }, [categoryForm.desktopBannerFile, categoryForm.existingDesktopBanner]);
  const mobileBannerPreview = useMemo(() => {
    if (categoryForm.mobileBannerFile) {
      return URL.createObjectURL(categoryForm.mobileBannerFile);
    }

    return resolveAssetUrl(categoryForm.existingMobileBanner);
  }, [categoryForm.mobileBannerFile, categoryForm.existingMobileBanner]);
  const productPrimaryImagePreview = useMemo(() => {
    if (productForm.imageFile) {
      return URL.createObjectURL(productForm.imageFile);
    }

    return resolveAssetUrl(productForm.existingImage);
  }, [productForm.existingImage, productForm.imageFile]);

  useEffect(() => {
    return () => {
      if (desktopBannerPreview.startsWith("blob:")) {
        URL.revokeObjectURL(desktopBannerPreview);
      }
    };
  }, [desktopBannerPreview]);

  useEffect(() => {
    return () => {
      if (mobileBannerPreview.startsWith("blob:")) {
        URL.revokeObjectURL(mobileBannerPreview);
      }
    };
  }, [mobileBannerPreview]);

  useEffect(() => {
    return () => {
      if (productPrimaryImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(productPrimaryImagePreview);
      }
    };
  }, [productPrimaryImagePreview]);

  function validateBannerFile(file: File) {
    if (!allowedBannerMimeTypes.includes(file.type)) {
      return "Only JPG, PNG, and WEBP images are allowed.";
    }

    if (file.size > maxBannerSizeBytes) {
      return "Each banner image must be 2MB or smaller.";
    }

    return "";
  }

  function updateCategoryBanner(field: "desktop" | "mobile", file: File | null) {
    if (file) {
      const validationError = validateBannerFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setError("");
    setCategoryForm((current) =>
      field === "desktop"
        ? {
            ...current,
            desktopBannerFile: file,
            removeDesktopBanner: false,
          }
        : {
            ...current,
            mobileBannerFile: file,
            removeMobileBanner: false,
          },
    );
  }

  function removeCategoryBanner(field: "desktop" | "mobile") {
    setCategoryForm((current) =>
      field === "desktop"
        ? {
            ...current,
            desktopBannerFile: null,
            existingDesktopBanner: "",
            removeDesktopBanner: true,
          }
        : {
            ...current,
            mobileBannerFile: null,
            existingMobileBanner: "",
            removeMobileBanner: true,
          },
    );
  }

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
      formData.append("slug", categoryForm.slug.trim());
      formData.append("description", categoryForm.description.trim());
      formData.append("bannerHeight", categoryForm.bannerHeight.trim());
      formData.append("removeDesktopBanner", String(categoryForm.removeDesktopBanner));
      formData.append("removeMobileBanner", String(categoryForm.removeMobileBanner));
      if (categoryForm.desktopBannerFile) {
        formData.append("bannerDesktop", categoryForm.desktopBannerFile);
      }
      if (categoryForm.mobileBannerFile) {
        formData.append("bannerMobile", categoryForm.mobileBannerFile);
      }

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
      clearEditingProductParam();
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
      slug: category.slug || "",
      description: category.description || "",
      bannerHeight: category.banner?.height || "",
      desktopBannerFile: null,
      mobileBannerFile: null,
      existingDesktopBanner: category.banner?.desktop || category.image || "",
      existingMobileBanner: category.banner?.mobile || "",
      removeDesktopBanner: false,
      removeMobileBanner: false,
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
      existingImage: product.image || "",
      fullDescription: product.fullDescription || product.description || "",
      imageFiles: [],
      existingImages: product.images || [],
      videoFile: null,
      existingVideo: product.video || "",
      technicalDrawingFile: null,
      existingTechnicalDrawings: product.technicalDrawings || [],
      catalogFile: null,
      existingCatalogFile: product.catalogDownload || "",
      specifications: product.specifications?.length ? product.specifications : [{ label: "", value: "" }],
      features: product.features?.length ? product.features : [""],
      faqs: product.faqs?.length ? product.faqs : [{ question: "", answer: "" }],
      relatedProducts: (product.relatedProducts || []).map((item) => (typeof item === "string" ? item : item._id)),
    });
    setActiveTab("add");
  }

  function startProductEdit(productId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("productId", productId);
    router.push(`/admin/add-product?${params.toString()}`);
  }

  function clearEditingProductParam() {
    if (!editingProductId) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("productId");
    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
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
                placeholder="Category Name"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950"
              />
              <input
                value={categoryForm.slug}
                onChange={(event) => setCategoryForm((current) => ({ ...current, slug: event.target.value }))}
                placeholder="Category Slug (URL)"
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
                value={categoryForm.bannerHeight}
                onChange={(event) => setCategoryForm((current) => ({ ...current, bannerHeight: event.target.value }))}
                placeholder="Banner Height (e.g. 450px, 60vh)"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Desktop Banner</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">JPG, PNG, WEBP up to 2MB</p>
                    </div>
                    {(desktopBannerPreview || categoryForm.desktopBannerFile || categoryForm.existingDesktopBanner) ? (
                      <button
                        type="button"
                        onClick={() => removeCategoryBanner("desktop")}
                        className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-medium text-rose-600 dark:border-rose-900 dark:text-rose-300"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                  {desktopBannerPreview ? (
                    <img
                      src={desktopBannerPreview}
                      alt="Desktop banner preview"
                      className="mb-3 h-32 w-full rounded-2xl object-cover border border-slate-200 dark:border-slate-800"
                    />
                  ) : (
                    <div className="mb-3 flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-300 text-sm text-slate-400 dark:border-slate-700">
                      No desktop banner selected
                    </div>
                  )}
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={(event) => updateCategoryBanner("desktop", event.target.files?.[0] ?? null)}
                    className="w-full text-sm"
                  />
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Mobile Banner</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">JPG, PNG, WEBP up to 2MB</p>
                    </div>
                    {(mobileBannerPreview || categoryForm.mobileBannerFile || categoryForm.existingMobileBanner) ? (
                      <button
                        type="button"
                        onClick={() => removeCategoryBanner("mobile")}
                        className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-medium text-rose-600 dark:border-rose-900 dark:text-rose-300"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                  {mobileBannerPreview ? (
                    <img
                      src={mobileBannerPreview}
                      alt="Mobile banner preview"
                      className="mb-3 h-32 w-full rounded-2xl object-cover border border-slate-200 dark:border-slate-800"
                    />
                  ) : (
                    <div className="mb-3 flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-300 text-sm text-slate-400 dark:border-slate-700">
                      No mobile banner selected
                    </div>
                  )}
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={(event) => updateCategoryBanner("mobile", event.target.files?.[0] ?? null)}
                    className="w-full text-sm"
                  />
                </div>
              </div>
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
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Slug: {category.slug || "-"}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{category.description}</p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      Desktop banner: {category.banner?.desktop ? "Saved" : "Not set"} | Mobile banner: {category.banner?.mobile ? "Saved" : "Not set"}
                    </p>
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
                  <button type="button" onClick={() => startProductEdit(product._id)} className="rounded-xl border border-slate-200 p-2 dark:border-slate-800">
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
          {productPrimaryImagePreview ? (
            <div className="mb-4">
              <img
                src={productPrimaryImagePreview}
                alt="Product preview"
                className="h-24 w-24 rounded-2xl object-cover border border-slate-200 dark:border-slate-800"
              />
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <input value={productForm.name} onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))} placeholder="Product Name (Display)" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
            <input value={productForm.slug} onChange={(event) => setProductForm((current) => ({ ...current, slug: event.target.value }))} placeholder="Product Slug (URL)" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
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
            {productForm.existingImages.length ? (
              <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                Saved gallery images: {productForm.existingImages.length}
              </div>
            ) : null}
            {productForm.existingVideo ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                Saved video: {productForm.existingVideo.split("/").pop()}
              </div>
            ) : null}
            {productForm.existingTechnicalDrawings.length ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                Saved drawing files: {productForm.existingTechnicalDrawings.length}
              </div>
            ) : null}
            {productForm.existingCatalogFile ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                Saved catalog: {productForm.existingCatalogFile.split("/").pop()}
              </div>
            ) : null}
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
