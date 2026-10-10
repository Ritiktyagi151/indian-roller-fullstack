"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { RefreshCcw, RotateCcw, Trash2 } from "lucide-react";
import api from "@/lib/axios";

type TrashItem = { id: string; type: string; name: string; detail: string; deletedAt: string };
const labels: Record<string, string> = {
  product: "Product", category: "Category", blog: "Blog", enquiry: "Enquiry", seo: "SEO Entry", redirect: "Redirect",
};

export default function TrashPage() {
  const [items, setItems] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get<TrashItem[]>("/trash");
      setItems(response.data);
    } catch {
      setError("Could not load Trash. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function act(item: TrashItem, restore: boolean) {
    if (!restore && !window.confirm(`Permanently delete "${item.name}"? This cannot be undone.`)) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const path = `/trash/${item.type}/${item.id}`;
      if (restore) await api.post(`${path}/restore`);
      else await api.delete(path);
      setItems((current) => current.filter((entry) => entry.id !== item.id || entry.type !== item.type));
      setMessage(restore ? "Item restored successfully." : "Item permanently deleted.");
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.response?.data?.message || "Action failed. Please try again." : "Action failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const visible = items.filter((item) => (!type || item.type === type) &&
    `${item.name} ${item.detail}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-semibold"><Trash2 className="h-6 w-6" />Trash</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Deleted items stay here until you restore or permanently delete them.</p>
        </div>
        <button type="button" onClick={() => void load()} disabled={loading || busy} className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 disabled:opacity-50 dark:border-slate-700"><RefreshCcw className="h-4 w-4" />Refresh</button>
      </div>
      {error && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-rose-700 dark:bg-rose-950 dark:text-rose-300">{error}</p>}
      {message && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{message}</p>}
      <div className="flex flex-wrap gap-3">
        <input aria-label="Search Trash" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search deleted items..." className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900" />
        <select aria-label="Filter by item type" value={type} onChange={(event) => setType(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <option value="">All types</option>
          {Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {loading ? <p role="status" className="p-8 text-center text-slate-500">Loading Trash...</p> : error && !items.length ? <p className="p-8 text-center text-slate-500">Trash is unavailable. Use Refresh to try again.</p> : !visible.length ? <p className="p-8 text-center text-slate-500">{items.length ? "No matching items." : "Trash is empty."}</p> : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800"><tr><th className="p-4">Item</th><th className="p-4">Type</th><th className="p-4">Deleted on</th><th className="p-4">Actions</th></tr></thead>
            <tbody>{visible.map((item) => (
              <tr key={`${item.type}-${item.id}`} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                <td className="p-4"><p className="font-medium">{item.name}</p><p className="mt-1 text-slate-500">{item.detail}</p></td>
                <td className="p-4">{labels[item.type]}</td>
                <td className="whitespace-nowrap p-4">{new Date(item.deletedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
                <td className="p-4"><div className="flex flex-wrap gap-2">
                  <button type="button" disabled={busy} onClick={() => void act(item, true)} aria-label={`Restore ${item.name}`} className="flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-emerald-700 disabled:opacity-50 dark:border-emerald-900 dark:text-emerald-300"><RotateCcw className="h-4 w-4" />Restore</button>
                  <button type="button" disabled={busy} onClick={() => void act(item, false)} aria-label={`Permanently delete ${item.name}`} className="flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-rose-600 disabled:opacity-50 dark:border-rose-900 dark:text-rose-300"><Trash2 className="h-4 w-4" />Delete permanently</button>
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
