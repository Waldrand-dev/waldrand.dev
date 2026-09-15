"use client";

import { endpoints, type Endpoint } from "@/lib/endpoints";
import { useCopy } from "@/lib/i18n";

/** One slot per day. Nothing is filled in until an endpoint actually answers. */
const SLOTS = 48;

function UptimeRow({ endpoint }: { endpoint: Endpoint }) {
  const { t } = useCopy();
  const live = endpoint.state === "live";

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
          className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-[0.1em] whitespace-nowrap uppercase ${
            live
              ? "border-hairline text-fg-faint"
              : "border-accent/45 text-accent"
          }`}
        >
          {live ? t.common.stateLive : t.common.stateSoon}
        </span>
      </div>

      <div
        role="img"
        aria-label={live ? "Uptime, last 48 days" : t.status.uptimeLabel}
        className="mb-2.5 flex gap-0.5"
      >
        {Array.from({ length: SLOTS }, (_, i) => (
          <span
            key={i}
            className={`h-6.5 min-w-0 flex-1 rounded-[2px] border border-hairline bg-surface-3 ${
              live ? "" : "wr-pending"
            }`}
          />
        ))}
      </div>

      <div className="flex justify-between gap-3 font-mono text-[11.5px] text-fg-faint">
        <span>{t.status.legendPast}</span>
        <span className="text-accent">{live ? "" : t.status.noData}</span>
        <span>{t.status.legendToday}</span>
      </div>
    </article>
  );
}

export function UptimeRows() {
  return (
    <div className="mt-6 grid gap-3.5">
      {endpoints.map((endpoint) => (
        <UptimeRow key={endpoint.id} endpoint={endpoint} />
      ))}
    </div>
  );
}
