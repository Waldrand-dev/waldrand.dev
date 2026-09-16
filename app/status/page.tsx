"use client";

import { useEffect, useState } from "react";

import { Command } from "@/components/terminal";
import { UptimeRows } from "@/components/uptime-rows";
import { useCopy, useDocumentTitle } from "@/lib/i18n";
import type { StatusResponse } from "@/lib/status";

export default function StatusPage() {
  const { t } = useCopy();
  const [status, setStatus] = useState<StatusResponse | null>(null);
  useDocumentTitle(t.status.title);

  useEffect(() => {
    const load = () =>
      fetch("/api/status", { cache: "no-store" })
        .then((response) => (response.ok ? response.json() : Promise.reject()))
        .then((value: StatusResponse) => setStatus(value))
        .catch(() => {});
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, []);

  const liveStates = status?.latest ?? [];
  const overallState = liveStates.some((item) => item.state === "offline")
    ? t.status.overallOffline
    : liveStates.some((item) => item.state === "degraded")
      ? t.status.overallDegraded
      : liveStates.length > 0
        ? t.status.overallOperational
        : t.status.stateChecking;

  return (
    <>
      <div className="edge py-16 md:py-18">
        <Command>{t.status.command}</Command>
        <h1 className="mb-5 font-display text-[clamp(30px,5.2vw,52px)] leading-[1.05] font-extrabold tracking-[-0.04em]">
          {t.status.h1}
        </h1>
        <p className="max-w-[68ch] text-[15.5px] text-fg-dim">{t.status.lede}</p>
      </div>

      <section className="edge border-t border-hairline py-14">
        <p className="mb-9 flex flex-wrap items-center gap-3.5 font-mono text-sm text-fg-dim">
          <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-accent" />
          <span>{overallState}</span>
          <span aria-hidden className="text-hairline">
            ·
          </span>
          <span>{t.status.endpointCount}</span>
        </p>

        <h2 className="mb-3.5 font-display text-[clamp(22px,3vw,30px)] leading-[1.15] font-extrabold tracking-[-0.03em]">
          {t.status.h2}
        </h2>

        <UptimeRows status={status} />

        <p className="mt-8 max-w-[68ch] text-[14.5px] text-fg-dim">
          {t.status.foot}
        </p>
      </section>
    </>
  );
}
