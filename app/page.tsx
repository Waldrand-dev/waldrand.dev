"use client";

import { AvatarPlayground } from "@/components/avatar-playground";
import { EndpointsTable } from "@/components/endpoints-table";
import { Command, Output } from "@/components/terminal";
import { useCopy, useDocumentTitle } from "@/lib/i18n";
import { GITHUB_REPO } from "@/lib/paths";

export default function ApiSurfacePage() {
  const { t } = useCopy();
  useDocumentTitle(t.index.title);

  return (
    <div className="edge py-16 md:py-18">
      <Command>{t.index.command}</Command>

      <section>
        <h1 className="mb-5 font-display text-[clamp(34px,6.4vw,60px)] leading-[1.02] font-extrabold tracking-[-0.045em]">
          {t.index.h1}
        </h1>
        <p className="max-w-[62ch] text-[15.5px] text-fg-dim">{t.index.lede}</p>
        <p className="mt-3 max-w-[62ch] text-[15.5px] text-fg-dim">
          {t.index.buildNote}
        </p>
      </section>

      <EndpointsTable />

      <AvatarPlayground />

      <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
        <section>
          <Command>curl -I https://avatar.waldrand.dev/ada.svg</Command>
          <Output>
            {"HTTP/2 "}
            <b>200</b>
            {"\nx-ratelimit-limit: "}
            <b>60</b>
            {"\nx-ratelimit-remaining: "}
            <b>239</b>
            {"\ncache-control: "}
            <b>public, max-age=2592000, immutable</b>
          </Output>
          <p className="mt-3.5 font-mono text-[13.5px] text-fg-faint">
            {t.index.curlNote}
          </p>
        </section>

        <div className="max-w-[34ch] justify-self-start lg:justify-self-end lg:text-right">
          <div className="mb-4 h-0.5 w-18 bg-accent lg:w-full" />
          <p className="mb-1.5 font-mono text-[13.5px] text-fg-faint">
            {t.index.pitchLine}
          </p>
          <a
            href={`${GITHUB_REPO}/issues/new`}
            className="border-b border-accent pb-0.5 font-mono text-[13.5px] text-fg transition-colors hover:text-accent"
          >
            {t.index.pitchCta}
          </a>
        </div>
      </div>
    </div>
  );
}
