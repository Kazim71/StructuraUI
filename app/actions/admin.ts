"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

/**
 * Defense in depth: middleware already blocks non-admins from /dashboard/admin,
 * but server actions can be invoked directly, so re-check here too.
 */
async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { authorized: false as const };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { authorized: false as const };
  }

  return { authorized: true as const };
}

export async function toggleUserProStatus(userId: string, currentStatus: boolean) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    throw new Error("Unauthorized");
  }

  const supabase = createAdminClient();

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ is_pro: !currentStatus })
    .eq("id", userId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  revalidatePath("/dashboard/admin");
}

export async function deleteUser(userId: string) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return { success: false, error: "Unauthorized: Admins only." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error("Error deleting user:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (err: any) {
    console.error("Unexpected error in deleteUser:", err);
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}
