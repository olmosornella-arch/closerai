-- ═══════════════════════════════════════════════════════════════════════════════
-- CloserAI Communications Engine — Schema completo de Supabase
-- Ejecutar en el SQL Editor de Supabase en este orden exacto
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── EXTENSIONES ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";        -- para el sequence runner
CREATE EXTENSION IF NOT EXISTS "http";            -- para llamar Edge Functions desde cron

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLAS
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── WORKSPACES ───────────────────────────────────────────────────────────────
CREATE TABLE workspaces (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan         TEXT NOT NULL DEFAULT 'trial' CHECK (plan IN ('trial','growth','pro','agency')),
  trial_ends_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '14 days'),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── WORKSPACE MEMBERS ────────────────────────────────────────────────────────
CREATE TABLE workspace_members (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role         TEXT NOT NULL DEFAULT 'setter' CHECK (role IN ('owner','closer','setter')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id, user_id)
);

-- ─── INTEGRACIONES BYOK (keys encriptadas) ────────────────────────────────────
CREATE TABLE workspace_integrations (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id     UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  provider         TEXT NOT NULL CHECK (provider IN ('resend','evolution','twilio')),
  encrypted_key    TEXT NOT NULL,
  encrypted_secret TEXT,
  config_json      JSONB NOT NULL DEFAULT '{}',
  verified_at      TIMESTAMPTZ,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id, provider)
);

-- ─── INSTANCIAS DE WHATSAPP ───────────────────────────────────────────────────
CREATE TABLE wa_instances (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  instance_name TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'disconnected'
                CHECK (status IN ('connected','disconnected','connecting','qr_pending')),
  phone         TEXT,
  owner_name    TEXT,                  -- nombre del setter que vinculó el número
  qr_expires_at TIMESTAMPTZ,
  connected_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id, instance_name)
);

-- ─── CONTACTOS ────────────────────────────────────────────────────────────────
CREATE TABLE contacts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  phone        TEXT,
  email        TEXT,
  channel      TEXT NOT NULL DEFAULT 'whatsapp'
               CHECK (channel IN ('whatsapp','sms','email','call')),
  tags         TEXT[] NOT NULL DEFAULT '{}',
  status       TEXT NOT NULL DEFAULT 'new'
               CHECK (status IN ('new','contacted','replied','call_scheduled','closed','lost')),
  source       TEXT,
  email_status TEXT CHECK (email_status IN ('active','bounced','unsubscribed')),
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── TEMPLATES DE MENSAJES ────────────────────────────────────────────────────
CREATE TABLE message_templates (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  channel      TEXT NOT NULL CHECK (channel IN ('whatsapp','sms','email')),
  subject      TEXT,                  -- solo para email
  content      TEXT NOT NULL,
  variables    TEXT[] NOT NULL DEFAULT '{}',  -- ej: ['nombre','empresa']
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SECUENCIAS ───────────────────────────────────────────────────────────────
CREATE TABLE sequences (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  channel      TEXT NOT NULL CHECK (channel IN ('whatsapp','sms','email','mixed')),
  steps_json   JSONB NOT NULL DEFAULT '[]',
  active       BOOLEAN NOT NULL DEFAULT true,
  enrolled     INTEGER NOT NULL DEFAULT 0,
  converted    INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ENROLLMENTS ──────────────────────────────────────────────────────────────
CREATE TABLE sequence_enrollments (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sequence_id      UUID NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
  contact_id       UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  workspace_id     UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  current_step     INTEGER NOT NULL DEFAULT 0,
  status           TEXT NOT NULL DEFAULT 'active'
                   CHECK (status IN ('active','paused','completed','failed','cancelled','replied')),
  next_run_at      TIMESTAMPTZ,
  last_run_at      TIMESTAMPTZ,
  enrolled_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at     TIMESTAMPTZ,
  replied_at       TIMESTAMPTZ,
  cancelled_reason TEXT,
  retry_count      INTEGER NOT NULL DEFAULT 0,
  last_error       TEXT,
  UNIQUE (sequence_id, contact_id)
);

-- ─── LOGS DE MENSAJES ─────────────────────────────────────────────────────────
CREATE TABLE message_logs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  contact_id   UUID REFERENCES contacts(id) ON DELETE SET NULL,
  channel      TEXT NOT NULL,
  direction    TEXT NOT NULL CHECK (direction IN ('in','out')),
  content      TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'sent',
  provider_id  TEXT,                  -- ID del mensaje en la API externa
  cost_usd     DECIMAL(10,6) NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── INBOX ────────────────────────────────────────────────────────────────────
-- Tabla liviana para mensajes entrantes (Realtime) — se archiva periódicamente
CREATE TABLE inbox_messages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  contact_id    UUID REFERENCES contacts(id) ON DELETE SET NULL,
  contact_name  TEXT,
  contact_phone TEXT,
  channel       TEXT NOT NULL,
  direction     TEXT NOT NULL CHECK (direction IN ('in','out')),
  content       TEXT NOT NULL,
  read          BOOLEAN NOT NULL DEFAULT false,
  provider_id   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── CALL LOGS ────────────────────────────────────────────────────────────────
CREATE TABLE call_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  contact_id    UUID REFERENCES contacts(id) ON DELETE SET NULL,
  direction     TEXT NOT NULL DEFAULT 'outbound' CHECK (direction IN ('inbound','outbound')),
  twilio_sid    TEXT UNIQUE,
  status        TEXT NOT NULL DEFAULT 'completed',
  duration_s    INTEGER NOT NULL DEFAULT 0,
  recording_url TEXT,
  cost_usd      DECIMAL(10,6) NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ÍNDICES
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE INDEX idx_contacts_workspace       ON contacts(workspace_id);
CREATE INDEX idx_contacts_phone           ON contacts(phone);
CREATE INDEX idx_contacts_email           ON contacts(email);
CREATE INDEX idx_message_logs_workspace   ON message_logs(workspace_id);
CREATE INDEX idx_message_logs_contact     ON message_logs(contact_id);
CREATE INDEX idx_message_logs_created     ON message_logs(created_at DESC);
CREATE INDEX idx_enrollments_workspace    ON sequence_enrollments(workspace_id);
CREATE INDEX idx_enrollments_next_run     ON sequence_enrollments(next_run_at)
  WHERE status = 'active';               -- índice parcial — clave para pg_cron
CREATE INDEX idx_inbox_workspace          ON inbox_messages(workspace_id, created_at DESC);
CREATE INDEX idx_inbox_unread             ON inbox_messages(workspace_id, read)
  WHERE read = false;

-- ═══════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════════════════

ALTER TABLE workspaces             ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members      ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE wa_instances           ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts               ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates      ENABLE ROW LEVEL SECURITY;
ALTER TABLE sequences              ENABLE ROW LEVEL SECURITY;
ALTER TABLE sequence_enrollments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_logs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbox_messages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs              ENABLE ROW LEVEL SECURITY;

-- Función helper: obtiene el workspace_id del usuario autenticado
CREATE OR REPLACE FUNCTION get_user_workspace_id()
RETURNS UUID AS $$
  SELECT workspace_id FROM workspace_members
  WHERE user_id = auth.uid()
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Políticas: el usuario solo ve datos de SU workspace
CREATE POLICY workspace_isolation ON workspaces
  USING (id = get_user_workspace_id());

CREATE POLICY workspace_isolation ON workspace_members
  USING (workspace_id = get_user_workspace_id());

CREATE POLICY workspace_isolation ON workspace_integrations
  USING (workspace_id = get_user_workspace_id());

CREATE POLICY workspace_isolation ON wa_instances
  USING (workspace_id = get_user_workspace_id());

CREATE POLICY workspace_isolation ON contacts
  USING (workspace_id = get_user_workspace_id());

CREATE POLICY workspace_isolation ON message_templates
  USING (workspace_id = get_user_workspace_id());

CREATE POLICY workspace_isolation ON sequences
  USING (workspace_id = get_user_workspace_id());

CREATE POLICY workspace_isolation ON sequence_enrollments
  USING (workspace_id = get_user_workspace_id());

CREATE POLICY workspace_isolation ON message_logs
  USING (workspace_id = get_user_workspace_id());

CREATE POLICY workspace_isolation ON inbox_messages
  USING (workspace_id = get_user_workspace_id());

CREATE POLICY workspace_isolation ON call_logs
  USING (workspace_id = get_user_workspace_id());

-- ═══════════════════════════════════════════════════════════════════════════════
-- FUNCIONES AUXILIARES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Incrementar contador enrolled de una secuencia (llamado desde Edge Function)
CREATE OR REPLACE FUNCTION increment_sequence_enrolled(seq_id UUID)
RETURNS VOID AS $$
  UPDATE sequences SET enrolled = enrolled + 1 WHERE id = seq_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Incrementar contador converted de una secuencia
CREATE OR REPLACE FUNCTION increment_sequence_converted(seq_id UUID)
RETURNS VOID AS $$
  UPDATE sequences SET converted = converted + 1 WHERE id = seq_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Auto-update de updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_sequences_updated_at
  BEFORE UPDATE ON sequences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_message_logs_updated_at
  BEFORE UPDATE ON message_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Onboarding: cuando se crea un usuario, crear su workspace automáticamente
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_workspace_id UUID;
BEGIN
  -- Crear workspace
  INSERT INTO workspaces (name, owner_user_id, trial_ends_at)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)) || '''s workspace',
    NEW.id,
    NOW() + INTERVAL '14 days'
  )
  RETURNING id INTO new_workspace_id;

  -- Agregar al usuario como owner
  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (new_workspace_id, NEW.id, 'owner');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ═══════════════════════════════════════════════════════════════════════════════
-- REALTIME — habilitar para inbox en tiempo real
-- ═══════════════════════════════════════════════════════════════════════════════

-- Habilitar Realtime en inbox_messages
-- (hacerlo desde el dashboard de Supabase: Database → Replication → inbox_messages)
-- O con SQL:
ALTER PUBLICATION supabase_realtime ADD TABLE inbox_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE call_logs;

-- ═══════════════════════════════════════════════════════════════════════════════
-- PG_CRON — sequence runner sin n8n
-- ═══════════════════════════════════════════════════════════════════════════════

-- El sequence-runner se llama cada hora vía HTTP a la Edge Function
-- IMPORTANTE: reemplazar YOUR_SUPABASE_URL y YOUR_CRON_SECRET con tus valores

SELECT cron.schedule(
  'closerAI-sequence-runner',      -- nombre del job (único)
  '0 * * * *',                     -- cada hora en punto
  $$
    SELECT net.http_post(
      url := 'https://YOUR_SUPABASE_URL.supabase.co/functions/v1/sequence-runner',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-cron-secret', 'YOUR_CRON_SECRET'
      ),
      body := '{}'::jsonb
    );
  $$
);

-- Verificar que el job quedó creado:
-- SELECT * FROM cron.job;

-- Para modificar la frecuencia (ej: cada 30 min):
-- SELECT cron.unschedule('closerAI-sequence-runner');
-- SELECT cron.schedule('closerAI-sequence-runner', '*/30 * * * *', $$...$$);

-- ═══════════════════════════════════════════════════════════════════════════════
-- DATOS INICIALES — templates de mensajes de ejemplo
-- ═══════════════════════════════════════════════════════════════════════════════

-- Nota: estos se crean sin workspace_id para que sean plantillas globales
-- En producción, cada workspace crea los suyos

-- Para insertar templates iniciales al crear un workspace:
-- INSERT INTO message_templates (workspace_id, name, channel, content)
-- VALUES
--   (NEW_WORKSPACE_ID, 'Apertura LinkedIn', 'whatsapp',
--    'Hola [nombre], vi tu contenido sobre [tema] — al buscarte en Instagram no encontré perfil de [empresa]. Supongo que ya lo tendrás controlado, pero ¿cómo lo están manejando?'),
--   (NEW_WORKSPACE_ID, 'Follow-up 48hs', 'whatsapp',
--    '[nombre], quedé con las ganas de escuchar cómo lo manejan en [empresa]. ¿Sigue siendo relevante o prefiero dejarlo aquí?'),
--   (NEW_WORKSPACE_ID, 'Breakup empático', 'whatsapp',
--    'Asumo que esto no encaja ahora mismo. Cierro por acá. Si en algún momento cambia algo, acá estoy.');

-- ─── TRIAL SUPPORT (agregar a la tabla workspaces) ────────────────────────────
-- Ejecutar si ya creaste la tabla workspaces:
ALTER TABLE workspaces
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Actualizar el trigger de creación de usuario para setear el trial
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_workspace_id UUID;
BEGIN
  INSERT INTO workspaces (name, owner_user_id, plan, trial_ends_at)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)) || '''s workspace',
    NEW.id,
    'trial',
    NOW() + INTERVAL '14 days'
  )
  RETURNING id INTO new_workspace_id;

  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (new_workspace_id, NEW.id, 'owner');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLAS ADICIONALES — FastAPI Backend + Email Marketing
-- (Ejecutar después del schema principal)
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── LEAD MEMORY (para agentes LangGraph) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS lead_memory (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     TEXT NOT NULL,
  workspace   TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content     TEXT NOT NULL,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_lead_memory_compound ON lead_memory(workspace, lead_id, created_at);
ALTER TABLE lead_memory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_lead_memory" ON lead_memory USING (auth.role() = 'service_role');

-- ─── API USAGE (analytics de uso de IA) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS api_usage (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace   TEXT NOT NULL,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint    TEXT NOT NULL,
  model       TEXT NOT NULL,
  tokens_in   INT DEFAULT 0,
  tokens_out  INT DEFAULT 0,
  cost_usd    DECIMAL(10, 6) DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_api_usage_workspace ON api_usage(workspace);
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_read_own_api_usage" ON api_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "service_role_api_usage" ON api_usage FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- ─── EMAIL SEQUENCES (secuencias guardadas de email marketing) ─────────────────
CREATE TABLE IF NOT EXISTS email_sequences (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL DEFAULT 'Sin título',
  sequence_type TEXT NOT NULL,
  topic         TEXT DEFAULT '',
  result_json   JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_email_sequences_ws ON email_sequences(workspace_id);
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members_own_email_sequences" ON email_sequences
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_id = email_sequences.workspace_id
      AND user_id = auth.uid()
    )
  );

-- ─── USER VOICE PROFILES (ADN de escritura guardado por usuario) ───────────────
-- Complementa el perfil del usuario con su ADN de voz para la IA
CREATE TABLE IF NOT EXISTS user_voice_profiles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  writing_tone     TEXT DEFAULT 'conversacional',
  sentence_length  TEXT DEFAULT 'cortas',
  uses_emoji       BOOLEAN DEFAULT false,
  uses_humor       BOOLEAN DEFAULT true,
  avoid_words      TEXT DEFAULT '',
  signature_phrase TEXT DEFAULT '',
  writing_sample1  TEXT DEFAULT '',
  writing_sample2  TEXT DEFAULT '',
  writing_sample3  TEXT DEFAULT '',
  origin_story     TEXT DEFAULT '',
  dream_client_description TEXT DEFAULT '',
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE user_voice_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_voice_profile" ON user_voice_profiles
  FOR ALL USING (auth.uid() = user_id);

-- ─── WAITLIST (landing page) ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS waitlist (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT UNIQUE NOT NULL,
  lang       TEXT DEFAULT 'es',
  source     TEXT DEFAULT 'landing',
  invited    BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
-- Solo service role puede leer (para el admin dashboard)
CREATE POLICY "service_role_waitlist" ON waitlist USING (auth.role() = 'service_role');
-- Cualquiera puede insertar su email (anon)
CREATE POLICY "anon_insert_waitlist" ON waitlist FOR INSERT WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════════════════
-- STRIPE — Columnas y tablas requeridas por el webhook y el checkout
-- Ejecutar después del schema principal si no están presentes
-- ═══════════════════════════════════════════════════════════════════════════════

-- Columnas faltantes en workspaces (el webhook las necesita para actualizar el plan)
ALTER TABLE workspaces
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trial'
    CHECK (subscription_status IN ('trial','trialing','active','past_due','canceled','incomplete')),
  ADD COLUMN IF NOT EXISTS plan_updated_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS plan_ends_at         TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_payment_at      TIMESTAMPTZ;

-- billing_logs: registro de cada pago (el webhook lo llena en invoice.payment_succeeded)
CREATE TABLE IF NOT EXISTS billing_logs (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id      UUID        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT        NOT NULL,
  amount_usd        DECIMAL(10,2) NOT NULL,
  status            TEXT        NOT NULL DEFAULT 'paid',
  period_start      TIMESTAMPTZ,
  period_end        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_billing_logs_ws ON billing_logs(workspace_id);
ALTER TABLE billing_logs ENABLE ROW LEVEL SECURITY;

-- Owners ven sus propios logs de facturación
CREATE POLICY "owners_read_billing" ON billing_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_id = billing_logs.workspace_id
        AND user_id = auth.uid()
        AND role = 'owner'
    )
  );

-- Solo service role puede insertar (lo hace el webhook)
CREATE POLICY "service_insert_billing" ON billing_logs
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
