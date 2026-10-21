-- Apply once: wrangler d1 execute zyvibe_leads --remote --file=./migrations/0001_bookings.sql
CREATE TABLE IF NOT EXISTS bookings (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  company     TEXT    NOT NULL,
  building    TEXT    NOT NULL,
  existing    TEXT    NOT NULL,
  user_agent  TEXT    NOT NULL DEFAULT '',
  status      TEXT    NOT NULL DEFAULT 'new',
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
