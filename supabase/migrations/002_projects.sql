-- ============================================================
-- RiskBases — Projects table
-- Run this in the Supabase SQL Editor AFTER 001_workspaces.sql
-- ============================================================

create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references public.workspaces(id) on delete cascade,
  name          text not null,
  description   text,
  status        text not null default 'active' check (status in ('active', 'archived', 'draft', 'completed')),
  sector        text,         -- e.g. "Bouw", "Infra", "Energie"
  reference     text,         -- external project code
  owner_id      uuid references auth.users(id) on delete set null,
  start_date    date,
  end_date      date,
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

-- Auto-update updated_at
create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();
