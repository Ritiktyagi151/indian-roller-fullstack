"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Eye, MailCheck, Trash2 } from "lucide-react";
import api from "@/lib/axios";

type Enquiry = {
  _id: string;
  sourceType: string;
  formName: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "read" | "unread";
  createdAt: string;
};

type Props = {
  initialTab: "contact" | "forms";
};

export default function ApiEnquiriesManager({ initialTab }: Props) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/enquiries");
        setEnquiries(Array.isArray(response.data) ? response.data : []);
      } catch (loadError) {
        console.error(loadError);
        setError("Enquiries could not be loaded from the backend.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const visibleEnquiries = useMemo(() => {
    return enquiries.filter((enquiry) =>
      activeTab === "contact"
        ? enquiry.sourceType === "contact"
        : enquiry.sourceType !== "contact",
    );
  }, [activeTab, enquiries]);

  async function markAsRead(id: string) {
    try {
      const response = await api.put(`/enquiries/${id}`, { status: "read" });
      setEnquiries((current) =>
        current.map((enquiry) => (enquiry._id === id ? response.data : enquiry)),
      );
    } catch (updateError) {
      console.error(updateError);
      setError("Enquiry could not be updated.");
    }
  }

  async function deleteEnquiry(id: string) {
    try {
      await api.delete(`/enquiries/${id}`);
      setEnquiries((current) => current.filter((enquiry) => enquiry._id !== id));
      if (selected?._id === id) {
        setSelected(null);
      }
    } catch (deleteError) {
      console.error(deleteError);
      setError("Enquiry could not be deleted.");
    }
  }

  function exportCsv() {
    const rows = [
      ["Name", "Email", "Phone", "Form", "Message", "Status", "Date"],
      ...visibleEnquiries.map((item) => [
        item.name,
        item.email,
        item.phone,
        item.formName,
        item.message,
        item.status,
        item.createdAt,
      ]),
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `enquiries-${activeTab}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("contact")}
            className={`rounded-2xl px-4 py-3 text-sm font-medium ${
              activeTab === "contact"
                ? "bg-slate-900 text-white dark:bg-orange-500"
                : "border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            }`}
          >
            Contact Us Enquiries
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("forms")}
            className={`rounded-2xl px-4 py-3 text-sm font-medium ${
              activeTab === "forms"
                ? "bg-slate-900 text-white dark:bg-orange-500"
                : "border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            }`}
          >
            Website Form Enquiries
          </button>
        </div>

        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        >
          <Download className="h-4 w-4" />
          Export Enquiries
        </button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {loading ? <p className="text-sm text-slate-500 dark:text-slate-400">Loading enquiries...</p> : null}
          <div className="space-y-3">
            {visibleEnquiries.map((enquiry) => (
              <div
                key={enquiry._id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between dark:border-slate-800"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{enquiry.name}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {enquiry.email} | {enquiry.phone}
                  </p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{enquiry.message}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      enquiry.status === "read"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {enquiry.status}
                  </span>
                  <button type="button" onClick={() => setSelected(enquiry)} className="rounded-xl border border-slate-200 p-2 dark:border-slate-800">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => markAsRead(enquiry._id)} className="rounded-xl border border-slate-200 p-2 dark:border-slate-800">
                    <MailCheck className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => deleteEnquiry(enquiry._id)} className="rounded-xl border border-rose-200 p-2 text-rose-600 dark:border-rose-900 dark:text-rose-300">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Enquiry detail</p>
          {selected ? (
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Name</p>
                <p className="mt-2 text-sm text-slate-900 dark:text-white">{selected.name}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Form</p>
                <p className="mt-2 text-sm text-slate-900 dark:text-white">{selected.formName}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Message</p>
                <p className="mt-2 text-sm text-slate-900 dark:text-white">{selected.message}</p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Select an enquiry to view it.</p>
          )}
        </section>
      </div>
    </div>
  );
}
