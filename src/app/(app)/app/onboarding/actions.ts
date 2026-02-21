"use server";

import { createClient } from "@/lib/supabase/server";

/* ─────────────────────────────────────────────────────
   Server Action — Create workspace during onboarding.
   Uses the authenticated cookie-based Supabase client.
   Returns { success: true } so the client can do a hard
   navigation (no server-side redirect that might loop).
   ────────────────────────────────────────────────────── */

export interface OnboardingResult {
  error?: string;
  success?: boolean;
}

export async function createWorkspace(
  _prev: OnboardingResult | null,
  formData: FormData
): Promise<OnboardingResult> {
  const name = (formData.get("name") as string)?.trim();

  if (!name || name.length < 2) {
    return { error: "Naam moet minimaal 2 tekens bevatten." };
  }
  if (name.length > 60) {
    return { error: "Naam mag maximaal 60 tekens bevatten." };
  }

  const supabase = await createClient();

  // Verify auth — refreshes the session token in cookies
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.log("Auth error:", JSON.stringify(userError, null, 2));
    return { error: "Je bent niet ingelogd. Ververs de pagina." };
  }

  console.log("USER.ID", user.id);

  // Race-condition guard: already has workspace
  const { data: existing } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (existing) {
    console.log("User already has workspace_members row — returning success");
    return { success: true };
  }

  console.log("PAYLOAD", { name, created_by: user.id });

  // 1. Create workspace
  const { data: workspace, error: wsError } = await supabase
    .from("workspaces")
    .insert({ name, created_by: user.id })
    .select("id")
    .single();

  if (wsError || !workspace) {
    console.log("Step 1 full error:", JSON.stringify(wsError, null, 2));
    return {
      error: `Stap 1 — Workspace aanmaken mislukt: ${wsError?.message ?? JSON.stringify(wsError)}`,
    };
  }

  // 2. Create workspace member (owner)
  const { error: memberError } = await supabase
    .from("workspace_members")
    .insert({
      workspace_id: workspace.id,
      user_id: user.id,
      role: "owner",
    });

  if (memberError) {
    console.log("Step 2 full error:", JSON.stringify(memberError, null, 2));
    await supabase.from("workspaces").delete().eq("id", workspace.id);
    return {
      error: `Stap 2 — Lidmaatschap aanmaken mislukt: ${memberError.message ?? JSON.stringify(memberError)}`,
    };
  }

  // 3. Upsert user settings (non-blocking)
  const { error: settingsError } = await supabase
    .from("user_settings")
    .upsert(
      {
        user_id: user.id,
        default_workspace_id: workspace.id,
        language: "nl",
        timezone: "Europe/Amsterdam",
      },
      { onConflict: "user_id" }
    );

  if (settingsError) {
    console.warn("Step 3 settings upsert failed (non-blocking):", JSON.stringify(settingsError, null, 2));
  }

  // 4. Create trial subscription (non-blocking)
  const { error: subError } = await supabase
    .from("workspace_subscriptions")
    .insert({
      workspace_id: workspace.id,
      plan_id: "standard",
      status: "trialing",
    });

  if (subError) {
    console.warn("Step 4 subscription insert failed (non-blocking):", JSON.stringify(subError, null, 2));
  }

  console.log("Onboarding complete — returning success");
  return { success: true };
}
