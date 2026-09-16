"use client";

import { Command } from "@/components/terminal";
import { endpoints, originOf } from "@/lib/endpoints";
import { useCopy, useDocumentTitle } from "@/lib/i18n";

export default function DocsPage() {
  const { t } = useCopy();
  useDocumentTitle(t.docs.title);

  return (
    <>
      <div className="edge py-16 md:py-18">
        <Command>{t.docs.command}</Command>
        <h1 className="mb-5 font-display text-[clamp(30px,5.2vw,52px)] leading-[1.05] font-extrabold tracking-[-0.04em]">
          {t.docs.h1}
        </h1>
        <p className="max-w-[68ch] text-[15.5px] text-fg-dim">{t.docs.lede}</p>
      </div>

      <section className="edge border-t border-hairline py-14">
        <h2 className="mb-3.5 font-display text-[clamp(22px,3vw,30px)] leading-[1.15] font-extrabold tracking-[-0.03em]">
          {t.docs.commonH2}
        </h2>
        <dl className="mt-6 border-t border-hairline-soft">
          {t.docs.rows.map((row) => (
            <div
              key={row.term}
              className="grid gap-1.5 border-b border-hairline-soft py-4 md:grid-cols-[210px_1fr] md:gap-6"
            >
              <dt className="font-mono text-[13.5px] text-fg">{row.term}</dt>
              <dd className="m-0 text-[14.5px] text-fg-dim">{row.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="edge border-t border-hairline py-14">
        <h2 className="mb-3.5 font-display text-[clamp(22px,3vw,30px)] leading-[1.15] font-extrabold tracking-[-0.03em]">
          {t.docs.epH2}
        </h2>

        <div className="mt-7 grid gap-4.5 md:grid-cols-2">
          {endpoints.map((endpoint) => {
            const copy = t.docs.endpoints[endpoint.id];
            const live = endpoint.state === "live";
            return (
              <article
                key={endpoint.id}
                id={endpoint.id}
                className="rounded-[10px] border border-hairline bg-surface-2 p-5.5"
              >
                <div className="mb-3 flex items-baseline justify-between gap-3.5">
                  <h3 className="font-mono text-[15px] font-semibold tracking-tight">
                    {endpoint.host}
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] tracking-[0.1em] whitespace-nowrap uppercase ${
                      live
                        ? "border border-fg/25 text-fg"
                        : "border border-accent/45 text-accent"
                    }`}
                  >
                    {live ? t.common.stateLive : t.common.stateSoon}
                  </span>
                </div>

                <p className="text-sm text-fg-dim">{copy.desc}</p>

                <p className="mt-2.5 font-mono text-[13px] text-fg-dim">
                  <span className="text-fg">
                    {endpoint.method} {endpoint.path}
                  </span>{" "}
                  → {endpoint.contentType}
                </p>

                <p className="mt-2.5 text-sm text-fg-dim">
                  <span className="font-medium text-fg">{t.docs.params}</span>:{" "}
                  {copy.params}
                </p>

                {live ? (
                  <a
                    className="mt-3 inline-block font-mono text-[11px] tracking-[0.08em] text-fg-faint uppercase transition-colors hover:text-fg"
                    href={`${originOf(endpoint)}/`}
                  >
                    {t.docs.endpointDocs}
                  </a>
                ) : (
                  <p className="mt-3 font-mono text-[11px] tracking-[0.08em] text-fg-faint uppercase">
                    {t.docs.notLive}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="edge border-t border-hairline py-14">
        <h2 className="mb-3.5 font-display text-[clamp(22px,3vw,30px)] leading-[1.15] font-extrabold tracking-[-0.03em]">
          {t.docs.exampleH2}
        </h2>

        <pre className="mb-5 overflow-x-auto rounded-[10px] border border-hairline bg-surface-2 px-5 py-4.5 font-mono text-[13px] leading-[1.8] text-fg-dim">
          <span className="text-fg-faint"># an avatar, pinned to a seed</span>
          {"\ncurl "}
          <span className="text-fg">
            &quot;https://avatar.waldrand.dev/ada.svg?size=96&quot;
          </span>
          {"\n\n"}
          <span className="text-fg-faint">
            # a 1200x630 placeholder with a label
          </span>
          {"\ncurl "}
          <span className="text-fg">
            &quot;https://image.waldrand.dev/1200x630?text=og&amp;grid=on&quot;
          </span>
          {" -o og.webp\n\n"}
          <span className="text-fg-faint"># five colours off a seed</span>
          {"\ncurl "}
          <span className="text-fg">
            &quot;https://color.waldrand.dev/palette?seed=waldrand&amp;count=5&quot;
          </span>
        </pre>

        <pre className="overflow-x-auto rounded-[10px] border border-hairline bg-surface-2 px-5 py-4.5 font-mono text-[13px] leading-[1.8] text-fg-dim">
          {"{\n  "}
          <span className="text-accent">&quot;seed&quot;</span>
          {": "}
          <span className="text-fg">&quot;waldrand&quot;</span>
          {",\n  "}
          <span className="text-accent">&quot;mode&quot;</span>
          {": "}
          <span className="text-fg">&quot;analogous&quot;</span>
          {",\n  "}
          <span className="text-accent">&quot;colors&quot;</span>
          {": ["}
          <span className="text-fg">
            &quot;#12100E&quot;, &quot;#2A251E&quot;, &quot;#A8A196&quot;,
            &quot;#EFECE4&quot;, &quot;#E8552F&quot;
          </span>
          {"]\n}"}
        </pre>
      </section>
    </>
  );
}
