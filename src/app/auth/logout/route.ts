/* ─────────────────────────────────────────────────────
   Logout route handler.
   POST /auth/logout — signs out and redirects to /login.
   Using a Route Handler (POST) so it works as a form
   action or fetch call. Not a GET to avoid CSRF.
   ────────────────────────────────────────────────────── */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/login`, { status: 302 });
}
