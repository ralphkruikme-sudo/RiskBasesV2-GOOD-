/* ─────────────────────────────────────────────────────
   Next.js Middleware — refreshes the Supabase auth
   session on every request so cookies stay valid.
   Protects /app routes — redirects to /login if no session.
   ────────────────────────────────────────────────────── */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_PREFIXES = ["/app"];

// Routes only accessible when NOT logged in (redirect to /app if session exists)
const AUTH_ROUTES = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Set x-pathname as a REQUEST header so server components can read it
  // via headers(). Response headers are NOT readable by headers().
  request.headers.set("x-pathname", pathname);

  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If env vars are missing, skip silently (env.ts will log errors elsewhere)
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // 1. Update request cookies so downstream server components
        //    see fresh tokens instead of stale ones.
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        // 2. Re-create response with updated request (keeps x-pathname header)
        supabaseResponse = NextResponse.next({ request });
        // 3. Set cookies on response so the browser stores them
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: use getUser() not getSession() — it validates the token each time
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Protected routes: redirect unauthenticated users to /login ──
  if (!user && PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Auth routes: redirect authenticated users to /app ──
  if (user && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    const appUrl = request.nextUrl.clone();
    appUrl.pathname = "/app";
    return NextResponse.redirect(appUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
