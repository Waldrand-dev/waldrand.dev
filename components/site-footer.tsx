"use client";

import { GITHUB_REPO, asset } from "@/lib/paths";
import { useCopy } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useCopy();

  return (
    <footer className="edge mt-auto flex flex-wrap items-center justify-between gap-3.5 border-t border-hairline bg-surface-2 py-5 font-mono text-[12.5px] text-fg-faint">
      <span>{t.common.footBuilt}</span>
      <nav className="flex flex-wrap gap-4">
        <a className="transition-colors hover:text-fg" href={GITHUB_REPO}>
          {t.common.footSource}
        </a>
        <a className="transition-colors hover:text-fg" href={`${GITHUB_REPO}/issues`}>
          {t.common.footIssues}
        </a>
        <a className="transition-colors hover:text-fg" href={asset("/assets/logo/BRAND.md")}>
          {t.common.footBrand}
        </a>
      </nav>
    </footer>
  );
}
