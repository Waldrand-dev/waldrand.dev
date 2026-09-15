"use client";

import { StatePill } from "@/components/state-pill";
import { endpoints } from "@/lib/endpoints";
import { useCopy } from "@/lib/i18n";

/** Dims the `{seed}` parts of a path so the literal segments read first. */
const renderPath = (path: string) =>
  path.split(/(\{\w+\})/).map((part, i) =>
    part.startsWith("{") ? (
      <span key={i} className="text-fg-faint">
        {part}
      </span>
    ) : (
      part
    ),
  );

export function EndpointsTable() {
  const { t } = useCopy();

  const head =
    "bg-surface-2 border-b border-hairline px-4.5 py-3.5 text-left text-[11px] font-normal tracking-[0.14em] whitespace-nowrap text-fg-faint uppercase";

  return (
    <div className="my-11 overflow-x-auto rounded-[10px] border border-hairline">
      <table className="w-full min-w-[720px] border-collapse font-mono text-[13.5px]">
        <thead>
          <tr>
            <th className={head}>{t.index.thMethod}</th>
            <th className={head}>{t.index.thPath}</th>
            <th className={head}>{t.index.thType}</th>
            <th className={head}>{t.index.thP50}</th>
            <th className={head}>{t.index.thState}</th>
          </tr>
        </thead>
        <tbody>
          {endpoints.map((endpoint) => {
            const live = endpoint.state === "live";
            return (
              <tr
                key={endpoint.id}
                id={`ep-${endpoint.id}`}
                className="border-b border-hairline-soft transition-colors last:border-b-0 hover:bg-surface-2"
              >
                <td
                  className={`px-4.5 py-4.5 ${live ? "font-medium text-accent" : "text-fg-faint"}`}
                >
                  {endpoint.method}
                </td>
                <td className={`px-4.5 py-4.5 ${live ? "text-fg" : "text-fg-faint"}`}>
                  {endpoint.host}
                  {renderPath(endpoint.path)}
                </td>
                <td className="px-4.5 py-4.5 text-fg-dim">{endpoint.contentType}</td>
                <td className="px-4.5 py-4.5 text-fg-dim">
                  {endpoint.p50 === null ? "—" : `${endpoint.p50}ms`}
                </td>
                <td className="px-4.5 py-4.5">
                  <StatePill state={endpoint.state} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
