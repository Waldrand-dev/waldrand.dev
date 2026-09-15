/**
 * Page behaviour: language switching, the boot curtain and nav state.
 * Everything here is an enhancement — the page is complete without it.
 */

import { dictionaries, isLang, type Lang } from "./i18n";

const STORE_KEY = "wr-lang";
const TRANSLATED_ATTRS = ["title", "aria-label", "content"] as const;

/* ---------- storage, guarded for private mode ---------- */

const readStore = (): string | null => {
  try {
    return localStorage.getItem(STORE_KEY);
  } catch {
    return null;
  }
};

const writeStore = (lang: Lang): void => {
  try {
    localStorage.setItem(STORE_KEY, lang);
  } catch {
    /* storage blocked — the choice just does not survive the tab */
  }
};

const initialLang = (): Lang => {
  const fromQuery = new URLSearchParams(location.search).get("lang");
  if (isLang(fromQuery)) return fromQuery;

  const remembered = readStore();
  if (isLang(remembered)) return remembered;

  const preferred = navigator.languages?.[0] ?? navigator.language ?? "en";
  return preferred.toLowerCase().startsWith("de") ? "de" : "en";
};

/* ---------- translation ---------- */

/**
 * The English copy is the markup itself, so it gets cached on the element the
 * first time it is replaced and restored verbatim on the way back.
 */
const original = (el: HTMLElement, attr?: string): string => {
  const key = attr ? `en${attr.replace(/-./g, (m) => m[1]!.toUpperCase())}` : "en";
  const cached = el.dataset[key];
  if (cached !== undefined) return cached;

  const value = attr ? (el.getAttribute(attr) ?? "") : el.innerHTML;
  el.dataset[key] = value;
  return value;
};

const applyLanguage = (lang: Lang): void => {
  const dict = dictionaries[lang];

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const source = original(el);
    const key = el.dataset.i18n;
    el.innerHTML = (key && dict[key]) ?? source;
  });

  for (const attr of TRANSLATED_ATTRS) {
    document
      .querySelectorAll<HTMLElement>(`[data-i18n-${attr}]`)
      .forEach((el) => {
        const source = original(el, attr);
        const key = el.getAttribute(`data-i18n-${attr}`);
        el.setAttribute(attr, (key && dict[key]) ?? source);
      });
  }

  const titleKey = document.body.dataset.titleKey;
  if (titleKey) {
    document.body.dataset.enTitle ??= document.title;
    document.title = dict[titleKey] ?? document.body.dataset.enTitle!;
  }

  document.documentElement.lang = lang;
  document.documentElement.dataset.lang = lang;

  document
    .querySelectorAll<HTMLElement>("[data-lang-option]")
    .forEach((el) => el.toggleAttribute("data-lang-active", el.dataset.langOption === lang));

  const toggle = document.querySelector<HTMLButtonElement>("[data-lang-toggle]");
  toggle?.setAttribute("aria-label", lang === "en" ? "Sprache auf Deutsch umstellen" : "Switch language to English");
};

let current = initialLang();
applyLanguage(current);

document.querySelector<HTMLButtonElement>("[data-lang-toggle]")?.addEventListener("click", () => {
  current = current === "en" ? "de" : "en";
  writeStore(current);
  applyLanguage(current);
});

/* ---------- nav state ---------- */

const normalise = (pathname: string): string =>
  pathname.replace(/index\.html$/, "").replace(/\/$/, "") || "/";

const here = normalise(location.pathname);
document.querySelectorAll<HTMLAnchorElement>(".nav a[href]").forEach((a) => {
  if (normalise(new URL(a.href).pathname) === here) a.setAttribute("aria-current", "page");
});

/* ---------- boot curtain ---------- */

const boot = document.querySelector<HTMLElement>(".boot");
if (boot) {
  const started = performance.now();
  const MIN_MS = 420; // long enough for the sweep to read as intentional
  const MAX_MS = 2200; // never hold the page hostage to a slow webfont

  const lift = (): void => {
    const wait = Math.max(0, MIN_MS - (performance.now() - started));
    window.setTimeout(() => {
      boot.hidden = true;
      delete document.documentElement.dataset.booting;
    }, wait);
  };

  const fontsReady: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();
  const deadline = new Promise<void>((resolve) => window.setTimeout(resolve, MAX_MS));

  void Promise.race([fontsReady, deadline]).then(lift, lift);
}
