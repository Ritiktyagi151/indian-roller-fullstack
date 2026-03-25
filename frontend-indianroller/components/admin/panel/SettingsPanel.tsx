"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";

type SettingsPanelProps = {
  initialTab: "profile" | "roles";
};

const roleSeed = [
  { role: "Super Admin", products: true, seo: true, enquiries: true, settings: true },
  { role: "SEO Manager", products: false, seo: true, enquiries: true, settings: false },
  { role: "Sales Admin", products: true, seo: false, enquiries: true, settings: false },
];

export default function SettingsPanel({ initialTab }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@indianroller.com",
    phone: "+91-9811885000",
    role: "Super Admin",
  });
  const [roles, setRoles] = useState(roleSeed);
  const tabs = useMemo(
    () => [
      { key: "profile", label: "Admin Profile" },
      { key: "roles", label: "Role Permissions" },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as "profile" | "roles")}
            className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-slate-900 text-white dark:bg-orange-500"
                : "border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" ? (
        <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(profile).map(([key, value]) => (
              <div key={key}>
                <label className="mb-2 block text-sm font-medium capitalize text-slate-600 dark:text-slate-300">
                  {key}
                </label>
                <input
                  value={value}
                  onChange={(event) =>
                    setProfile((current) => ({ ...current, [key]: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-950"
                />
              </div>
            ))}
          </div>
          <button className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white dark:bg-orange-500">
            <Check className="h-4 w-4" />
            Save Profile
          </button>
        </section>
      ) : (
        <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-400">
                  <th className="pb-4 pr-4">Role</th>
                  <th className="pb-4 pr-4">Products</th>
                  <th className="pb-4 pr-4">SEO</th>
                  <th className="pb-4 pr-4">Enquiries</th>
                  <th className="pb-4 pr-4">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {roles.map((role, index) => (
                  <tr key={role.role}>
                    <td className="py-4 pr-4 font-medium text-slate-900 dark:text-white">{role.role}</td>
                    {(["products", "seo", "enquiries", "settings"] as const).map((field) => (
                      <td key={field} className="py-4 pr-4">
                        <button
                          type="button"
                          onClick={() =>
                            setRoles((current) =>
                              current.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, [field]: !entry[field] } : entry,
                              ),
                            )
                          }
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            role[field]
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-950 dark:text-slate-400"
                          }`}
                        >
                          {role[field] ? "Allowed" : "Blocked"}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
