import { AdminNav } from "@/components/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";

export async function AdminFrame({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-[260px_1fr]">
        <AdminNav />
        <section>{children}</section>
      </div>
    </main>
  );
}
