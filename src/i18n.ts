/**
 * Translations.
 *
 * English lives in the markup, so the page reads correctly before any script
 * runs and with JavaScript off entirely. This module only carries the German
 * pass; `applyLanguage` swaps the marked nodes and restores the original
 * markup when switching back.
 */

export const LANGS = ["en", "de"] as const;
export type Lang = (typeof LANGS)[number];

export type Dict = Readonly<Record<string, string>>;

export const isLang = (value: unknown): value is Lang =>
  typeof value === "string" && (LANGS as readonly string[]).includes(value);

const de: Dict = {
  /* chrome */
  "brand.sub": "— api-oberfläche",
  "nav.apis": "[apis]",
  "nav.docs": "[docs]",
  "nav.status": "[status]",
  "boot.label": "lädt",

  /* shared */
  "state.soon": "bald",
  "state.live": "200",

  /* index */
  "index.title": "waldrand.dev — API-Oberfläche",
  "index.meta.desc":
    "Vier freie, schlüssellose GET-Endpoints: Avatare, Platzhalterbilder, QR-Codes und Farbpaletten. Kein Account, kein Token, 60 Anfragen pro Minute und IP.",
  "index.h1": "4 Endpoints. 0 Keys. 0 €.",
  "index.lede":
    "Alles hier ist ein GET entfernt. Rate-Limit pro IP bei 60/min — kein Account, den man anlegen, kein Schlüssel, den man rotieren muss.",
  "index.buildnote":
    "Alle vier sind gerade im Bau. Noch ist nichts live — was unten steht, ist die Form, die ausgeliefert wird.",
  "index.th.method": "Methode",
  "index.th.path": "Host / Pfad",
  "index.th.type": "Content-Type",
  "index.th.p50": "p50",
  "index.th.state": "Status",
  "index.curl.note": "Geplante Antwort — der Endpoint ist noch nicht live.",
  "index.pitch.line": "Ein Anwendungsfall, den ich noch nicht gebaut habe?",
  "index.pitch.cta": "Issue eröffnen →",

  /* docs */
  "docs.title": "waldrand.dev — Doku",
  "docs.meta.desc":
    "Anfrageform, Parameter und Header der vier Endpoints von waldrand.dev.",
  "docs.h1": "Vier Endpoints, eine Regel: GET und fertig.",
  "docs.lede":
    "Keine Authentifizierung, keine SDKs, keine Registrierung. Jede Route antwortet auf ein blankes GET und lässt sich cachen. Die Doku steht schon, weil die Form feststeht — die Implementierung kommt als Nächstes.",
  "docs.common.h2": "Gemeinsames Verhalten",
  "docs.common.auth.dt": "Authentifizierung",
  "docs.common.auth.dd": "Keine. Es gibt keine Keys, keine Tokens, keinen Account.",
  "docs.common.rate.dt": "Rate-Limit",
  "docs.common.rate.dd":
    "60 Anfragen pro Minute und IP. Jede Antwort trägt <code>x-ratelimit-limit</code> und <code>x-ratelimit-remaining</code>; bei Überschreitung kommt 429 mit <code>retry-after</code>.",
  "docs.common.cache.dt": "Caching",
  "docs.common.cache.dd":
    "Deterministische Routen liefern <code>cache-control: public, max-age=31536000, immutable</code>. Gleiche URL, gleiche Bytes.",
  "docs.common.cors.dt": "CORS",
  "docs.common.cors.dd":
    "<code>access-control-allow-origin: *</code> auf allen Routen. Direkt aus dem Browser nutzbar.",
  "docs.common.errors.dt": "Fehler",
  "docs.common.errors.dd":
    "400 bei ungültigen Parametern, 404 bei unbekannten Routen, 429 beim Limit. Fehlerbodies sind JSON, auch auf Bild-Routen.",
  "docs.common.versioning.dt": "Versionierung",
  "docs.common.versioning.dd":
    "Die Ausgabe einer deterministischen Route ändert sich nie. Wird ein Rendering überarbeitet, bekommt es eine neue Route statt neuer Bytes.",
  "docs.ep.h2": "Endpoints",
  "docs.avatar.desc":
    "Gibt einen deterministischen Avatar für einen beliebigen Seed zurück. Derselbe Seed liefert für immer dasselbe SVG — geeignet für Platzhalter-Profilbilder, Commit-Autoren, Sitzplätze in Demos.",
  "docs.image.desc":
    "Platzhalterbild in den angeforderten Maßen, als WebP. Gedacht für Layout-Arbeit, in der Lorem-Ipsum-Bilder sonst zur Hälfte der Ladezeit werden.",
  "docs.qr.desc":
    "Kodiert die übergebenen Daten als QR-Code und liefert Vektor zurück — skalierbar, druckbar, ohne Wasserzeichen.",
  "docs.color.desc":
    "Erzeugt eine Farbpalette als JSON. Deterministisch über den Seed, damit dieselbe Marke zweimal dieselben Farben bekommt.",
  "docs.params": "Parameter",
  "docs.example": "Beispiel",
  "docs.status.soon": "Noch nicht live — Form steht, Implementierung folgt.",

  /* status */
  "status.title": "waldrand.dev — Status",
  "status.meta.desc":
    "Betriebsstatus der Endpoints von waldrand.dev. Alle vier sind im Bau.",
  "status.h1": "Nichts ist unten. Nichts ist oben.",
  "status.lede":
    "Alle vier Endpoints sind im Bau. Diese Seite zeigt keine Messwerte, solange es nichts zu messen gibt — kein grünes Häkchen für einen Dienst, der noch nicht antwortet.",
  "status.line": "alle systeme im bau",
  "status.endpoints": "4 Endpoints",
  "status.legend.days": "vor 48 Tagen",
  "status.legend.today": "heute",
  "status.nodata": "keine Daten",
  "status.h2": "Endpoints",
  "status.foot":
    "Sobald ein Endpoint live geht, erscheint hier echte Uptime — von außen gemessen, minütlich, ohne Rundung nach oben.",

  /* 404 */
  "notfound.title": "waldrand.dev — 404",
  "notfound.meta.desc": "Diese Route gibt es auf waldrand.dev nicht.",
  "notfound.h1": "Diese Route gibt es nicht.",
  "notfound.lede":
    "Kein Handler unter dieser Adresse. Die vier Endpoints, die es geben wird, stehen auf der Startseite.",
  "notfound.cta": "zurück zur API-Oberfläche →",

  /* footer */
  "foot.built": "gebaut am Waldrand",
  "foot.source": "Quelltext",
  "foot.issues": "Issues",
  "foot.brand": "Marke",
};

export const dictionaries: Readonly<Record<Lang, Dict>> = { en: {}, de };
