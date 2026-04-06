"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { PencilLine, Plus, Trash2 } from "lucide-react";
import api from "@/lib/axios";
import RichTextEditor from "@/components/admin/RichTextEditor";

type Blog = {
  _id: string;
  title: string;
  slug: string;
  image?: string;
  description: string;
  category: string;
  customDate?: string;
  status: "Draft" | "Published";
  author?: string;
};

type Category = {
  _id: string;
  name: string;
};

const blankForm = {
  id: "",
  title: "",
  slug: "",
  category: "",
  customDate: "",
  status: "Draft" as "Draft" | "Published",
  author: "Admin",
  description: "",
  imageFile: null as File | null,
};

export default function ApiBlogsManager() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(blankForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    const [blogsResult, categoriesResult] = await Promise.allSettled([
      api.get("/blogs"),
      api.get("/categories"),
    ]);

    try {
      if (blogsResult.status === "fulfilled") {
        setBlogs(Array.isArray(blogsResult.value.data) ? blogsResult.value.data : []);
      } else {
        console.error(blogsResult.reason);
        setBlogs([]);
      }

      if (categoriesResult.status === "fulfilled") {
        setCategories(Array.isArray(categoriesResult.value.data) ? categoriesResult.value.data : []);
      } else {
        console.error(categoriesResult.reason);
        setCategories([]);
      }

      if (blogsResult.status === "rejected" && categoriesResult.status === "rejected") {
        setError("Blogs and categories could not be loaded.");
      } else if (blogsResult.status === "rejected") {
        setError("Blogs could not be loaded.");
      } else if (categoriesResult.status === "rejected") {
        setError("Categories could not be loaded.");
      }
    } catch (loadError) {
      console.error(loadError);
      setError("Blog data could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function saveBlog() {
    if (!form.title.trim() || !form.category || !form.description.trim()) {
      setError("Title, category, and content are required.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const data = new FormData();
      data.append("title", form.title.trim());
      data.append("slug", form.slug.trim());
      data.append("author", form.author.trim());
      data.append("customDate", form.customDate);
      data.append("category", form.category);
      data.append("status", form.status);
      data.append("description", form.description);
      if (form.imageFile) {
        data.append("image", form.imageFile);
      }

      if (form.id) {
        await api.put(`/blogs/${form.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Blog updated.");
      } else {
        await api.post("/blogs", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Blog created.");
      }

      setForm(blankForm);
      await loadData();
    } catch (saveError) {
      console.error(saveError);
      if (axios.isAxiosError(saveError)) {
        setError(saveError.response?.data?.message || "Blog could not be saved.");
      } else {
        setError("Blog could not be saved.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteBlog(id: string) {
    try {
      await api.delete(`/blogs/${id}`);
      setMessage("Blog deleted.");
      await loadData();
    } catch (deleteError) {
      console.error(deleteError);
      setError("Blog could not be deleted.");
    }
  }

  function resetForm() {
    setForm(blankForm);
    setEditing(false);
  }

  async function editBlog(blog: Blog) {
    setEditing(true);
    setError("");
    setMessage("");

    try {
      const response = await api.get(`/blogs/${blog._id}`);
      const fullBlog = response.data as Blog;

      setForm({
        id: fullBlog._id,
        title: fullBlog.title || "",
        slug: fullBlog.slug || "",
        category: fullBlog.category || "",
        customDate: fullBlog.customDate
          ? new Date(fullBlog.customDate).toISOString().split("T")[0]
          : "",
        status: fullBlog.status || "Draft",
        author: fullBlog.author || "Admin",
        description: fullBlog.description || "",
        imageFile: null,
      });
      setEditing(false);
    } catch (editError) {
      console.error(editError);
      setEditing(false);
      if (axios.isAxiosError(editError)) {
        setError(editError.response?.data?.message || "Blog details could not be loaded.");
      } else {
        setError("Blog details could not be loaded.");
      }
    }
  }

  return (
    <div className="space-y-6">
      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
      {message ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-4">
            <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Title" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
            <input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} placeholder="Slug" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
            <select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950">
              <option value="">Select category</option>
              {categories.map((category) => <option key={category._id} value={category.name}>{category.name}</option>)}
            </select>
            <div className="grid gap-4 md:grid-cols-2">
              <input type="date" value={form.customDate} onChange={(event) => setForm((current) => ({ ...current, customDate: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
              <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as "Draft" | "Published" }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950">
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <input value={form.author} onChange={(event) => setForm((current) => ({ ...current, author: event.target.value }))} placeholder="Author" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950" />
            <RichTextEditor
              value={form.description}
              onChange={(val) => setForm((current) => ({ ...current, description: val }))}
            />
            <input type="file" accept="image/*" onChange={(event) => setForm((current) => ({ ...current, imageFile: event.target.files?.[0] ?? null }))} className="w-full text-sm" />
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={saveBlog} disabled={saving || editing} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60 dark:bg-orange-500">
                <Plus className="h-4 w-4" />
                {editing ? "Loading..." : form.id ? "Update Blog" : "Add Blog"}
              </button>
              {form.id ? (
                <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 dark:border-slate-800 dark:text-slate-200">
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {loading ? <p className="text-sm text-slate-500 dark:text-slate-400">Loading blogs...</p> : null}
          <div className="space-y-3">
            {blogs.map((blog) => (
              <div key={blog._id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between dark:border-slate-800">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{blog.title}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {blog.slug} | {blog.category} | {blog.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => void editBlog(blog)} className="rounded-xl border border-slate-200 p-2 dark:border-slate-800">
                    <PencilLine className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => deleteBlog(blog._id)} className="rounded-xl border border-rose-200 p-2 text-rose-600 dark:border-rose-900 dark:text-rose-300">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
