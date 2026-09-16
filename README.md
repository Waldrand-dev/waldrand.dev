<p align="left">
  <img src="public/assets/logo/svg/waldrand-mark.svg" width="64" height="64" alt="waldrand.dev">
</p>

# waldrand.dev

**[waldrand.dev](https://waldrand.dev)**

The site for the waldrand.dev API surface: free, keyless `GET` endpoints.
`avatar` is **live**; the rest are **planned** — the site says so plainly rather
than showing a green tick for something that does not answer yet.

Next.js (App Router) · TypeScript · Tailwind CSS v4 · statically exported.

## The surface

| Endpoint | Returns | State |
| --- | --- | --- |
| `avatar.waldrand.dev/{seed}.svg` | `image/svg+xml` | live |
| `image.waldrand.dev/{w}x{h}` | `image/webp` | soon |
| `qr.waldrand.dev/{data}.svg` | `image/svg+xml` | soon |
| `color.waldrand.dev/palette` | `application/json` | soon |

`lib/endpoints.ts` is the single source of truth. The table on the front page,
the live/planned note above it, the endpoint counts and the uptime rows on the
status page all render from it, so flipping an endpoint to live is one edit.
`host` is a bare hostname; `originOf()` is the only place a scheme is added:

```ts
{ id: "avatar", …, state: "live" }
```

## Develop

```sh
npm install
npm run dev        # http://localhost:3000
npm run build      # static export into out/
npm run lint
npm run typecheck
```

`next build` writes plain HTML into `out/`. The Cloudflare Worker serves those
assets and exposes `/api/status`; its scheduled handler checks live APIs and
stores the latest result plus 48 hours of history in D1.

## Layout

```
app/layout.tsx       masthead, footer, fonts, metadata
app/page.tsx         the api surface
app/docs/            request shapes, parameters, headers
app/status/          uptime, honest about having nothing to show yet
app/not-found.tsx    404
app/globals.css      Tailwind theme tokens and the loading animation
components/          mark, masthead, table, uptime rows, terminal bits
lib/endpoints.ts     the API surface, typed
lib/dict.tsx         English and German copy, typed against each other
lib/i18n.tsx         language store, context, hooks
public/assets/logo/  brand assets — see BRAND.md
```

## Language

English is what gets prerendered, so the HTML is correct before any script
runs. `lib/dict.tsx` holds both languages, typed so German cannot drift out of
sync: `Copy` is inferred from the English object and the German one has to
satisfy it. The language comes from `?lang=de`, then `localStorage`, then the
browser's `Accept-Language`, and lives in a small external store read through
`useSyncExternalStore` — the server snapshot is always English, so hydration
matches and the swap happens in one pass.

## Brand

Mark, wordmark, palette and the loading sweep are the "Threshold" set in
`public/assets/logo/` — rules and file index in
[BRAND.md](public/assets/logo/BRAND.md). Ink `#12100E`, paper `#EFECE4`,
accent `#E8552F`, used on the threshold line only. The tokens are declared once
in `app/globals.css` under `@theme`.

## Deploy

[waldrand.dev](https://waldrand.dev) runs on Cloudflare Workers as static
assets. Every push to `main` builds the export and deploys it:

```sh
npm run build      # writes out/
npm run deploy     # wrangler deploy
```

`wrangler.jsonc` configures the Worker, its asset binding, D1 database, and a
once-per-minute cron trigger. Two details in it are load-bearing:
`html_handling: "auto-trailing-slash"` matches `trailingSlash: true` so `/docs`
redirects to `/docs/`, and `not_found_handling: "404-page"` serves the exported
`404.html`.

### Worker setup

Create the D1 database once and copy the returned ID into
`wrangler.jsonc`, replacing `REPLACE_WITH_D1_DATABASE_ID`:

```sh
npx wrangler d1 create waldrand-status
```

Apply the schema remotely, build the static site, and deploy the Worker:

```sh
npx wrangler d1 migrations apply waldrand-status --remote
npm run build
npx wrangler deploy
```

After deployment, the first scheduled check runs within a minute. The status
page reads the cached result from `/api/status`; it never probes the APIs from
each visitor's browser, so page traffic cannot consume the API rate limit.

## Licence

MIT for the code. The name and mark are not covered — see [LICENSE](LICENSE).
