"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Mark } from "@/components/mark";
import { useCopy } from "@/lib/i18n";

const NAV = [
  { href: "/", key: "navApis" },
  { href: "/docs", key: "navDocs" },
  { href: "/status", key: "navStatus" },
] as const;

const normalise = (path: string) => path.replace(/\/+$/, "") || "/";

export function Masthead() {
  const { lang, t, toggle } = useCopy();
  const here = normalise(usePathname());

  return (
    <header className="edge sticky top-0 z-10 flex items-center justify-between gap-5 border-b border-hairline bg-surface/85 py-3.5 backdrop-blur-md backdrop-saturate-150">
      <Link
        href="/"
        className="inline-flex items-center gap-3 font-mono text-[14.5px] tracking-tight whitespace-nowrap"
      >
        <Mark className="h-[26px] w-[26px] rounded-md" />
        <span className="font-semibold text-fg">waldrand.dev</span>
        <span className="hidden text-fg-faint sm:inline">{t.common.brandSub}</span>
      </Link>

      <nav className="flex items-center gap-1 font-mono text-[13.5px]">
        {NAV.map((item) => {
          const active = normalise(item.href) === here;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-md px-2.5 py-1 transition-colors hover:bg-surface-3 hover:text-fg ${
                active ? "font-medium text-fg" : "text-fg-faint"
              }`}
            >
              {t.common[item.key]}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={toggle}
          aria-label={t.common.langLabel}
          className="cursor-pointer rounded-md px-2.5 py-1 text-fg-faint transition-colors hover:bg-surface-3 hover:text-fg"
        >
          [<span className={lang === "en" ? "text-fg" : undefined}>en</span>/
          <span className={lang === "de" ? "text-fg" : undefined}>de</span>]
        </button>
      </nav>
    </header>
  );
}
