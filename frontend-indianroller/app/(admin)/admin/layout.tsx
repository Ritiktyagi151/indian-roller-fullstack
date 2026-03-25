import AdminAuthGate from "@/components/admin/AdminAuthGate";
import Navbar from "@/components/admin/Navbar";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGate>
      <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="flex min-h-screen flex-col lg:flex-row">
          <Sidebar />
          <div className="flex min-h-screen flex-1 flex-col">
            <Navbar />
            <main className="flex-1 p-4 lg:p-8">{children}</main>
          </div>
        </div>
      </div>
    </AdminAuthGate>
  );
}
