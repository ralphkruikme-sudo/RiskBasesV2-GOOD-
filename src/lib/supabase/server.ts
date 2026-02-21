/* ─────────────────────────────────────────────────────
   Server-side Supabase client (RSC, Route Handlers,
   Server Actions). Uses @supabase/ssr with the Next.js
   cookies() API so auth tokens travel through httpOnly
   cookies instead of localStorage.
   ────────────────────────────────────────────────────── */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseUrl, supabaseAnonKey } from "./env";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll is called from Server Components where cookies
          // are read-only. The middleware will refresh the session
          // for these cases — safe to ignore here.
        }
      },
    },
  });
}
