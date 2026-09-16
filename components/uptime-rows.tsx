"use client";

import { endpoints, type Endpoint } from "@/lib/endpoints";
import { useCopy } from "@/lib/i18n";
import type { MonitorState, StatusResponse } from "@/lib/status";

/** One slot per hour, covering the 48-hour history returned by the monitor. */
const SLOTS = 48;
const SLOT_MS = 60 * 60 * 1000;

const statePriority: Record<MonitorState, number> = {
  operational: 1,
  degraded: 2,
  offline: 3,
};

function slotState(
  endpointId: string,
  slot: number,
  history: StatusResponse["history"],
): MonitorState | null {
  const start = Date.now() - (SLOTS - slot) * SLOT_MS;
  const end = start + SLOT_MS;
  const states = history
    .filter(
      (point) =>
        point.endpointId === endpointId &&
        Date.parse(point.checkedAt) >= start &&
        Date.parse(point.checkedAt) < end,
    )
    .map((point) => point.state);

  return states.reduce<MonitorState | null>(
    (worst, state) =>
      !worst || statePriority[state] > statePriority[worst] ? state : worst,
    null,
  );
}

const MINUTE_MS = 60 * 1000;

/**
 * Share of monitored minutes in the window that were operational. Each minute
 * with at least one check counts once, at its worst state; minutes with no
 * check are left out rather than guessed.
 */
function uptimePercent(
  endpointId: string,
  history: StatusResponse["history"],
): number | null {
  const minutes = new Map<number, MonitorState>();
  for (const point of history) {
    if (point.endpointId !== endpointId) continue;
    const minute = Math.floor(Date.parse(point.checkedAt) / MINUTE_MS);
    const previous = minutes.get(minute);
    if (!previous || statePriority[point.state] > statePriority[previous]) {
      minutes.set(minute, point.state);
    }
  }
  if (minutes.size === 0) return null;

  let up = 0;
  for (const state of minutes.values()) if (state === "operational") up++;
  return (up / minutes.size) * 100;
}

function UptimeRow({ endpoint, status }: { endpoint: Endpoint; status: StatusResponse | null }) {
  const { lang, t } = useCopy();
  const live = endpoint.state === "live";
  const latest = status?.latest.find((item) => item.endpointId === endpoint.id);
  const stateLabel = !live
    ? t.status.statePlanned
    : latest?.state === "operational"
      ? t.status.stateOperational
      : latest?.state === "degraded"
        ? t.status.stateDegraded
        : latest?.state === "offline"
          ? t.status.stateOffline
          : t.status.stateChecking;
  const uptime = live && status ? uptimePercent(endpoint.id, status.history) : null;
  const stateClass =
    latest?.state === "offline" || latest?.state === "degraded"
      ? "border-accent/45 text-accent"
      : live
        ? "border-hairline text-fg-faint"
        : "border-accent/45 text-accent";

  return (
    <article
      id={`status-${endpoint.id}`}
      className="rounded-[10px] border border-hairline bg-surface-2 px-5.5 py-5"
    >
      <div className="mb-3.5 flex items-baseline justify-between gap-3.5">
        <h3 className="font-mono text-[15px] font-semibold tracking-tight">
          {endpoint.host}
        </h3>
        <span
          className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-[0.1em] whitespace-nowrap uppercase ${stateClass}`}
        >
          {stateLabel}
        </span>
      </div>

      <div
        role="img"
        aria-label={live ? "Uptime, last 48 hours" : t.status.uptimeLabel}
        className="mb-2.5 flex gap-0.5"
      >
        {Array.from({ length: SLOTS }, (_, i) => (
          (() => {
            const state = live && status ? slotState(endpoint.id, i, status.history) : null;
            return (
              <span
                key={i}
                className={`h-6.5 min-w-0 flex-1 rounded-[2px] border border-hairline ${
                  state === "operational"
                    ? "bg-[#3d6b4b]"
                    : state === "degraded" || state === "offline"
                      ? "bg-accent"
                      : "bg-surface-3 wr-pending"
                }`}
              />
            );
          })()
        ))}
      </div>

      <div className="flex justify-between gap-3 font-mono text-[11.5px] text-fg-faint">
        <span>{t.status.legendPast}</span>
        {uptime !== null ? (
          <span className="text-fg-dim">
            {t.status.uptime(
              `${uptime.toLocaleString(lang, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}%`,
            )}
          </span>
        ) : (
          <span className="text-accent">{live && status ? "" : t.status.noData}</span>
        )}
        <span>{t.status.legendToday}</span>
      </div>
    </article>
  );
}

export function UptimeRows({ status }: { status: StatusResponse | null }) {
  return (
    <div className="mt-6 grid gap-3.5">
      {endpoints.map((endpoint) => (
        <UptimeRow key={endpoint.id} endpoint={endpoint} status={status} />
      ))}
    </div>
  );
}
