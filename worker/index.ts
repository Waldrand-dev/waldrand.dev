import { endpoints, originOf } from "../lib/endpoints";
import type { MonitorState, StatusResponse } from "../lib/status";

interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  all<T>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}

interface D1Database {
  prepare(query: string): D1Statement;
}

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  DB: D1Database;
}

interface ScheduledController {
  scheduledTime: number;
}

interface LatestRow {
  endpoint_id: string;
  state: MonitorState;
  http_status: number | null;
  checked_at: string;
}

interface HistoryRow {
  endpoint_id: string;
  state: MonitorState;
  checked_at: string;
}

const CHECK_TIMEOUT_MS = 10_000;
/** Older than this, `/api/status` runs a check itself instead of trusting the cron. */
const STALE_AFTER_MS = 2 * 60 * 1000;

function classifyResponse(status: number): MonitorState {
  if (status >= 200 && status < 300) return "operational";
  if (status === 429 || status >= 500) return "degraded";
  return "offline";
}

async function checkEndpoint(endpoint: (typeof endpoints)[number]) {
  const started = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);
  let state: MonitorState = "offline";
  let httpStatus: number | null = null;

  try {
    const response = await fetch(`${originOf(endpoint)}${endpoint.checkPath}`, {
      headers: { "user-agent": "waldrand-status-monitor/1.0" },
      signal: controller.signal,
    });
    httpStatus = response.status;
    state = classifyResponse(response.status);
  } catch {
    state = "offline";
  } finally {
    clearTimeout(timeout);
  }

  return {
    endpointId: endpoint.id,
    state,
    httpStatus,
    checkedAt: new Date().toISOString(),
    responseMs: Math.round(performance.now() - started),
  };
}

async function checkLiveEndpoints(env: Env) {
  const liveEndpoints = endpoints.filter((endpoint) => endpoint.state === "live");
  const results = await Promise.all(liveEndpoints.map(checkEndpoint));

  for (const result of results) {
    await env.DB.prepare(
      `INSERT INTO endpoint_checks
        (endpoint_id, state, http_status, response_ms, checked_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(endpoint_id) DO UPDATE SET
         state = excluded.state,
         http_status = excluded.http_status,
         response_ms = excluded.response_ms,
         checked_at = excluded.checked_at`,
    )
      .bind(
        result.endpointId,
        result.state,
        result.httpStatus,
        result.responseMs,
        result.checkedAt,
      )
      .run();

    await env.DB.prepare(
      `INSERT INTO endpoint_check_history
        (endpoint_id, state, http_status, response_ms, checked_at)
       VALUES (?, ?, ?, ?, ?)`,
    )
      .bind(
        result.endpointId,
        result.state,
        result.httpStatus,
        result.responseMs,
        result.checkedAt,
      )
      .run();
  }

  await env.DB.prepare(
    "DELETE FROM endpoint_check_history WHERE checked_at < datetime('now', '-48 hours')",
  ).run();
}

async function readStatus(env: Env): Promise<StatusResponse> {
  const [latestRows, historyRows] = await Promise.all([
    env.DB.prepare(
      "SELECT endpoint_id, state, http_status, checked_at FROM endpoint_checks ORDER BY endpoint_id",
    ).all<LatestRow>(),
    env.DB.prepare(
      "SELECT endpoint_id, state, checked_at FROM endpoint_check_history WHERE checked_at >= datetime('now', '-48 hours') ORDER BY checked_at",
    ).all<HistoryRow>(),
  ]);

  const body: StatusResponse = {
    checkedAt: latestRows.results.reduce(
      (latest, row) => (row.checked_at > (latest ?? "") ? row.checked_at : latest),
      null as string | null,
    ),
    latest: latestRows.results.map((row) => ({
      endpointId: row.endpoint_id,
      state: row.state,
      httpStatus: row.http_status,
      checkedAt: row.checked_at,
    })),
    history: historyRows.results.map((row) => ({
      endpointId: row.endpoint_id,
      state: row.state,
      checkedAt: row.checked_at,
    })),
  };

  return body;
}

async function statusResponse(env: Env) {
  let body = await readStatus(env);
  const lastCheck = body.checkedAt ? Date.parse(body.checkedAt) : 0;
  if (Date.now() - lastCheck > STALE_AFTER_MS) {
    await checkLiveEndpoints(env);
    body = await readStatus(env);
  }

  return new Response(JSON.stringify(body), {
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
    },
  });
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/status") {
      return statusResponse(env);
    }
    return env.ASSETS.fetch(request);
  },

  async scheduled(_controller: ScheduledController, env: Env) {
    await checkLiveEndpoints(env);
  },
};

export default worker;