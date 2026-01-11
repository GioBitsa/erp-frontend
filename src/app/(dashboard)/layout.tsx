import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen bg-app-bg">
      <div className="mx-auto h-full px-4 py-6">
        <div className="flex h-full gap-4">
          <Sidebar />

          <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-(--shadow-md)">
            <Topbar />

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-5 pt-3">
              {children}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
