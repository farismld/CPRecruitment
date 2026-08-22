import { requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lapisan verifikasi kedua selain middleware (defense in depth):
  // redirect ke /admin/login jika sesi tidak valid.
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar adminName={user?.email} />
      <div className="lg:pl-64">
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
