/* ─────────────────────────────────────────────────────
   Server-side Supabase client (RSC, Route Handlers,
   Server Actions). Uses @supabase/ssr with the Next.js
   cookies() API so auth tokens travel through httpOnly
   cookies instead of localStorage.
   ────────────────────────────────────────────────────── */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";
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

/**
 * Cached getUser — calls Supabase auth.getUser() only ONCE per
 * server request, no matter how many layouts/pages call it.
 * React's cache() deduplicates within the same request lifecycle.
 */
export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
});

/**
 * Cached workspace membership lookup — runs only once per request.
 * Returns the first workspace membership for the given user, or null.
 */
export const getWorkspaceMembership = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workspace_members")
    .select("workspace_id, role, workspaces(id, name)")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();
  return { membership: data, error };
});
