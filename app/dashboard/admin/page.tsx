import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toggleUserProStatus, deleteUser } from "@/app/actions/admin";
import AdminUserTable from "@/components/AdminUserTable";

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Defense in depth: middleware already gates this route, but guard the
  // page itself in case it's ever rendered without going through it.
  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: users } = await supabase
    .from("profiles")
    .select("id, email, role, is_pro, created_at")
    .order("created_at", { ascending: false });

  const { count: totalProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  return (
    <div className="min-h-screen bg-[#f8f7f3] dark:bg-[#26251f] text-[#3f403c] dark:text-[#e8e6df] font-sans p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-[#58554e] dark:text-[#b8b4a8] mt-1">
              Manage users and monitor platform activity.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="shrink-0 rounded-lg border border-[#c7bd9b] dark:border-[#4a4940] bg-[#f1efe6] dark:bg-[#322f28] px-4 py-2.5 text-sm font-bold text-[#3f403c] dark:text-[#e8e6df] hover:bg-[#e3decd] dark:hover:bg-[#3f403c] transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <StatCard label="Total Users" value={users?.length ?? 0} />
          <StatCard label="Total Projects" value={totalProjects ?? 0} />
        </div>

        {/* Users Table */}
        <AdminUserTable
          users={users ?? []}
          toggleProAction={toggleUserProStatus}
          deleteUserAction={deleteUser}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[#c7bd9b] dark:border-[#4a4940] bg-white dark:bg-[#322f28] px-6 py-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-widest text-[#58554e]/60 dark:text-[#b8b4a8]/60 mb-1">
        {label}
      </p>
      <p className="text-3xl font-bold text-[#3f403c] dark:text-[#e8e6df]">{value}</p>
    </div>
  );
}
