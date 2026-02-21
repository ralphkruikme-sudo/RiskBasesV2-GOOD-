/* ─────────────────────────────────────────────────────
   Supabase environment variable validation.
   
   IMPORTANT: Next.js only inlines NEXT_PUBLIC_* env vars
   when accessed as literal property names on process.env
   (e.g. process.env.NEXT_PUBLIC_SUPABASE_URL). Dynamic
   bracket access like process.env[name] does NOT work
   in the browser bundle.
   ────────────────────────────────────────────────────── */

function validate(value: string | undefined, name: string): string {
  if (value) return value;

  const msg = [
    `❌ Missing environment variable: ${name}`,
    "",
    "Make sure you have a .env.local file in the project root with:",
    "",
    "  NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co",
    "  NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>",
    "",
    "You can find these in your Supabase dashboard → Settings → API.",
  ].join("\n");

  if (typeof window !== "undefined") {
    console.error(msg);
    return "";
  }
  throw new Error(msg);
}

// Use literal property access so Next.js can inline these at build time
export const supabaseUrl = validate(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  "NEXT_PUBLIC_SUPABASE_URL"
);
export const supabaseAnonKey = validate(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
);
