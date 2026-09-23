import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Gatekeeper for /backoffice: refreshes the Supabase session on every
// request and redirects to the login page when there isn't one. This is
// the actual access control — the backoffice layout also checks the user
// server-side, but that's a UX nicety (avoiding a flash of protected
// content), not a substitute for this.
export async function middleware(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/backoffice/login";
  // The invite-email link lands here carrying the session in the URL
  // *hash*, which never reaches the server — so there's genuinely no
  // session yet on this first server-rendered request even though the
  // visitor is legitimately mid-login. The page itself waits client-side
  // for the hash to be processed before showing the password form.
  const isSetPasswordPage = pathname === "/backoffice/set-password";
  // Same reasoning as set-password — but this one holds no session at all
  // yet, on purpose: it shows a button a human must click (see
  // app/backoffice/confirm) so an email security scanner pre-fetching the
  // link can't consume the one-time token before the real person opens it.
  const isConfirmPage = pathname === "/backoffice/confirm";

  if (!user && !isLoginPage && !isSetPasswordPage && !isConfirmPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/backoffice/login";
    return NextResponse.redirect(url);
  }
  if (user && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/backoffice";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/backoffice/:path*"],
};
