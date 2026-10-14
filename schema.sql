-- D1 database: zyvibe_leads (binding ZYVIBE_LEADS)
-- Apply:  npx wrangler d1 execute zyvibe_leads --remote --file=./schema.sql
-- Safe to re-run: every statement is IF NOT EXISTS.

-- Newsletter / early leads from the previous site. Kept as-is.
CREATE TABLE IF NOT EXISTS leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  source_page TEXT    NOT NULL DEFAULT 'hero',
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Website Sprint requests from /website-sprint (POST /api/lead).
CREATE TABLE IF NOT EXISTS sprint_requests (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  name             TEXT NOT NULL,
  email            TEXT NOT NULL,
  business_name    TEXT NOT NULL,
  industry         TEXT NOT NULL,
  description      TEXT NOT NULL,
  requirements     TEXT NOT NULL,
  phone            TEXT NOT NULL DEFAULT 'Not provided',
  website          TEXT NOT NULL DEFAULT 'Not provided',
  target_customers TEXT NOT NULL DEFAULT 'Not provided',
  notes            TEXT NOT NULL DEFAULT 'None',
  ip_hash          TEXT NOT NULL,
  email_status     TEXT NOT NULL DEFAULT 'pending',
  telegram_status  TEXT NOT NULL DEFAULT 'pending',
  created_at       TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_sprint_requests_ip_created ON sprint_requests(ip_hash, created_at);
CREATE INDEX IF NOT EXISTS idx_sprint_requests_email ON sprint_requests(email);
