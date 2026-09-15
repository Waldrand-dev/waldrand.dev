"use client";

import { useEffect, useState } from "react";

import { Mark } from "@/components/mark";
import { useCopy, useIsClient } from "@/lib/i18n";

const MIN_MS = 420; // long enough for the sweep to read as intentional
const MAX_MS = 2200; // never hold the page hostage to a slow webfont

/**
 * Covers the first paint with the brand's loading mark and leaves once the
 * fonts are ready, so the Archivo headline never swaps in mid-read.
 *
 * It only ever renders after mount, which means a reader without JavaScript
 * never meets a curtain nothing will lift.
 */
export function BootCurtain() {
  const { t } = useCopy();
  const mounted = useIsClient();
  const [gone, setGone] = useState(false);
  const [lifting, setLifting] = useState(false);

  useEffect(() => {
    const started = performance.now();
    let timer: number;

    const lift = () => {
      const wait = Math.max(0, MIN_MS - (performance.now() - started));
      timer = window.setTimeout(() => {
        setLifting(true);
        timer = window.setTimeout(() => setGone(true), 350);
      }, wait);
    };

    const fonts: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();
    const deadline = new Promise<void>((resolve) => {
      window.setTimeout(resolve, MAX_MS);
    });

    void Promise.race([fonts, deadline]).then(lift, lift);
    return () => window.clearTimeout(timer);
  }, []);

  if (!mounted || gone) return null;

  return (
    <div
      aria-live="polite"
      className={`fixed inset-0 z-50 grid place-items-center gap-4 bg-surface transition-opacity duration-300 ${
        lifting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <Mark loading className="h-14 w-14" />
      <span className="font-mono text-xs tracking-[0.18em] text-fg-faint uppercase">
        {t.common.loading}
      </span>
    </div>
  );
}
