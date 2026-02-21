-- ============================================================
-- RiskBases — Core workspace tables
-- Run this FIRST in the Supabase SQL Editor.
-- Matches the live Supabase schema exactly.
-- ============================================================

-- ── Helper: auto-update updated_at ─────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;


-- ── 1. Workspaces ──────────────────────────────────────
create table if not exists public.workspaces (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  industry_default text,
  created_by       uuid references auth.users(id) on delete cascade,
  created_at       timestamptz not null default now()
);

alter table public.workspaces enable row level security;

create policy "Members can read workspace"
  on public.workspaces for select
  using (
    id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid()
    )
  );

create policy "Owners can update workspace"
  on public.workspaces for update
  using (
    id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role = 'owner'
    )
  );

create policy "Authenticated users can create workspaces"
  on public.workspaces for insert
  with check (auth.uid() = created_by);


-- ── 2. Workspace Members (composite PK, no id column) ──
create table if not exists public.workspace_members (
  workspace_id  uuid not null references public.workspaces(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  role          text not null default 'member'
    check (role in ('owner', 'admin', 'member', 'viewer')),
  created_at    timestamptz not null default now(),

  primary key (workspace_id, user_id)
);

alter table public.workspace_members enable row level security;

create policy "Users can read own memberships"
  on public.workspace_members for select
  using (user_id = auth.uid());

create policy "Users can insert own membership"
  on public.workspace_members for insert
  with check (user_id = auth.uid());


-- ── 3. User Settings (PK = user_id) ───────────────────
create table if not exists public.user_settings (
  user_id               uuid primary key references auth.users(id) on delete cascade,
  language              text not null default 'nl',
  timezone              text not null default 'Europe/Amsterdam',
  default_workspace_id  uuid references public.workspaces(id) on delete set null,
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

create trigger user_settings_updated_at
  before update on public.user_settings
  for each row execute function public.handle_updated_at();


-- ── 4. Workspace Subscriptions ─────────────────────────
create table if not exists public.workspace_subscriptions (
  workspace_id            uuid primary key references public.workspaces(id) on delete cascade,
  plan_id                 text not null default 'trial',
  status                  text not null default 'trialing'
    check (status in ('trialing', 'active', 'canceled', 'past_due', 'expired')),
  trial_ends_at           timestamptz,
  stripe_customer_id      text,
  stripe_subscription_id  text,
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

alter table public.workspace_subscriptions enable row level security;

create policy "Members can read subscription"
  on public.workspace_subscriptions for select
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid()
    )
  );

create policy "Authenticated users can create subscription"
  on public.workspace_subscriptions for insert
  with check (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role = 'owner'
    )
  );

create trigger workspace_subscriptions_updated_at
  before update on public.workspace_subscriptions
  for each row execute function public.handle_updated_at();


-- ── 5. Plans (reference table) ─────────────────────────
create table if not exists public.plans (
  id          text primary key,
  name        text not null,
  price_eur   numeric,
  features    jsonb default '{}',
  created_at  timestamptz not null default now()
);

alter table public.plans enable row level security;

create policy "Anyone can read plans"
  on public.plans for select
  using (true);

insert into public.plans (id, name, price_eur) values
  ('trial',      'Trial',      0),
  ('standard',   'Standard',   49),
  ('premium',    'Premium',    99),
  ('enterprise', 'Enterprise', null)
on conflict (id) do nothing;


-- ── 6. Workspace Invites ───────────────────────────────
create table if not exists public.workspace_invites (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  email        text not null,
  role         text not null default 'member',
  invited_by   uuid references auth.users(id) on delete set null,
  accepted_at  timestamptz,
  created_at   timestamptz not null default now()
);

alter table public.workspace_invites enable row level security;

create policy "Members can read invites"
  on public.workspace_invites for select
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid()
    )
  );

create policy "Admins can create invites"
  on public.workspace_invites for insert
  with check (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );
