<p align="left">
  <img src="public/assets/logo/svg/waldrand-mark.svg" width="64" height="64" alt="waldrand.dev">
</p>

# waldrand.dev

The site for the waldrand.dev API surface: four free, keyless `GET` endpoints.
All four are **in build** — the site says so plainly rather than showing a green
tick for something that does not answer yet.

Next.js (App Router) · TypeScript · Tailwind CSS v4 · statically exported.

## The surface

| Endpoint | Returns | State |
| --- | --- | --- |
| `avatar.waldrand.dev/{seed}.svg` | `image/svg+xml` | soon |
| `image.waldrand.dev/{w}x{h}` | `image/webp` | soon |
| `qr.waldrand.dev/{data}.svg` | `image/svg+xml` | soon |
| `color.waldrand.dev/palette` | `application/json` | soon |

`lib/endpoints.ts` is the single source of truth. The table on the front page
and the uptime rows on the status page both render from it, so flipping an
endpoint to live is one edit:

```ts
{ id: "avatar", …, state: "live", p50: 14 }
```

## Develop

```sh
npm install
npm run dev        # http://localhost:3000
npm run build      # static export into out/
npm run lint
npm run typecheck
```

There is no server. `next build` writes plain HTML into `out/`, which is what
GitHub Pages serves.

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

Every push to `main` builds and publishes to GitHub Pages via
`.github/workflows/deploy.yml`.

The site works both at the apex domain and under the Pages project path:
`actions/configure-pages` hands the right prefix to the build through
`NEXT_PUBLIC_BASE_PATH`. For the custom domain, point `waldrand.dev` at Pages
and set it under **Settings → Pages → Custom domain**.

## Licence

MIT for the code. The name and mark are not covered — see [LICENSE](LICENSE).
