"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/* ─────────────────────────────────────────────────────
   Server Action — Create workspace during onboarding.
   Creates 4 rows in a logical sequence:
     1. workspaces
     2. workspace_members  (owner)
     3. user_settings
     4. workspace_subscriptions (trial, 14 days)
   ────────────────────────────────────────────────────── */

export interface OnboardingResult {
  error?: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
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

  // Verify auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Je bent niet ingelogd. Ververs de pagina." };
  }

  // Check if user already has a workspace (race condition guard)
  const { data: existing } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (existing) {
    redirect("/app");
  }

  // Generate unique slug
  const baseSlug = slugify(name) || "workspace";
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  // 1. Create workspace
  const { data: workspace, error: wsError } = await supabase
    .from("workspaces")
    .insert({ name, slug })
    .select("id")
    .single();

  if (wsError || !workspace) {
    console.error("Workspace creation error:", wsError);
    return {
      error: "Kon workspace niet aanmaken. Probeer het opnieuw.",
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
    console.error("Member creation error:", memberError);
    // Clean up orphaned workspace
    await supabase.from("workspaces").delete().eq("id", workspace.id);
    return {
      error: "Kon lidmaatschap niet aanmaken. Probeer het opnieuw.",
    };
  }

  // 3. Create user settings
  const { error: settingsError } = await supabase
    .from("user_settings")
    .insert({
      user_id: user.id,
      default_workspace_id: workspace.id,
      locale: "nl",
    });

  if (settingsError) {
    // Non-critical — log but continue
    console.error("User settings creation error:", settingsError);
  }

  // 4. Create trial subscription (14 days)
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 14);

  const { error: subError } = await supabase
    .from("workspace_subscriptions")
    .insert({
      workspace_id: workspace.id,
      plan: "trial",
      status: "active",
      trial_ends_at: trialEnd.toISOString(),
    });

  if (subError) {
    // Non-critical — log but continue
    console.error("Subscription creation error:", subError);
  }

  redirect("/app");
}
