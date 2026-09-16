import type { ReactNode } from "react";

import {
  endpoints,
  liveEndpoints,
  plannedEndpoints,
  type Endpoint,
} from "@/lib/endpoints";

export const LANGS = ["en", "de"] as const;
export type Lang = (typeof LANGS)[number];

export const isLang = (value: unknown): value is Lang =>
  typeof value === "string" && (LANGS as readonly string[]).includes(value);

/** Inline code, styled the same wherever a header or literal appears in prose. */
const C = ({ children }: { children: ReactNode }) => (
  <code className="rounded bg-surface-3 px-1.5 py-0.5 font-mono text-[0.92em] text-fg">
    {children}
  </code>
);

/** Hostnames in prose, joined the way each language joins a list. */
const hosts = (list: readonly Endpoint[], lang: Lang): ReactNode => {
  const parts = new Intl.ListFormat(lang, { type: "conjunction" }).formatToParts(
    list.map((e) => e.host),
  );
  return parts.map((part, i) =>
    part.type === "element" ? <C key={i}>{part.value}</C> : part.value,
  );
};

const total = endpoints.length;

const en = {
  common: {
    brandSub: "— api surface",
    navApis: "[apis]",
    navDocs: "[docs]",
    navStatus: "[status]",
    loading: "loading",
    stateSoon: "planned",
    stateLive: "online",
    footBuilt: "built at the forest edge",
    footSource: "source",
    footIssues: "issues",
    footBrand: "brand",
    langLabel: "Sprache auf Deutsch umstellen",
  },

  index: {
    title: "waldrand.dev — api surface",
    description:
      "Free, keyless GET endpoints: avatars today, with placeholder images, QR codes and colour palettes planned. No account, no token.",
    command: "waldrand ls --free",
    h1: `${total} endpoints. 0 keys. 0 €.`,
    lede: "Everything here is a GET away. Rate limiting is per IP at 60/min — no account to create, nothing to forget to rotate.",
    buildNote: (
      <>
        {liveEndpoints.length === 0
          ? "Nothing is live yet. "
          : <>{hosts(liveEndpoints, "en")} {liveEndpoints.length === 1 ? "is" : "are"} live now. </>}
        {plannedEndpoints.length === 0
          ? `All ${total} are live.`
          : <>{hosts(plannedEndpoints, "en")} {plannedEndpoints.length === 1 ? "is" : "are"} planned — the shape below is settled, the implementation follows.</>}
      </>
    ),
    thMethod: "Method",
    thPath: "Host / Path",
    thType: "Content-Type",
    thState: "State",
    curlNote: "Any string works as a seed, and the same seed always returns the same image — so the URL is all you store.",
    playCommand: "waldrand try avatar",
    playLabel: "Seed",
    playPlaceholder: "type anything",
    playCopy: "copy",
    playCopied: "copied",
    playAlt: "Avatar for",
    pitchLine: "Own a use case I haven't built?",
    pitchCta: "open an issue →",
  },

  docs: {
    title: "waldrand.dev — docs",
    description:
      "Request shapes, parameters and headers for the waldrand.dev endpoints.",
    command: "waldrand docs",
    h1: `${total} endpoints, one rule: GET and go.`,
    lede: "No auth, no SDKs, no sign-up. Every route answers a bare GET and caches. Planned endpoints are documented already because their shape is settled — the implementation is what's next.",
    commonH2: "Common behaviour",
    rows: [
      { term: "Authentication", body: <>None. There are no keys, no tokens, no account.</> },
      {
        term: "Rate limit",
        body: (
          <>
            60 requests per minute per IP, with bursts of up to 240 so a page
            full of avatars loads in one go. Only fresh renders count: a{" "}
            <C>304</C> or a response served from cache is free. Every response
            carries <C>x-ratelimit-limit</C> and <C>x-ratelimit-remaining</C>;
            going over returns 429 with <C>retry-after</C>.
          </>
        ),
      },
      {
        term: "Caching",
        body: (
          <>
            Deterministic routes send{" "}
            <C>cache-control: public, max-age=31536000, immutable</C>. Same URL,
            same bytes.
          </>
        ),
      },
      {
        term: "CORS",
        body: (
          <>
            <C>access-control-allow-origin: *</C> on every route. Usable straight
            from the browser.
          </>
        ),
      },
      {
        term: "Errors",
        body: (
          <>
            400 on invalid parameters, 404 on unknown routes, 429 at the limit.
            Error bodies are JSON, including on image routes.
          </>
        ),
      },
      {
        term: "Versioning",
        body: (
          <>
            A deterministic route&apos;s output never changes. If a rendering gets
            reworked it gets a new route rather than new bytes.
          </>
        ),
      },
    ],
    epH2: "Endpoints",
    params: "Parameters",
    exampleH2: "Example",
    notLive: "Not live yet — shape settled, implementation to follow.",
    endpointDocs: "Full reference ↗",
    endpoints: {
      avatar: {
        desc: "Returns a deterministic avatar for any seed. The same seed gives the same SVG forever — good for placeholder profile pictures, commit authors, seats in a demo.",
        params: (
          <>
            <C>size</C> (px, 16–512, default 128), <C>palette</C> (<C>forest</C> |{" "}
            <C>mono</C> | <C>ink</C>).
          </>
        ),
      },
      image: {
        desc: "A placeholder image at the requested dimensions, served as WebP. Meant for layout work, where lorem-ipsum images otherwise become half your load time.",
        params: (
          <>
            <C>bg</C>, <C>fg</C> (hex, no <C>#</C>), <C>text</C> (overlay label),{" "}
            <C>grid</C> (<C>on</C> | <C>off</C>).
          </>
        ),
      },
      qr: {
        desc: "Encodes the given data as a QR code and hands back vector — scalable, printable, no watermark.",
        params: (
          <>
            <C>ec</C> (<C>L</C> | <C>M</C> | <C>Q</C> | <C>H</C>, default{" "}
            <C>M</C>), <C>margin</C> (modules, default 2), <C>fg</C>, <C>bg</C>.
          </>
        ),
      },
      color: {
        desc: "Generates a colour palette as JSON. Deterministic on the seed, so the same brand gets the same colours twice.",
        params: (
          <>
            <C>seed</C>, <C>count</C> (2–12, default 5), <C>mode</C> (
            <C>analogous</C> | <C>triad</C> | <C>mono</C>).
          </>
        ),
      },
    } satisfies Record<Endpoint["id"], { desc: string; params: ReactNode }>,
  },

  status: {
    title: "waldrand.dev — status",
    description:
      "Operational status for the waldrand.dev endpoints, checked every minute.",
    command: "waldrand status",
    h1: "The edge is being watched.",
    lede: "Live endpoints are checked from the edge every minute. This page shows the latest result and the last 48 hours of checks.",
    line: "monitoring live endpoints",
    endpointCount: `${total} endpoints`,
    h2: "Endpoints",
    legendPast: "48 hours ago",
    legendToday: "today",
    noData: "awaiting first check",
    foot: "Live endpoints are checked once a minute and retained here for 48 hours. Planned endpoints are not probed until they go live.",
    uptimeLabel: "No uptime data yet",
    stateOperational: "operational",
    stateDegraded: "degraded",
    stateOffline: "offline",
    statePlanned: "planned",
    stateChecking: "checking",
    overallOperational: "all monitored systems operational",
    overallDegraded: "one or more systems degraded",
    overallOffline: "one or more systems offline",
  },

  notFound: {
    title: "waldrand.dev — 404",
    description: "No such route on waldrand.dev.",
    command: "waldrand get 404",
    h1: "No such route.",
    lede: "Nothing handles this address. Every endpoint, live and planned, is on the front page.",
    cta: "back to the api surface →",
  },
};

export type Copy = typeof en;

const de: Copy = {
  common: {
    brandSub: "— api-oberfläche",
    navApis: "[apis]",
    navDocs: "[docs]",
    navStatus: "[status]",
    loading: "lädt",
    stateSoon: "geplant",
    stateLive: "online",
    footBuilt: "gebaut am Waldrand",
    footSource: "Quelltext",
    footIssues: "Issues",
    footBrand: "Marke",
    langLabel: "Switch language to English",
  },

  index: {
    title: "waldrand.dev — API-Oberfläche",
    description:
      "Freie, schlüssellose GET-Endpoints: Avatare schon heute, Platzhalterbilder, QR-Codes und Farbpaletten geplant. Kein Account, kein Token.",
    command: "waldrand ls --free",
    h1: `${total} Endpoints. 0 Keys. 0 €.`,
    lede: "Alles hier ist ein GET entfernt. Rate-Limit pro IP bei 60/min — kein Account, den man anlegen, kein Schlüssel, den man rotieren muss.",
    buildNote: (
      <>
        {liveEndpoints.length === 0
          ? "Noch ist nichts live. "
          : <>{hosts(liveEndpoints, "de")} {liveEndpoints.length === 1 ? "ist" : "sind"} jetzt live. </>}
        {plannedEndpoints.length === 0
          ? `Alle ${total} sind live.`
          : <>{hosts(plannedEndpoints, "de")} {plannedEndpoints.length === 1 ? "ist" : "sind"} geplant — die Form unten steht, die Implementierung folgt.</>}
      </>
    ),
    thMethod: "Methode",
    thPath: "Host / Pfad",
    thType: "Content-Type",
    thState: "Status",
    curlNote: "Jeder String taugt als Seed, und derselbe Seed liefert immer dasselbe Bild — gespeichert wird nur die URL.",
    playCommand: "waldrand try avatar",
    playLabel: "Seed",
    playPlaceholder: "tippe irgendwas",
    playCopy: "kopieren",
    playCopied: "kopiert",
    playAlt: "Avatar für",
    pitchLine: "Ein Anwendungsfall, den ich noch nicht gebaut habe?",
    pitchCta: "Issue eröffnen →",
  },

  docs: {
    title: "waldrand.dev — Doku",
    description:
      "Anfrageform, Parameter und Header der Endpoints von waldrand.dev.",
    command: "waldrand docs",
    h1: `${total} Endpoints, eine Regel: GET und fertig.`,
    lede: "Keine Authentifizierung, keine SDKs, keine Registrierung. Jede Route antwortet auf ein blankes GET und lässt sich cachen. Geplante Endpoints sind schon dokumentiert, weil ihre Form feststeht — die Implementierung kommt als Nächstes.",
    commonH2: "Gemeinsames Verhalten",
    rows: [
      {
        term: "Authentifizierung",
        body: <>Keine. Es gibt keine Keys, keine Tokens, keinen Account.</>,
      },
      {
        term: "Rate-Limit",
        body: (
          <>
            60 Anfragen pro Minute und IP, mit Bursts bis 240, damit eine Seite
            voller Avatare in einem Rutsch lädt. Es zählen nur frische
            Renderings: ein <C>304</C> oder eine Antwort aus dem Cache ist frei.
            Jede Antwort trägt <C>x-ratelimit-limit</C> und{" "}
            <C>x-ratelimit-remaining</C>; bei Überschreitung kommt 429 mit{" "}
            <C>retry-after</C>.
          </>
        ),
      },
      {
        term: "Caching",
        body: (
          <>
            Deterministische Routen liefern{" "}
            <C>cache-control: public, max-age=31536000, immutable</C>. Gleiche
            URL, gleiche Bytes.
          </>
        ),
      },
      {
        term: "CORS",
        body: (
          <>
            <C>access-control-allow-origin: *</C> auf allen Routen. Direkt aus dem
            Browser nutzbar.
          </>
        ),
      },
      {
        term: "Fehler",
        body: (
          <>
            400 bei ungültigen Parametern, 404 bei unbekannten Routen, 429 beim
            Limit. Fehlerbodies sind JSON, auch auf Bild-Routen.
          </>
        ),
      },
      {
        term: "Versionierung",
        body: (
          <>
            Die Ausgabe einer deterministischen Route ändert sich nie. Wird ein
            Rendering überarbeitet, bekommt es eine neue Route statt neuer Bytes.
          </>
        ),
      },
    ],
    epH2: "Endpoints",
    params: "Parameter",
    exampleH2: "Beispiel",
    notLive: "Noch nicht live — Form steht, Implementierung folgt.",
    endpointDocs: "Volle Referenz ↗",
    endpoints: {
      avatar: {
        desc: "Gibt einen deterministischen Avatar für einen beliebigen Seed zurück. Derselbe Seed liefert für immer dasselbe SVG — geeignet für Platzhalter-Profilbilder, Commit-Autoren, Sitzplätze in Demos.",
        params: (
          <>
            <C>size</C> (px, 16–512, Standard 128), <C>palette</C> (<C>forest</C>{" "}
            | <C>mono</C> | <C>ink</C>).
          </>
        ),
      },
      image: {
        desc: "Platzhalterbild in den angeforderten Maßen, als WebP. Gedacht für Layout-Arbeit, in der Lorem-Ipsum-Bilder sonst zur Hälfte der Ladezeit werden.",
        params: (
          <>
            <C>bg</C>, <C>fg</C> (Hex, ohne <C>#</C>), <C>text</C> (Beschriftung),{" "}
            <C>grid</C> (<C>on</C> | <C>off</C>).
          </>
        ),
      },
      qr: {
        desc: "Kodiert die übergebenen Daten als QR-Code und liefert Vektor zurück — skalierbar, druckbar, ohne Wasserzeichen.",
        params: (
          <>
            <C>ec</C> (<C>L</C> | <C>M</C> | <C>Q</C> | <C>H</C>, Standard{" "}
            <C>M</C>), <C>margin</C> (Module, Standard 2), <C>fg</C>, <C>bg</C>.
          </>
        ),
      },
      color: {
        desc: "Erzeugt eine Farbpalette als JSON. Deterministisch über den Seed, damit dieselbe Marke zweimal dieselben Farben bekommt.",
        params: (
          <>
            <C>seed</C>, <C>count</C> (2–12, Standard 5), <C>mode</C> (
            <C>analogous</C> | <C>triad</C> | <C>mono</C>).
          </>
        ),
      },
    },
  },

  status: {
    title: "waldrand.dev — Status",
    description:
      "Betriebsstatus der Endpoints von waldrand.dev, minütlich geprüft.",
    command: "waldrand status",
    h1: "Der Rand wird beobachtet.",
    lede: "Live-Endpoints werden minütlich vom Rand aus geprüft. Diese Seite zeigt das letzte Ergebnis und die Prüfungen der vergangenen 48 Stunden.",
    line: "live-Endpoints werden überwacht",
    endpointCount: `${total} Endpoints`,
    h2: "Endpoints",
    legendPast: "vor 48 Stunden",
    legendToday: "heute",
    noData: "warte auf erste Prüfung",
    foot: "Live-Endpoints werden minütlich geprüft und 48 Stunden hier behalten. Geplante Endpoints werden erst beim Livegang geprüft.",
    uptimeLabel: "Noch keine Uptime-Daten",
    stateOperational: "betriebsbereit",
    stateDegraded: "eingeschränkt",
    stateOffline: "offline",
    statePlanned: "geplant",
    stateChecking: "wird geprüft",
    overallOperational: "alle überwachten Systeme betriebsbereit",
    overallDegraded: "mindestens ein System ist eingeschränkt",
    overallOffline: "mindestens ein System ist offline",
  },

  notFound: {
    title: "waldrand.dev — 404",
    description: "Diese Route gibt es auf waldrand.dev nicht.",
    command: "waldrand get 404",
    h1: "Diese Route gibt es nicht.",
    lede: "Kein Handler unter dieser Adresse. Alle Endpoints, live und geplant, stehen auf der Startseite.",
    cta: "zurück zur API-Oberfläche →",
  },
};

export const copy: Readonly<Record<Lang, Copy>> = { en, de };
