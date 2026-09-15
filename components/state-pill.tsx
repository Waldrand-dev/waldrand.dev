"use client";

import type { EndpointState } from "@/lib/endpoints";
import { useCopy } from "@/lib/i18n";

/** A filled dot means it answers; a ring means it does not answer yet. */
export function StatePill({ state }: { state: EndpointState }) {
  const { t } = useCopy();
  const live = state === "live";

  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap ${
        live ? "text-fg" : "text-fg-faint"
      }`}
    >
      <span
        aria-hidden
        className={`size-1.5 shrink-0 rounded-full ${
          live ? "bg-current" : "ring-1 ring-current ring-inset"
        }`}
      />
      {live ? t.common.stateLive : t.common.stateSoon}
    </span>
  );
}
