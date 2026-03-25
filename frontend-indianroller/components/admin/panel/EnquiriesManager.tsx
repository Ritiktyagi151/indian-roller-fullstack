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

const dummyEnquiries: Enquiry[] = [
  {
    _id: "dummy-1",
    sourceType: "contact",
    formName: "Contact Form",
    name: "Rahul Verma",
    email: "rahul@example.com",
    phone: "+91-9000000001",
    message: "Need rubber rollers for a paper line upgrade.",
    status: "unread",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "dummy-2",
    sourceType: "website-form",
    formName: "Product Enquiry Form",
    name: "Meera Singh",
    email: "meera@example.com",
    phone: "+91-9000000002",
    message: "Please share a catalog and pricing for textile rollers.",
    status: "read",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

type EnquiriesManagerProps = {
  initialTab: "contact" | "forms";
};

export default function EnquiriesManager({ initialTab }: EnquiriesManagerProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(dummyEnquiries);
  const [selected, setSelected] = useState<Enquiry | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get("/enquiries");
        if (Array.isArray(response.data) && response.data.length) {
          setEnquiries(response.data);
        }
      } catch {
        setEnquiries(dummyEnquiries);
      }
    }

    load();
  }, []);

  const visibleEnquiries = useMemo(() => {
    return enquiries.filter((enquiry) =>
      activeTab === "contact"
        ? enquiry.sourceType === "contact"
        : enquiry.sourceType !== "contact",
    );
  }, [activeTab, enquiries]);

  async function markAsRead(id: string) {
    setEnquiries((current) =>
      current.map((enquiry) => (enquiry._id === id ? { ...enquiry, status: "read" } : enquiry)),
    );

    try {
      await api.put(`/enquiries/${id}`, { status: "read" });
    } catch {}
  }

  async function deleteEnquiry(id: string) {
    setEnquiries((current) => current.filter((enquiry) => enquiry._id !== id));
    try {
      await api.delete(`/enquiries/${id}`);
    } catch {}
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

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
                  <button
                    type="button"
                    onClick={() => setSelected(enquiry)}
                    className="rounded-xl border border-slate-200 p-2 dark:border-slate-800"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => markAsRead(enquiry._id)}
                    className="rounded-xl border border-slate-200 p-2 dark:border-slate-800"
                  >
                    <MailCheck className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteEnquiry(enquiry._id)}
                    className="rounded-xl border border-rose-200 p-2 text-rose-600 dark:border-rose-900 dark:text-rose-300"
                  >
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
