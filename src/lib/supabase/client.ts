/* ─────────────────────────────────────────────────────
   Browser (client-component) Supabase client.
   Uses createBrowserClient from @supabase/ssr which
   automatically reads/writes cookies via document.cookie.
   ────────────────────────────────────────────────────── */

import { createBrowserClient } from "@supabase/ssr";
import { supabaseUrl, supabaseAnonKey } from "./env";

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
