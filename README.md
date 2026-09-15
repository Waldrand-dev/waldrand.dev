<p align="left">
  <img src="public/assets/logo/svg/waldrand-mark.svg" width="64" height="64" alt="waldrand.dev">
</p>

# waldrand.dev

The site for the waldrand.dev API surface: four free, keyless `GET` endpoints.
All four are **in build** — the site states that plainly rather than showing a
green tick for something that does not answer yet.

Static site. TypeScript, Vite, no framework, no runtime dependencies.

## The surface

| Endpoint | Returns | State |
| --- | --- | --- |
| `avatar.waldrand.dev/{seed}.svg` | `image/svg+xml` | soon |
| `image.waldrand.dev/{w}x{h}` | `image/webp` | soon |
| `qr.waldrand.dev/{data}.svg` | `image/svg+xml` | soon |
| `color.waldrand.dev/palette` | `application/json` | soon |

`src/endpoints.ts` is the single source of truth. The table on the front page
and the uptime rows on the status page are both generated from it at build
time by the `waldrand-html` plugin in `vite.config.ts`, so flipping an endpoint
to live is one edit:

```ts
{ id: "avatar", …, state: "live", p50: 14 }
```

Because that runs during the build and not in the browser, the endpoint list
ships inside the HTML — readable with JavaScript off, and visible to crawlers.

## Develop

```sh
npm install
npm run dev        # vite dev server on :5173
npm run build      # tsc --noEmit, then a static build into dist/
npm run preview    # serve dist/
npm run typecheck
```

## Layout

```
index.html  docs.html  status.html  404.html   pages (English copy lives here)
src/endpoints.ts    the API surface, typed
src/render.ts       build-time HTML for the table and uptime rows
src/i18n.ts         German pass; English is the markup itself
src/main.ts         language switch, boot curtain, nav state
src/styles/site.css the whole stylesheet
public/assets/logo/ brand assets — see BRAND.md
```

## Language

English is written into the HTML, so the page is correct before any script
runs. `src/i18n.ts` carries the German pass and `[en/de]` swaps the marked
nodes. The choice comes from `?lang=de`, then `localStorage`, then the
browser's `Accept-Language`.

## Brand

Mark, wordmark, palette and the loading animation are the "Threshold" set in
`public/assets/logo/` — rules and file index in
[BRAND.md](public/assets/logo/BRAND.md). Ink `#12100E`, paper `#EFECE4`,
accent `#E8552F`, used on the threshold line only.

## Deploy

Every push to `main` builds and publishes to GitHub Pages via
`.github/workflows/deploy.yml`. Enable it once under **Settings → Pages →
Source: GitHub Actions**.

For the custom domain, point `waldrand.dev` at GitHub Pages and set it under
**Settings → Pages → Custom domain**. Asset paths are relative, so the build
works both at the apex and under a project path.

## Licence

MIT for the code. The name and mark are not covered — see [LICENSE](LICENSE).
