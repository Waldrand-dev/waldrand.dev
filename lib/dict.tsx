import type { ReactNode } from "react";

import type { Endpoint } from "@/lib/endpoints";

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

const en = {
  common: {
    brandSub: "— api surface",
    navApis: "[apis]",
    navDocs: "[docs]",
    navStatus: "[status]",
    loading: "loading",
    stateSoon: "soon",
    stateLive: "200",
    footBuilt: "built at the forest edge",
    footSource: "source",
    footIssues: "issues",
    footBrand: "brand",
    langLabel: "Sprache auf Deutsch umstellen",
  },

  index: {
    title: "waldrand.dev — api surface",
    description:
      "Four free, keyless GET endpoints: avatars, placeholder images, QR codes and colour palettes. No account, no token, 60 requests a minute per IP.",
    command: "waldrand ls --free",
    h1: "4 endpoints. 0 keys. 0 €.",
    lede: "Everything here is a GET away. Rate limiting is per IP at 60/min — no account to create, nothing to forget to rotate.",
    buildNote:
      "All four are in build right now. Nothing is live yet — what's below is the shape that ships.",
    thMethod: "Method",
    thPath: "Host / Path",
    thType: "Content-Type",
    thP50: "p50",
    thState: "State",
    curlNote: "Planned response — the endpoint is not live yet.",
    pitchLine: "Own a use case I haven't built?",
    pitchCta: "open an issue →",
  },

  docs: {
    title: "waldrand.dev — docs",
    description:
      "Request shapes, parameters and headers for the four waldrand.dev endpoints.",
    command: "waldrand docs",
    h1: "Four endpoints, one rule: GET and go.",
    lede: "No auth, no SDKs, no sign-up. Every route answers a bare GET and caches. The docs are here already because the shape is settled — the implementation is what's next.",
    commonH2: "Common behaviour",
    rows: [
      { term: "Authentication", body: <>None. There are no keys, no tokens, no account.</> },
      {
        term: "Rate limit",
        body: (
          <>
            60 requests per minute per IP. Every response carries{" "}
            <C>x-ratelimit-limit</C> and <C>x-ratelimit-remaining</C>; going over
            returns 429 with <C>retry-after</C>.
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
      "Operational status for the waldrand.dev endpoints. All four are in build.",
    command: "waldrand status",
    h1: "Nothing is down. Nothing is up.",
    lede: "All four endpoints are in build. This page shows no numbers while there is nothing to measure — no green tick for a service that does not answer yet.",
    line: "all systems in build",
    endpointCount: "4 endpoints",
    h2: "Endpoints",
    legendPast: "48 days ago",
    legendToday: "today",
    noData: "no data",
    foot: "Once an endpoint goes live, real uptime appears here — measured from outside, every minute, never rounded up.",
    uptimeLabel: "No uptime data yet",
  },

  notFound: {
    title: "waldrand.dev — 404",
    description: "No such route on waldrand.dev.",
    command: "waldrand get 404",
    h1: "No such route.",
    lede: "Nothing handles this address. The four endpoints that will exist are on the front page.",
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
    stateSoon: "bald",
    stateLive: "200",
    footBuilt: "gebaut am Waldrand",
    footSource: "Quelltext",
    footIssues: "Issues",
    footBrand: "Marke",
    langLabel: "Switch language to English",
  },

  index: {
    title: "waldrand.dev — API-Oberfläche",
    description:
      "Vier freie, schlüssellose GET-Endpoints: Avatare, Platzhalterbilder, QR-Codes und Farbpaletten. Kein Account, kein Token, 60 Anfragen pro Minute und IP.",
    command: "waldrand ls --free",
    h1: "4 Endpoints. 0 Keys. 0 €.",
    lede: "Alles hier ist ein GET entfernt. Rate-Limit pro IP bei 60/min — kein Account, den man anlegen, kein Schlüssel, den man rotieren muss.",
    buildNote:
      "Alle vier sind gerade im Bau. Noch ist nichts live — was unten steht, ist die Form, die ausgeliefert wird.",
    thMethod: "Methode",
    thPath: "Host / Pfad",
    thType: "Content-Type",
    thP50: "p50",
    thState: "Status",
    curlNote: "Geplante Antwort — der Endpoint ist noch nicht live.",
    pitchLine: "Ein Anwendungsfall, den ich noch nicht gebaut habe?",
    pitchCta: "Issue eröffnen →",
  },

  docs: {
    title: "waldrand.dev — Doku",
    description:
      "Anfrageform, Parameter und Header der vier Endpoints von waldrand.dev.",
    command: "waldrand docs",
    h1: "Vier Endpoints, eine Regel: GET und fertig.",
    lede: "Keine Authentifizierung, keine SDKs, keine Registrierung. Jede Route antwortet auf ein blankes GET und lässt sich cachen. Die Doku steht schon, weil die Form feststeht — die Implementierung kommt als Nächstes.",
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
            60 Anfragen pro Minute und IP. Jede Antwort trägt{" "}
            <C>x-ratelimit-limit</C> und <C>x-ratelimit-remaining</C>; bei
            Überschreitung kommt 429 mit <C>retry-after</C>.
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
      "Betriebsstatus der Endpoints von waldrand.dev. Alle vier sind im Bau.",
    command: "waldrand status",
    h1: "Nichts ist unten. Nichts ist oben.",
    lede: "Alle vier Endpoints sind im Bau. Diese Seite zeigt keine Messwerte, solange es nichts zu messen gibt — kein grünes Häkchen für einen Dienst, der noch nicht antwortet.",
    line: "alle systeme im bau",
    endpointCount: "4 Endpoints",
    h2: "Endpoints",
    legendPast: "vor 48 Tagen",
    legendToday: "heute",
    noData: "keine Daten",
    foot: "Sobald ein Endpoint live geht, erscheint hier echte Uptime — von außen gemessen, minütlich, ohne Rundung nach oben.",
    uptimeLabel: "Noch keine Uptime-Daten",
  },

  notFound: {
    title: "waldrand.dev — 404",
    description: "Diese Route gibt es auf waldrand.dev nicht.",
    command: "waldrand get 404",
    h1: "Diese Route gibt es nicht.",
    lede: "Kein Handler unter dieser Adresse. Die vier Endpoints, die es geben wird, stehen auf der Startseite.",
    cta: "zurück zur API-Oberfläche →",
  },
};

export const copy: Readonly<Record<Lang, Copy>> = { en, de };
