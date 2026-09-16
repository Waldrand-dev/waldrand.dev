CREATE TABLE IF NOT EXISTS endpoint_checks (
  endpoint_id TEXT PRIMARY KEY NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('operational', 'degraded', 'offline')),
  http_status INTEGER,
  response_ms INTEGER NOT NULL,
  checked_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS endpoint_check_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  endpoint_id TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('operational', 'degraded', 'offline')),
  http_status INTEGER,
  response_ms INTEGER NOT NULL,
  checked_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS endpoint_check_history_checked_at
  ON endpoint_check_history (checked_at);