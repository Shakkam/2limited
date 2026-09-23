"use client";

import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client, for client components (the login form,
// upload widgets). Runs under the signed-in user's RLS policies, same as
// the server client — this only differs in where the session lives.
export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
