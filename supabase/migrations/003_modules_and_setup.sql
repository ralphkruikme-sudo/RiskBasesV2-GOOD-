-- ============================================================
-- RiskBases — Modules, intake fields, risk templates,
-- stakeholders, permits, risks, actions, integrations
-- Run this AFTER 002_projects.sql
-- ============================================================

-- ── Alter projects: add module_id, ingest_type, setup_status, created_by ──
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS module_id     uuid,
  ADD COLUMN IF NOT EXISTS ingest_type   text DEFAULT 'manual'
    CHECK (ingest_type IN ('manual', 'csv', 'api')),
  ADD COLUMN IF NOT EXISTS setup_status  text DEFAULT 'not_started'
    CHECK (setup_status IN ('not_started', 'in_progress', 'completed')),
  ADD COLUMN IF NOT EXISTS created_by    uuid REFERENCES auth.users(id) ON DELETE SET NULL;


-- ── Modules ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.modules (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text NOT NULL UNIQUE,
  name        text NOT NULL,
  description text,
  icon        text,
  enabled     boolean NOT NULL DEFAULT false,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read modules"
  ON public.modules FOR SELECT USING (auth.uid() IS NOT NULL);

INSERT INTO public.modules (slug, name, description, icon, enabled, sort_order) VALUES
  ('construction',    'Bouw',            'Risicomanagement voor bouwprojecten',         '🏗️', true,  1),
  ('infrastructure',  'Infrastructuur',  'Risicomanagement voor infraprojecten',        '🛣️', true,  2),
  ('energy',          'Energie',         'Risicomanagement voor energieprojecten',      '⚡',  false, 3),
  ('water',           'Waterbeheer',     'Risicomanagement voor waterprojecten',        '💧',  false, 4),
  ('industry',        'Industrie',       'Risicomanagement voor industriële projecten', '🏭',  false, 5),
  ('government',      'Overheid',        'Risicomanagement voor overheidsprojecten',    '🏛️', false, 6);

-- Add FK on projects after modules exists
ALTER TABLE public.projects
  ADD CONSTRAINT projects_module_id_fkey
  FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE SET NULL;


-- ── Module Intake Fields ───────────────────────────────
CREATE TABLE IF NOT EXISTS public.module_intake_fields (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  field_key   text NOT NULL,
  label       text NOT NULL,
  field_type  text NOT NULL DEFAULT 'text'
    CHECK (field_type IN ('text', 'textarea', 'number', 'date', 'select', 'boolean')),
  options     jsonb,
  required    boolean NOT NULL DEFAULT false,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (module_id, field_key)
);

ALTER TABLE public.module_intake_fields ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read intake fields"
  ON public.module_intake_fields FOR SELECT USING (auth.uid() IS NOT NULL);

-- Construction intake fields
INSERT INTO public.module_intake_fields (module_id, field_key, label, field_type, required, sort_order, options) VALUES
  ((SELECT id FROM public.modules WHERE slug='construction'), 'project_type',   'Projecttype',               'select',   true,  1, '["Nieuwbouw","Renovatie","Sloop","Verbouwing","Onderhoud"]'),
  ((SELECT id FROM public.modules WHERE slug='construction'), 'location',       'Locatie',                   'text',     true,  2, NULL),
  ((SELECT id FROM public.modules WHERE slug='construction'), 'client_name',    'Opdrachtgever',             'text',     true,  3, NULL),
  ((SELECT id FROM public.modules WHERE slug='construction'), 'contract_type',  'Contractvorm',              'select',   false, 4, '["UAV","UAV-gc","D&C","Traditioneel","Anders"]'),
  ((SELECT id FROM public.modules WHERE slug='construction'), 'budget',         'Projectbudget (€)',         'number',   false, 5, NULL),
  ((SELECT id FROM public.modules WHERE slug='construction'), 'surface_area',   'Oppervlakte (m²)',          'number',   false, 6, NULL),
  ((SELECT id FROM public.modules WHERE slug='construction'), 'building_layers','Aantal bouwlagen',          'number',   false, 7, NULL),
  ((SELECT id FROM public.modules WHERE slug='construction'), 'notes',          'Aanvullende opmerkingen',   'textarea', false, 8, NULL);

-- Infrastructure intake fields
INSERT INTO public.module_intake_fields (module_id, field_key, label, field_type, required, sort_order, options) VALUES
  ((SELECT id FROM public.modules WHERE slug='infrastructure'), 'infra_type',     'Type infrastructuur',       'select',   true,  1, '["Weg","Brug","Tunnel","Kade","Riool","Spoor","Anders"]'),
  ((SELECT id FROM public.modules WHERE slug='infrastructure'), 'location',       'Locatie / tracé',           'text',     true,  2, NULL),
  ((SELECT id FROM public.modules WHERE slug='infrastructure'), 'client_name',    'Opdrachtgever',             'text',     true,  3, NULL),
  ((SELECT id FROM public.modules WHERE slug='infrastructure'), 'contract_type',  'Contractvorm',              'select',   false, 4, '["UAV","UAV-gc","D&C","DBFM","Traditioneel","Anders"]'),
  ((SELECT id FROM public.modules WHERE slug='infrastructure'), 'budget',         'Projectbudget (€)',         'number',   false, 5, NULL),
  ((SELECT id FROM public.modules WHERE slug='infrastructure'), 'length_km',      'Lengte (km)',               'number',   false, 6, NULL),
  ((SELECT id FROM public.modules WHERE slug='infrastructure'), 'traffic_impact', 'Verkeershinder verwacht',   'boolean',  false, 7, NULL),
  ((SELECT id FROM public.modules WHERE slug='infrastructure'), 'notes',          'Aanvullende opmerkingen',   'textarea', false, 8, NULL);


-- ── Module Risk Templates ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.module_risk_templates (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id           uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  category            text NOT NULL,
  title               text NOT NULL,
  description         text,
  default_probability int CHECK (default_probability BETWEEN 1 AND 5),
  default_impact      int CHECK (default_impact BETWEEN 1 AND 5),
  sort_order          int NOT NULL DEFAULT 0,
  created_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.module_risk_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read risk templates"
  ON public.module_risk_templates FOR SELECT USING (auth.uid() IS NOT NULL);

-- Construction risk templates
INSERT INTO public.module_risk_templates (module_id, category, title, description, default_probability, default_impact, sort_order) VALUES
  ((SELECT id FROM public.modules WHERE slug='construction'), 'Planning',   'Vertraging door weersomstandigheden',  'Extreme weersomstandigheden leiden tot stilstand',          3, 3, 1),
  ((SELECT id FROM public.modules WHERE slug='construction'), 'Planning',   'Vertraging materiaallevering',         'Supply chain vertragingen bouwmaterialen',                  3, 4, 2),
  ((SELECT id FROM public.modules WHERE slug='construction'), 'Kosten',     'Kostenoverschrijding materialen',      'Prijsstijgingen bouwmaterialen boven raming',               3, 4, 3),
  ((SELECT id FROM public.modules WHERE slug='construction'), 'Kosten',     'Onvoorziene grondwerkzaamheden',       'Onverwachte bodem leidt tot meerwerk',                      2, 5, 4),
  ((SELECT id FROM public.modules WHERE slug='construction'), 'Veiligheid', 'Arbeidsongeval op bouwplaats',         'Letsel bij personeel door onveilige situaties',             2, 5, 5),
  ((SELECT id FROM public.modules WHERE slug='construction'), 'Kwaliteit',  'Gebreken in uitvoering',               'Afwijkingen van bestek/tekeningen',                         3, 3, 6),
  ((SELECT id FROM public.modules WHERE slug='construction'), 'Omgeving',   'Overlast voor omwonenden',             'Geluids- of stofoverlast leidt tot klachten',               3, 2, 7),
  ((SELECT id FROM public.modules WHERE slug='construction'), 'Juridisch',  'Vergunningsproblematiek',              'Vertraging of weigering benodigde vergunningen',            2, 4, 8);

-- Infrastructure risk templates
INSERT INTO public.module_risk_templates (module_id, category, title, description, default_probability, default_impact, sort_order) VALUES
  ((SELECT id FROM public.modules WHERE slug='infrastructure'), 'Planning',   'Vertraging kabels en leidingen',   'Onbekende ondergrondse infra leidt tot oponthoud',      4, 3, 1),
  ((SELECT id FROM public.modules WHERE slug='infrastructure'), 'Planning',   'Vertraging nutsbedrijven',         'Verleggen kabels/leidingen duurt langer dan gepland',   3, 4, 2),
  ((SELECT id FROM public.modules WHERE slug='infrastructure'), 'Kosten',     'Kostenoverschrijding grondwerk',   'Bodemverontreiniging of grondwater problemen',          3, 5, 3),
  ((SELECT id FROM public.modules WHERE slug='infrastructure'), 'Verkeer',    'Verkeersproblematiek',             'Verkeershinder groter dan voorzien',                    3, 3, 4),
  ((SELECT id FROM public.modules WHERE slug='infrastructure'), 'Veiligheid', 'Arbeidsongeval',                   'Veiligheidsincident tijdens uitvoering',                2, 5, 5),
  ((SELECT id FROM public.modules WHERE slug='infrastructure'), 'Omgeving',   'Ecologische impact',               'Schade aan beschermde natuur/soorten',                   2, 4, 6),
  ((SELECT id FROM public.modules WHERE slug='infrastructure'), 'Omgeving',   'Stakeholder weerstand',            'Gemeenten/bewoners verzetten zich tegen project',       3, 3, 7),
  ((SELECT id FROM public.modules WHERE slug='infrastructure'), 'Juridisch',  'Contractgeschillen',               'Meningsverschillen over scope/meerwerk',                2, 4, 8);


-- ── Module Sidebar Items ───────────────────────────────
CREATE TABLE IF NOT EXISTS public.module_sidebar_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  label       text NOT NULL,
  href_suffix text NOT NULL,
  icon        text,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.module_sidebar_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read sidebar items"
  ON public.module_sidebar_items FOR SELECT USING (auth.uid() IS NOT NULL);


-- ── Project Intake Values ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.project_intake_values (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  field_key   text NOT NULL,
  value       jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, field_key)
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
  name            text NOT NULL,
  role            text,
  organisation    text,
  email           text,
  phone           text,
  influence_level text CHECK (influence_level IN ('low', 'medium', 'high')),
  sentiment       text CHECK (sentiment IN ('positive', 'neutral', 'negative', 'unknown')),
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
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
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name         text NOT NULL,
  type         text,
  status       text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'submitted', 'approved', 'rejected', 'expired')),
  authority    text,
  submitted_at date,
  expected_at  date,
  approved_at  date,
  notes        text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
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
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  category    text,
  title       text NOT NULL,
  description text,
  probability int CHECK (probability BETWEEN 1 AND 5),
  impact      int CHECK (impact BETWEEN 1 AND 5),
  risk_score  int GENERATED ALWAYS AS (probability * impact) STORED,
  status      text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'mitigated', 'accepted', 'closed')),
  owner_id    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
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


-- ── Actions ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.actions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  risk_id     uuid REFERENCES public.risks(id) ON DELETE SET NULL,
  title       text NOT NULL,
  description text,
  status      text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  priority    text DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  due_date    date,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
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


-- ── Triggers for updated_at ────────────────────────────
CREATE TRIGGER project_intake_values_updated_at
  BEFORE UPDATE ON public.project_intake_values
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER stakeholders_updated_at
  BEFORE UPDATE ON public.stakeholders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER permits_updated_at
  BEFORE UPDATE ON public.permits
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER risks_updated_at
  BEFORE UPDATE ON public.risks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER actions_updated_at
  BEFORE UPDATE ON public.actions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER project_integrations_updated_at
  BEFORE UPDATE ON public.project_integrations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
