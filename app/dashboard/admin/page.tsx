import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toggleUserProStatus } from "@/app/actions/admin";

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

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, role, is_pro, created_at")
    .order("created_at", { ascending: false });

  const users = profiles ?? [];

  return (
    <div className="min-h-screen bg-[#f8f7f3] dark:bg-[#2b2a27] font-sans p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-[#e8e6df]">Admin</h1>
            <p className="text-sm text-gray-500 dark:text-[#b8b4a8] mt-1">
              Manage users and their access level.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="shrink-0 rounded-lg border border-gray-200 dark:border-[#4a4940] bg-white dark:bg-[#322f28] px-4 py-2 text-sm font-medium text-gray-700 dark:text-[#e8e6df] hover:bg-gray-50 dark:hover:bg-[#3f403c] transition-colors shadow-sm"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Users Table */}
        <div className="rounded-lg border border-gray-200 dark:border-[#4a4940] bg-white dark:bg-[#322f28] overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#4a4940]">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-[#b8b4a8] tracking-wider uppercase">
                  Email
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-[#b8b4a8] tracking-wider uppercase">
                  Role
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-[#b8b4a8] tracking-wider uppercase">
                  Pro Status
                </th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-[#b8b4a8] tracking-wider uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#4a4940]">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 dark:text-[#b8b4a8]/60">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-gray-50/60 dark:hover:bg-[#26251f]/60 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-[#e8e6df]">
                      {u.email ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          u.role === "admin"
                            ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"
                            : "bg-gray-100 dark:bg-[#26251f] text-gray-600 dark:text-[#b8b4a8]"
                        }`}
                      >
                        {u.role ?? "user"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          u.is_pro
                            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                            : "bg-gray-100 dark:bg-[#26251f] text-gray-500 dark:text-[#b8b4a8]"
                        }`}
                      >
                        {u.is_pro ? "Pro" : "Free"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={toggleUserProStatus.bind(null, u.id, !!u.is_pro)}>
                        <button
                          type="submit"
                          className="rounded-md border border-gray-200 dark:border-[#4a4940] bg-white dark:bg-[#26251f] px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-[#e8e6df] hover:bg-gray-50 dark:hover:bg-[#3f403c] hover:border-gray-300 dark:hover:border-[#58554e] transition-colors"
                        >
                          {u.is_pro ? "Revoke Pro" : "Make Pro"}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
