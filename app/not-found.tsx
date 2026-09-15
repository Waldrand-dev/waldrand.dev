"use client";

import Link from "next/link";

import { Command } from "@/components/terminal";
import { useCopy, useDocumentTitle } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useCopy();
  useDocumentTitle(t.notFound.title);

  return (
    <div className="edge py-16 md:py-18">
      <Command>
        waldrand get <span className="text-accent">404</span>
      </Command>

      <h1 className="mb-5 font-display text-[clamp(30px,5.4vw,52px)] leading-[1.04] font-extrabold tracking-[-0.04em]">
        {t.notFound.h1}
      </h1>
      <p className="max-w-[62ch] text-[15.5px] text-fg-dim">{t.notFound.lede}</p>

      <p className="mt-6">
        <Link
          href="/"
          className="border-b border-accent pb-0.5 font-mono text-[13.5px] text-fg transition-colors hover:text-accent"
        >
          {t.notFound.cta}
        </Link>
      </p>
    </div>
  );
}
