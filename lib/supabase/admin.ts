import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client for privileged admin operations (deleting auth users,
 * updating other users' profiles, etc). Bypasses RLS — only call this from
 * server actions that have already verified the caller is an admin.
 * Requires SUPABASE_SERVICE_ROLE_KEY to be set in .env.local.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
