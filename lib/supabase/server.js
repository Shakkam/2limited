import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server-side Supabase client (Server Components, Server Actions, Route
// Handlers) — reads the user's session from cookies, so queries run under
// their RLS policies (not the service role). Use createAdminClient() only
// for operations that must bypass RLS (e.g. inviting new backoffice users).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component render, which can't set cookies —
          // fine as long as middleware.js is also refreshing the session.
        }
      },
    },
  });
}
