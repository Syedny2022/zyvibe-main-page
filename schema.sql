-- Bootstrap script: wrangler d1 execute zyvibe_leads --file=./schema.sql
CREATE TABLE IF NOT EXISTS leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  source_page TEXT    NOT NULL DEFAULT 'hero',
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Website Sprint concepts (additive; the leads table above is unchanged).
-- Apply: wrangler d1 execute zyvibe_leads --remote --file=./schema.sql
CREATE TABLE IF NOT EXISTS concepts (
  id               TEXT    PRIMARY KEY,
  created_at       TEXT    NOT NULL DEFAULT (datetime('now')),
  status           TEXT    NOT NULL DEFAULT 'queued',
  business_name    TEXT    NOT NULL,
  contact_name     TEXT    NOT NULL,
  email            TEXT    NOT NULL,
  visual_direction TEXT    NOT NULL,
  intake_json      TEXT    NOT NULL,
  concept_json     TEXT,
  prompt_version   TEXT    NOT NULL,
  error_code       TEXT,
  feedback_count   INTEGER NOT NULL DEFAULT 0,
  src              TEXT    NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_concepts_email_created ON concepts(email, created_at);
CREATE INDEX IF NOT EXISTS idx_concepts_created ON concepts(created_at);
