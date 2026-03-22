-- ============================================================
-- PitchFólio — Schema Supabase
-- Execute no SQL Editor do Supabase
-- ============================================================

-- Tabela principal de assinaturas/acesso
CREATE TABLE IF NOT EXISTS subscriptions (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         TEXT NOT NULL UNIQUE,   -- Clerk user ID
  email           TEXT,
  name            TEXT,
  phone           TEXT,
  plan            TEXT NOT NULL DEFAULT 'trial',
  -- trial | free_link | premium | ilimitado | influencer | blocked
  period          TEXT,                   -- mensal | semestral | anual | unico
  status          TEXT NOT NULL DEFAULT 'active',
  -- active | expired | blocked | pending
  expires_at      TIMESTAMPTZ,            -- NULL = sem expiração (influencer etc)
  trial_started   TIMESTAMPTZ DEFAULT NOW(),
  works_used      INT DEFAULT 0,
  works_limit     INT DEFAULT 5,          -- trial = 5 trabalhos grátis
  admin_note      TEXT,                   -- motivo do override manual
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Pagamentos PIX
CREATE TABLE IF NOT EXISTS pix_payments (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         TEXT,
  email           TEXT,
  reference       TEXT UNIQUE NOT NULL,   -- PF-PREMIUM-timestamp-code
  pushinpay_id    TEXT,
  plan            TEXT NOT NULL,
  period          TEXT,
  value_cents     INT NOT NULL,
  status          TEXT DEFAULT 'pending', -- pending | paid | expired
  paid_at         TIMESTAMPTZ,
  webhook_raw     JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Overrides manuais do admin (influencer, bloqueios, brindes)
CREATE TABLE IF NOT EXISTS access_overrides (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         TEXT NOT NULL,
  email           TEXT,
  type            TEXT NOT NULL,          -- grant | block
  plan            TEXT DEFAULT 'premium', -- plano concedido
  reason          TEXT,                   -- influencer | campanha | brinde | fraude
  expires_at      TIMESTAMPTZ,            -- NULL = sem expiração
  admin_note      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- WhatsApp renewal reminders
CREATE TABLE IF NOT EXISTS renewal_reminders (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         TEXT NOT NULL,
  subscription_id UUID REFERENCES subscriptions(id),
  sent_at         TIMESTAMPTZ DEFAULT NOW(),
  type            TEXT DEFAULT 'renewal'  -- renewal | expiry_warning | welcome
);

-- RLS: apenas service_role acessa (segurança total)
ALTER TABLE subscriptions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE pix_payments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_overrides    ENABLE ROW LEVEL SECURITY;
ALTER TABLE renewal_reminders   ENABLE ROW LEVEL SECURITY;

-- Policy: service_role tem acesso total
CREATE POLICY "service_only" ON subscriptions      USING (false);
CREATE POLICY "service_only" ON pix_payments        USING (false);
CREATE POLICY "service_only" ON access_overrides    USING (false);
CREATE POLICY "service_only" ON renewal_reminders   USING (false);

-- Index para buscas rápidas
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_pix_reference ON pix_payments(reference);
CREATE INDEX IF NOT EXISTS idx_overrides_user_id ON access_overrides(user_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_subscriptions_updated
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Profiles — links personalizados /u/username
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     TEXT NOT NULL UNIQUE,
  username    TEXT NOT NULL UNIQUE,
  display_name TEXT,
  bio         TEXT,
  avatar_url  TEXT,
  is_public   BOOLEAN DEFAULT false,
  views       INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_only" ON profiles USING (false);

CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id  ON profiles(user_id);

CREATE TRIGGER trg_profiles_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
