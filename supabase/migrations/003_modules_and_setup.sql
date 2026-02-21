-- ============================================================
-- RiskBases — Modules, intake fields, risk templates,
-- stakeholders, permits, risks, actions, integrations
-- Run this AFTER 002_projects.sql
-- Matches the live Supabase schema exactly.
-- ============================================================

-- ── Modules (id = text, not uuid) ──────────────────────
CREATE TABLE IF NOT EXISTS public.modules (
  id          text PRIMARY KEY,
  name        text NOT NULL,
  description text,
  is_active   boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read modules"
  ON public.modules FOR SELECT USING (auth.uid() IS NOT NULL);

-- FK on projects → modules (text id)
ALTER TABLE public.projects
  ADD CONSTRAINT projects_module_id_fkey
  FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE SET NULL;

-- Seed modules
INSERT INTO public.modules (id, name, description, is_active) VALUES
  ('construction',    'Bouw',            'Risicomanagement voor bouwprojecten',         true),
  ('infrastructure',  'Infrastructuur',  'Risicomanagement voor infraprojecten',        true),
  ('energy',          'Energie',         'Risicomanagement voor energieprojecten',      false),
  ('water',           'Waterbeheer',     'Risicomanagement voor waterprojecten',        false),
  ('industry',        'Industrie',       'Risicomanagement voor industriële projecten', false),
  ('government',      'Overheid',        'Risicomanagement voor overheidsprojecten',    false)
ON CONFLICT (id) DO NOTHING;


-- ── Module Risk Categories ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.module_risk_categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   text NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  key         text NOT NULL,
  label       text NOT NULL,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (module_id, key)
);

ALTER TABLE public.module_risk_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read risk categories"
  ON public.module_risk_categories FOR SELECT USING (auth.uid() IS NOT NULL);


-- ── Module Risk Subcategories ──────────────────────────
CREATE TABLE IF NOT EXISTS public.module_risk_subcategories (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   uuid NOT NULL REFERENCES public.module_risk_categories(id) ON DELETE CASCADE,
  key           text NOT NULL,
  label         text NOT NULL,
  sort_order    int NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.module_risk_subcategories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read risk subcategories"
  ON public.module_risk_subcategories FOR SELECT USING (auth.uid() IS NOT NULL);


-- ── Module Intake Fields ───────────────────────────────
CREATE TABLE IF NOT EXISTS public.module_intake_fields (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   text NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  field_key   text NOT NULL,
  label       text NOT NULL,
  field_type  text NOT NULL DEFAULT 'text'
    CHECK (field_type IN ('text', 'textarea', 'number', 'date', 'select', 'boolean')),
  options     jsonb,
  is_required boolean NOT NULL DEFAULT false,
  sort_order  int NOT NULL DEFAULT 0,
  help_text   text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (module_id, field_key)
);

ALTER TABLE public.module_intake_fields ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read intake fields"
  ON public.module_intake_fields FOR SELECT USING (auth.uid() IS NOT NULL);

-- Construction intake fields
INSERT INTO public.module_intake_fields (module_id, field_key, label, field_type, is_required, sort_order, options) VALUES
  ('construction', 'project_type',   'Projecttype',               'select',   true,  1, '["Nieuwbouw","Renovatie","Sloop","Verbouwing","Onderhoud"]'),
  ('construction', 'location',       'Locatie',                   'text',     true,  2, NULL),
  ('construction', 'client_name',    'Opdrachtgever',             'text',     true,  3, NULL),
  ('construction', 'contract_type',  'Contractvorm',              'select',   false, 4, '["UAV","UAV-gc","D&C","Traditioneel","Anders"]'),
  ('construction', 'budget',         'Projectbudget (€)',         'number',   false, 5, NULL),
  ('construction', 'surface_area',   'Oppervlakte (m²)',          'number',   false, 6, NULL),
  ('construction', 'building_layers','Aantal bouwlagen',          'number',   false, 7, NULL),
  ('construction', 'notes',          'Aanvullende opmerkingen',   'textarea', false, 8, NULL)
ON CONFLICT (module_id, field_key) DO NOTHING;

-- Infrastructure intake fields
INSERT INTO public.module_intake_fields (module_id, field_key, label, field_type, is_required, sort_order, options) VALUES
  ('infrastructure', 'infra_type',     'Type infrastructuur',       'select',   true,  1, '["Weg","Brug","Tunnel","Kade","Riool","Spoor","Anders"]'),
  ('infrastructure', 'location',       'Locatie / tracé',           'text',     true,  2, NULL),
  ('infrastructure', 'client_name',    'Opdrachtgever',             'text',     true,  3, NULL),
  ('infrastructure', 'contract_type',  'Contractvorm',              'select',   false, 4, '["UAV","UAV-gc","D&C","DBFM","Traditioneel","Anders"]'),
  ('infrastructure', 'budget',         'Projectbudget (€)',         'number',   false, 5, NULL),
  ('infrastructure', 'length_km',      'Lengte (km)',               'number',   false, 6, NULL),
  ('infrastructure', 'traffic_impact', 'Verkeershinder verwacht',   'boolean',  false, 7, NULL),
  ('infrastructure', 'notes',          'Aanvullende opmerkingen',   'textarea', false, 8, NULL)
ON CONFLICT (module_id, field_key) DO NOTHING;


-- ── Module Risk Templates ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.module_risk_templates (
  id                           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id                    text NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title                        text NOT NULL,
  description                  text,
  category_key                 text,
  subcategory_key              text,
  default_probability          int CHECK (default_probability BETWEEN 1 AND 5),
  default_impact               int CHECK (default_impact BETWEEN 1 AND 5),
  default_financial_impact_eur numeric,
  default_schedule_impact_days int,
  sort_order                   int NOT NULL DEFAULT 0,
  is_active                    boolean NOT NULL DEFAULT true,
  created_at                   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.module_risk_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read risk templates"
  ON public.module_risk_templates FOR SELECT USING (auth.uid() IS NOT NULL);

-- Construction risk templates
INSERT INTO public.module_risk_templates (module_id, category_key, title, description, default_probability, default_impact, sort_order) VALUES
  ('construction', 'planning',   'Vertraging door weersomstandigheden',  'Extreme weersomstandigheden leiden tot stilstand',          3, 3, 1),
  ('construction', 'planning',   'Vertraging materiaallevering',         'Supply chain vertragingen bouwmaterialen',                  3, 4, 2),
  ('construction', 'kosten',     'Kostenoverschrijding materialen',      'Prijsstijgingen bouwmaterialen boven raming',               3, 4, 3),
  ('construction', 'kosten',     'Onvoorziene grondwerkzaamheden',       'Onverwachte bodem leidt tot meerwerk',                      2, 5, 4),
  ('construction', 'veiligheid', 'Arbeidsongeval op bouwplaats',         'Letsel bij personeel door onveilige situaties',             2, 5, 5),
  ('construction', 'kwaliteit',  'Gebreken in uitvoering',               'Afwijkingen van bestek/tekeningen',                         3, 3, 6),
  ('construction', 'omgeving',   'Overlast voor omwonenden',             'Geluids- of stofoverlast leidt tot klachten',               3, 2, 7),
  ('construction', 'juridisch',  'Vergunningsproblematiek',              'Vertraging of weigering benodigde vergunningen',            2, 4, 8)
ON CONFLICT DO NOTHING;

-- Infrastructure risk templates
INSERT INTO public.module_risk_templates (module_id, category_key, title, description, default_probability, default_impact, sort_order) VALUES
  ('infrastructure', 'planning',   'Vertraging kabels en leidingen',   'Onbekende ondergrondse infra leidt tot oponthoud',      4, 3, 1),
  ('infrastructure', 'planning',   'Vertraging nutsbedrijven',         'Verleggen kabels/leidingen duurt langer dan gepland',   3, 4, 2),
  ('infrastructure', 'kosten',     'Kostenoverschrijding grondwerk',   'Bodemverontreiniging of grondwater problemen',          3, 5, 3),
  ('infrastructure', 'verkeer',    'Verkeersproblematiek',             'Verkeershinder groter dan voorzien',                    3, 3, 4),
  ('infrastructure', 'veiligheid', 'Arbeidsongeval',                   'Veiligheidsincident tijdens uitvoering',                2, 5, 5),
  ('infrastructure', 'omgeving',   'Ecologische impact',               'Schade aan beschermde natuur/soorten',                   2, 4, 6),
  ('infrastructure', 'omgeving',   'Stakeholder weerstand',            'Gemeenten/bewoners verzetten zich tegen project',       3, 3, 7),
  ('infrastructure', 'juridisch',  'Contractgeschillen',               'Meningsverschillen over scope/meerwerk',                2, 4, 8)
ON CONFLICT DO NOTHING;


-- ── Module Sidebar Items ───────────────────────────────
CREATE TABLE IF NOT EXISTS public.module_sidebar_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   text NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  label       text NOT NULL,
  href_suffix text NOT NULL,
  icon        text,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.module_sidebar_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read sidebar items"
  ON public.module_sidebar_items FOR SELECT USING (auth.uid() IS NOT NULL);


-- ── Module Mitigation Playbooks ────────────────────────
CREATE TABLE IF NOT EXISTS public.module_mitigation_playbooks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   text NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text,
  steps       jsonb DEFAULT '[]',
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.module_mitigation_playbooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read playbooks"
  ON public.module_mitigation_playbooks FOR SELECT USING (auth.uid() IS NOT NULL);


-- ── Project Intake Values (composite PK, no id) ────────
CREATE TABLE IF NOT EXISTS public.project_intake_values (
  project_id  uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  field_key   text NOT NULL,
  value       jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (project_id, field_key)
);

ALTER TABLE public.project_intake_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read intake values" ON public.project_intake_values FOR SELECT
  USING (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can insert intake values" ON public.project_intake_values FOR INSERT
  WITH CHECK (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can update intake values" ON public.project_intake_values FOR UPDATE
  USING (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can delete intake values" ON public.project_intake_values FOR DELETE
  USING (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));


-- ── Stakeholders ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.stakeholders (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  stakeholder_type text,
  name            text NOT NULL,
  email           text,
  phone           text,
  notes           text,
  influence_level text CHECK (influence_level IN ('low', 'medium', 'high')),
  sentiment       text CHECK (sentiment IN ('positive', 'neutral', 'negative', 'unknown')),
  last_contact_at timestamptz,
  next_contact_at timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.stakeholders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read stakeholders" ON public.stakeholders FOR SELECT
  USING (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can insert stakeholders" ON public.stakeholders FOR INSERT
  WITH CHECK (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can update stakeholders" ON public.stakeholders FOR UPDATE
  USING (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can delete stakeholders" ON public.stakeholders FOR DELETE
  USING (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));


-- ── Permits ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.permits (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id     uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  permit_type    text NOT NULL,
  status         text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'submitted', 'approved', 'rejected', 'expired')),
  expected_date  date,
  actual_date    date,
  owner_user_id  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes          text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.permits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read permits" ON public.permits FOR SELECT
  USING (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can insert permits" ON public.permits FOR INSERT
  WITH CHECK (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can update permits" ON public.permits FOR UPDATE
  USING (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can delete permits" ON public.permits FOR DELETE
  USING (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));


-- ── Risks ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.risks (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id            uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title                 text NOT NULL,
  description           text,
  category_key          text,
  subcategory_key       text,
  probability           int CHECK (probability BETWEEN 1 AND 5),
  impact                int CHECK (impact BETWEEN 1 AND 5),
  financial_impact_eur  numeric,
  schedule_impact_days  int,
  status                text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'mitigated', 'accepted', 'closed')),
  owner_user_id         uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by            uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  last_updated_at       timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read risks" ON public.risks FOR SELECT
  USING (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can insert risks" ON public.risks FOR INSERT
  WITH CHECK (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can update risks" ON public.risks FOR UPDATE
  USING (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can delete risks" ON public.risks FOR DELETE
  USING (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));


-- ── Risk Updates (history) ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.risk_updates (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_id     uuid NOT NULL REFERENCES public.risks(id) ON DELETE CASCADE,
  field       text NOT NULL,
  old_value   text,
  new_value   text,
  changed_by  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.risk_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can read risk updates" ON public.risk_updates FOR SELECT
  USING (risk_id IN (
    SELECT r.id FROM public.risks r
    JOIN public.projects p ON p.id = r.project_id
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));


-- ── Risk ↔ Stakeholder link ───────────────────────────
CREATE TABLE IF NOT EXISTS public.risk_stakeholders (
  risk_id        uuid NOT NULL REFERENCES public.risks(id) ON DELETE CASCADE,
  stakeholder_id uuid NOT NULL REFERENCES public.stakeholders(id) ON DELETE CASCADE,
  created_at     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (risk_id, stakeholder_id)
);

ALTER TABLE public.risk_stakeholders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can read risk_stakeholders" ON public.risk_stakeholders FOR SELECT
  USING (risk_id IN (
    SELECT r.id FROM public.risks r
    JOIN public.projects p ON p.id = r.project_id
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));


-- ── Actions ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.actions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id       uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  risk_id          uuid REFERENCES public.risks(id) ON DELETE SET NULL,
  title            text NOT NULL,
  description      text,
  assignee_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date         date,
  status           text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  priority         text DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  created_by       uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read actions" ON public.actions FOR SELECT
  USING (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can insert actions" ON public.actions FOR INSERT
  WITH CHECK (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can update actions" ON public.actions FOR UPDATE
  USING (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can delete actions" ON public.actions FOR DELETE
  USING (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE TRIGGER actions_updated_at
  BEFORE UPDATE ON public.actions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ── Stakeholder Interactions ───────────────────────────
CREATE TABLE IF NOT EXISTS public.stakeholder_interactions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stakeholder_id  uuid NOT NULL REFERENCES public.stakeholders(id) ON DELETE CASCADE,
  interaction_type text NOT NULL,
  notes           text,
  created_by      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.stakeholder_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can read interactions" ON public.stakeholder_interactions FOR SELECT
  USING (stakeholder_id IN (
    SELECT s.id FROM public.stakeholders s
    JOIN public.projects p ON p.id = s.project_id
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));


-- ── Comments ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.comments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  entity_type text NOT NULL,          -- 'risk', 'action', 'stakeholder', etc.
  entity_id   uuid NOT NULL,
  body        text NOT NULL,
  author_id   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can read comments" ON public.comments FOR SELECT
  USING (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));
CREATE POLICY "Members can insert comments" ON public.comments FOR INSERT
  WITH CHECK (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));


-- ── Activity Log ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.activity_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action      text NOT NULL,
  entity_type text,
  entity_id   uuid,
  metadata    jsonb DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can read activity" ON public.activity_log FOR SELECT
  USING (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));


-- ── Notifications ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text NOT NULL,
  body        text,
  read        boolean NOT NULL DEFAULT false,
  link        text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own notifications" ON public.notifications FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());


-- ── Project Integrations ───────────────────────────────
CREATE TABLE IF NOT EXISTS public.project_integrations (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id       uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  integration_type text NOT NULL
    CHECK (integration_type IN ('erp', 'bim')),
  status           text NOT NULL DEFAULT 'not_connected'
    CHECK (status IN ('not_connected', 'connected', 'syncing', 'error')),
  config           jsonb DEFAULT '{}',
  last_synced_at   timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, integration_type)
);

ALTER TABLE public.project_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read integrations" ON public.project_integrations FOR SELECT
  USING (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can insert integrations" ON public.project_integrations FOR INSERT
  WITH CHECK (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can update integrations" ON public.project_integrations FOR UPDATE
  USING (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE TRIGGER project_integrations_updated_at
  BEFORE UPDATE ON public.project_integrations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
