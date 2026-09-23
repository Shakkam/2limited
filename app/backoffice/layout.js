import { createClient } from "@/lib/supabase/server";
import BackofficeNav from "./BackofficeNav";

export const metadata = { title: "Backoffice — 2-LIMITED" };

// The actual access gate is middleware.js (it runs before this layout and
// redirects to /login when there's no session). This just reads the user
// for display — safe to assume it's non-null on every page but /login,
// which doesn't render this layout's nav.
export default async function BackofficeLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {user && <BackofficeNav email={user.email} />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
