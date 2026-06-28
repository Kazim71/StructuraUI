"use client";

import { useState, useTransition } from "react";

type AdminUser = {
  id: string;
  email: string | null;
  role: string | null;
  is_pro: boolean | null;
  created_at: string;
};

type ActionResult = { success: boolean; error?: string };

export default function AdminUserTable({
  users,
  toggleProAction,
  deleteUserAction,
}: {
  users: AdminUser[];
  toggleProAction: (userId: string, isPro: boolean) => Promise<ActionResult>;
  deleteUserAction: (userId: string) => Promise<ActionResult>;
}) {
  const [rows, setRows] = useState(users);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleTogglePro(userId: string, current: boolean) {
    setPendingId(userId);
    startTransition(async () => {
      const result = await toggleProAction(userId, !current);
      if (result.success) {
        setRows((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, is_pro: !current } : u))
        );
      } else {
        alert(result.error || "Failed to update Pro status");
      }
      setPendingId(null);
    });
  }

  function handleDelete(userId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this user? This cannot be undone."
    );
    if (!confirmed) return;

    setPendingId(userId);
    startTransition(async () => {
      const result = await deleteUserAction(userId);
      if (result.success) {
        setRows((prev) => prev.filter((u) => u.id !== userId));
      } else {
        alert(result.error || "Failed to delete user");
      }
      setPendingId(null);
    });
  }

  return (
    <div className="rounded-xl border border-[#c7bd9b] dark:border-[#4a4940] bg-white dark:bg-[#322f28] overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#c7bd9b] dark:border-[#4a4940] bg-[#f1efe6] dark:bg-[#26251f]">
            <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#58554e]/70 dark:text-[#b8b4a8]/70">
              Email
            </th>
            <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#58554e]/70 dark:text-[#b8b4a8]/70">
              Role
            </th>
            <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#58554e]/70 dark:text-[#b8b4a8]/70">
              Pro Status
            </th>
            <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#58554e]/70 dark:text-[#b8b4a8]/70">
              Created At
            </th>
            <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#58554e]/70 dark:text-[#b8b4a8]/70">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-5 py-8 text-center text-[#58554e] dark:text-[#b8b4a8]"
              >
                No users found.
              </td>
            </tr>
          ) : (
            rows.map((u) => {
              const rowPending = isPending && pendingId === u.id;
              return (
                <tr
                  key={u.id}
                  className="border-b border-[#e3decd] dark:border-[#4a4940] last:border-0 hover:bg-[#f8f7f3] dark:hover:bg-[#26251f]/60 transition-colors"
                >
                  <td className="px-5 py-3.5 font-semibold text-[#3f403c] dark:text-[#e8e6df]">
                    {u.email ?? "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
                        u.role === "admin"
                          ? "bg-[#809bce]/20 text-[#809bce]"
                          : "bg-[#e0dac9] dark:bg-[#3f403c] text-[#58554e] dark:text-[#b8b4a8]"
                      }`}
                    >
                      {u.role ?? "user"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      disabled={rowPending}
                      onClick={() => handleTogglePro(u.id, !!u.is_pro)}
                      className={`rounded-full px-2.5 py-1 text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        u.is_pro
                          ? "bg-[#7fb069]/20 text-[#7fb069] hover:bg-[#7fb069]/30"
                          : "bg-[#e0dac9] dark:bg-[#3f403c] text-[#58554e] dark:text-[#b8b4a8] hover:bg-[#c7bd9b] dark:hover:bg-[#4a4940]"
                      }`}
                    >
                      {rowPending ? "..." : u.is_pro ? "Pro" : "Free"}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-[#58554e] dark:text-[#b8b4a8]">
                    {new Date(u.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      disabled={rowPending}
                      onClick={() => handleDelete(u.id)}
                      className="rounded-lg border border-[#c0392b]/30 bg-[#c0392b]/10 px-3 py-1.5 text-xs font-bold text-[#c0392b] hover:bg-[#c0392b]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {rowPending ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
