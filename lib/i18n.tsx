"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { copy, isLang, type Copy, type Lang } from "@/lib/dict";

const STORE_KEY = "wr-lang";

/* ------------------------------------------------------------------ store */

/**
 * The language lives in a tiny external store rather than in state seeded by
 * an effect. The server snapshot is always English — which is what gets
 * prerendered — and the client snapshot is the reader's actual preference, so
 * hydration matches and React swaps the copy in one pass.
 */

let cached: Lang | null = null;
const listeners = new Set<() => void>();

const detect = (): Lang => {
  const fromQuery = new URLSearchParams(window.location.search).get("lang");
  if (isLang(fromQuery)) return fromQuery;

  try {
    const remembered = localStorage.getItem(STORE_KEY);
    if (isLang(remembered)) return remembered;
  } catch {
    /* storage blocked — fall through to the browser's preference */
  }

  const preferred = navigator.languages?.[0] ?? navigator.language ?? "en";
  return preferred.toLowerCase().startsWith("de") ? "de" : "en";
};

const subscribe = (onChange: () => void): (() => void) => {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
};

const clientSnapshot = (): Lang => (cached ??= detect());
const serverSnapshot = (): Lang => "en";

const setLanguage = (next: Lang): void => {
  cached = next;
  try {
    localStorage.setItem(STORE_KEY, next);
  } catch {
    /* storage blocked — the choice just does not outlive the tab */
  }
  for (const listener of listeners) listener();
};

/* ---------------------------------------------------------------- context */

interface LanguageValue {
  readonly lang: Lang;
  /** The copy for the active language. */
  readonly t: Copy;
  readonly toggle: () => void;
}

const LanguageContext = createContext<LanguageValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = useCallback(() => {
    setLanguage(clientSnapshot() === "en" ? "de" : "en");
  }, []);

  const value = useMemo<LanguageValue>(
    () => ({ lang, t: copy[lang], toggle }),
    [lang, toggle],
  );

  return <LanguageContext value={value}>{children}</LanguageContext>;
}

export function useCopy(): LanguageValue {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useCopy must be used inside <LanguageProvider>");
  return value;
}

/** Keeps the tab title in the language the reader picked. */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

/**
 * False while prerendering and on the hydration pass, true afterwards — for
 * the few things that must not exist unless scripts are running.
 */
const noopSubscribe = () => () => {};

export const useIsClient = (): boolean =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
