-- ============================================================
-- RiskBases — Core workspace tables
-- Run this in the Supabase SQL Editor or as a migration.
-- ============================================================

-- ── 1. Workspaces ──────────────────────────────────────
create table if not exists public.workspaces (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text not null unique,
  created_by   uuid references auth.users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.workspaces enable row level security;

-- Members can read their own workspace
create policy "Members can read workspace"
  on public.workspaces for select
  using (
    id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid()
    )
  );

-- Owners can update their workspace
create policy "Owners can update workspace"
  on public.workspaces for update
  using (
    id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role = 'owner'
    )
  );

-- Authenticated users can create workspaces (for onboarding)
create policy "Authenticated users can create workspaces"
  on public.workspaces for insert
  with check (auth.uid() = created_by);


-- ── 2. Workspace Members ───────────────────────────────
create table if not exists public.workspace_members (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references public.workspaces(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  role          text not null default 'member' check (role in ('owner', 'admin', 'member', 'viewer')),
  created_at    timestamptz not null default now(),

  unique (workspace_id, user_id)
);

alter table public.workspace_members enable row level security;

-- Users can read memberships in their workspaces
create policy "Users can read own memberships"
  on public.workspace_members for select
  using (user_id = auth.uid());

-- Allow insert for self (onboarding creates owner row)
create policy "Users can insert own membership"
  on public.workspace_members for insert
  with check (user_id = auth.uid());


-- ── 3. User Settings ──────────────────────────────────
create table if not exists public.user_settings (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null unique references auth.users(id) on delete cascade,
  default_workspace_id  uuid references public.workspaces(id) on delete set null,
  locale                text not null default 'nl',
  theme                 text not null default 'light' check (theme in ('light', 'dark', 'system')),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.user_settings enable row level security;

create policy "Users can read own settings"
  on public.user_settings for select
  using (user_id = auth.uid());

create policy "Users can insert own settings"
  on public.user_settings for insert
  with check (user_id = auth.uid());

create policy "Users can update own settings"
  on public.user_settings for update
  using (user_id = auth.uid());


-- ── 4. Workspace Subscriptions ─────────────────────────
create table if not exists public.workspace_subscriptions (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null unique references public.workspaces(id) on delete cascade,
  plan          text not null default 'trial' check (plan in ('trial', 'standard', 'premium', 'enterprise')),
  status        text not null default 'active' check (status in ('active', 'canceled', 'past_due', 'expired')),
  trial_ends_at timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.workspace_subscriptions enable row level security;

-- Members can read their workspace subscription
create policy "Members can read subscription"
  on public.workspace_subscriptions for select
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid()
    )
  );

-- Allow insert during onboarding
create policy "Authenticated users can create subscription"
  on public.workspace_subscriptions for insert
  with check (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role = 'owner'
    )
  );


-- ── Helper: auto-update updated_at ─────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger workspaces_updated_at
  before update on public.workspaces
  for each row execute function public.handle_updated_at();

create trigger user_settings_updated_at
  before update on public.user_settings
  for each row execute function public.handle_updated_at();

create trigger workspace_subscriptions_updated_at
  before update on public.workspace_subscriptions
  for each row execute function public.handle_updated_at();
