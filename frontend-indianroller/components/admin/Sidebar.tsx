"use client";

import {
  BookOpenText,
  ChevronRight,
  FilePenLine,
  FileSearch,
  FolderKanban,
  Globe,
  LayoutDashboard,
  ListOrdered,
  Mail,
  Package,
  Settings2,
  ShieldCheck,
  SquareLibrary,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const navGroups = [
  {
    title: "Dashboard",
    items: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Products",
    items: [
      { label: "Product Categories", href: "/admin/categories", icon: FolderKanban },
      { label: "Navbar Dropdown", href: "/admin/navbar-settings", icon: ListOrdered },
      { label: "All Products", href: "/admin/products", icon: SquareLibrary },
      { label: "Add Product", href: "/admin/add-product", icon: Package },
    ],
  },
  {
    title: "Blogs",
    items: [{ label: "All Blogs", href: "/admin/blogs", icon: BookOpenText }],
  },
  {
    title: "SEO Management",
    items: [
      { label: "SEO Dashboard", href: "/admin/seo/dashboard", icon: LayoutDashboard },
      { label: "Pages Manager", href: "/admin/seo/pages", icon: SquareLibrary },
      { label: "SEO Editor", href: "/admin/seo/editor", icon: FilePenLine },
      { label: "Global Settings", href: "/admin/seo/settings", icon: Settings2 },
      { label: "Sitemap Manager", href: "/admin/seo/sitemap", icon: Globe },
      { label: "Redirect Manager", href: "/admin/seo/redirects", icon: ChevronRight },
      { label: "SEO Audit", href: "/admin/seo/audit", icon: FileSearch },
    ],
  },
  {
    title: "Enquiries",
    items: [
      { label: "Contact Us Enquiries", href: "/admin/enquiries?tab=contact", icon: Mail },
      { label: "All Website Form Enquiries", href: "/admin/enquiries?tab=forms", icon: Mail },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Admin Profile", href: "/admin/settings?tab=profile", icon: UserCog },
      { label: "Role Permissions", href: "/admin/settings?tab=roles", icon: ShieldCheck },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.toString();

  return (
    <aside className="w-full shrink-0 overflow-x-auto border-b border-slate-200/80 bg-white/90 px-4 py-4 text-slate-700 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-200 lg:h-screen lg:w-80 lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20">
          <LayoutDashboard className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
            Indian Roller
          </p>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Admin Panel</h1>
        </div>
      </div>

      <div className="space-y-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
              {group.title}
            </p>
            <div className="flex gap-2 overflow-x-auto lg:block lg:space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const [itemPath, itemQuery = ""] = item.href.split("?");
                const isActive =
                  pathname === itemPath && (itemQuery ? currentQuery === itemQuery : true);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10 dark:bg-orange-500"
                        : "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
