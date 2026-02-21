"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type LoginResult = {
  error?: string;
};

export async function login(
  _prev: LoginResult | null,
  formData: FormData
): Promise<LoginResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/app";

  if (!email || !password) {
    return { error: "Vul je e-mailadres en wachtwoord in." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.includes("Email not confirmed")) {
      return { error: "Je e-mailadres is nog niet bevestigd. Check je inbox." };
    }
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Onjuist e-mailadres of wachtwoord." };
    }
    return { error: error.message };
  }

  // Server-side redirect — cookies are already set server-side, no race condition
  redirect(redirectTo);
}
