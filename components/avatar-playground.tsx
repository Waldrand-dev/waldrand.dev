"use client";

import { useEffect, useState } from "react";

import { Command } from "@/components/terminal";
import { endpoints, originOf } from "@/lib/endpoints";
import { useCopy } from "@/lib/i18n";

const avatar = endpoints.find((e) => e.id === "avatar")!;
const SIZE = 96;
const FALLBACK_SEED = "waldrand";

/**
 * Every settled keystroke is a real request against the live API, so input is
 * debounced just enough that typing a word costs one render, not one per
 * letter. The seed always gets an explicit `.svg`, so a seed like `v1.png`
 * stays a seed rather than being read as a format.
 */
const DEBOUNCE_MS = 180;

const urlFor = (seed: string) =>
  `${originOf(avatar)}/${encodeURIComponent(seed)}.svg?size=${SIZE}`;

export function AvatarPlayground() {
  const { t } = useCopy();
  const [seed, setSeed] = useState("ada");
  const [shown, setShown] = useState("ada");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShown(seed.trim() || FALLBACK_SEED), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [seed]);

  const src = urlFor(shown);
  const snippet = `<img src="${src}" width="${SIZE}" height="${SIZE}" alt="">`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked — the snippet is still selectable */
    }
  };

  return (
    <section className="mb-14">
      <Command>{t.index.playCommand}</Command>

      <div className="flex flex-col gap-5 rounded-[10px] border border-hairline bg-surface-2 p-4.5 sm:flex-row sm:items-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- a remote SVG the API renders; nothing to optimise */}
        <img
          src={src}
          width={SIZE}
          height={SIZE}
          alt={`${t.index.playAlt} ${shown}`}
          className="size-24 shrink-0 rounded-md border border-hairline bg-surface-3"
        />

        <div className="min-w-0 flex-1 font-mono text-[13.5px]">
          <label className="flex items-center gap-2.5 border-b border-hairline pb-2.5 focus-within:border-accent">
            <span className="text-accent">{t.index.playLabel} ›</span>
            <input
              value={seed}
              onChange={(event) => setSeed(event.target.value)}
              placeholder={t.index.playPlaceholder}
              maxLength={64}
              spellCheck={false}
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent text-fg caret-accent outline-none placeholder:text-fg-faint"
            />
          </label>

          <div className="mt-3 flex items-start gap-3">
            <code className="min-w-0 flex-1 break-all text-fg-dim select-all">{snippet}</code>
            <button
              type="button"
              onClick={copy}
              className="shrink-0 text-[11px] tracking-[0.1em] text-fg-faint uppercase transition-colors hover:text-accent"
            >
              {copied ? t.index.playCopied : t.index.playCopy}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
