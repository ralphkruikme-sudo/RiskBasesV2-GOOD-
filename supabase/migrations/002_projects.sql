-- ============================================================
-- RiskBases — Projects table
-- Run this AFTER 001_workspaces.sql
-- Matches the live Supabase schema exactly.
-- ============================================================

create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references public.workspaces(id) on delete cascade,
  name          text not null,
  module_id     text,                          -- FK added after modules table exists
  status        text not null default 'draft'
    check (status in ('active', 'archived', 'draft', 'completed')),
  start_date    date,
  end_date      date,
  currency      text default 'EUR',
  risk_score    int4,                          -- aggregate project-level risk score
  exposure_eur  numeric,
  ingest_type   text default 'manual'
    check (ingest_type in ('manual', 'csv', 'api')),
  setup_status  text default 'not_started'
    check (setup_status in ('not_started', 'in_progress', 'completed')),
  created_by    uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.projects enable row level security;

-- Members of the workspace can read projects
create policy "Members can read projects"
  on public.projects for select
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid()
    )
  );

-- Members can create projects in their workspace
create policy "Members can create projects"
  on public.projects for insert
  with check (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid()
    )
  );

-- Members can update projects in their workspace
create policy "Members can update projects"
  on public.projects for update
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid()
    )
  );

-- Owners/admins can delete projects
create policy "Admins can delete projects"
  on public.projects for delete
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();


-- ── Project Members ────────────────────────────────────
create table if not exists public.project_members (
  project_id  uuid not null references public.projects(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        text not null default 'member',
  created_at  timestamptz not null default now(),

  primary key (project_id, user_id)
);

alter table public.project_members enable row level security;

create policy "Members can read project members"
  on public.project_members for select
  using (
    project_id in (
      select p.id from public.projects p
      join public.workspace_members wm on wm.workspace_id = p.workspace_id
      where wm.user_id = auth.uid()
    )
  );

create policy "Members can insert project members"
  on public.project_members for insert
  with check (
    project_id in (
      select p.id from public.projects p
      join public.workspace_members wm on wm.workspace_id = p.workspace_id
      where wm.user_id = auth.uid()
    )
  );
