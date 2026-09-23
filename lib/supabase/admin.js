import { createClient } from "@supabase/supabase-js";

// Service-role client — bypasses RLS entirely. Server-only (never import
// this from a client component or expose SUPABASE_SERVICE_ROLE_KEY to the
// browser). Used for admin-only operations like inviting new backoffice
// users, where there's no signed-in session yet to act under.
export function createAdminClient() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
