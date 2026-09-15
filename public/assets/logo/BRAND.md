# waldrand.dev — Logo 1a "Threshold"

Complete asset set: static marks, lockups, animated loading state, favicons, OG image, snippets.

## Colours
| Token | Hex | Use |
|---|---|---|
| Ink | `#12100E` | tile, dark ground, body text |
| Paper | `#EFECE4` | ridge, light ground |
| Accent | `#E8552F` | threshold line only |
| Muted | `#A8A196` | `.dev` in wordmark grade |

`colors.css` (custom properties) and `colors.json` (raw) ship in the root.

## Type
Wordmark **Archivo 800**, tracking −4.5%. UI **IBM Plex Sans**, code **IBM Plex Mono**.
Embed link is in `head-snippet.html`.

## Files

### `svg/` — vector
| File | Use |
|---|---|
| `waldrand-mark.svg` | primary mark, 32px and up |
| `waldrand-mark-small.svg` | ≤24px — threshold dropped, peaks widened |
| `waldrand-mark-inverted.svg` | light mark on dark grounds |
| `waldrand-mark-on-accent.svg` | mark on accent orange |
| `waldrand-mark-outline.svg` | 1pt stroke — engraving, stamps, embossing |
| `waldrand-mark-sticker.svg` | no tile — die-cut, circles, free placement |
| `waldrand-mark-onecolor.svg` | single colour, inherits `currentColor` |
| `waldrand-ridge-only.svg` | bare ridge path, inherits `currentColor` |
| `waldrand-loading.svg` | **animated** SMIL, self-contained, 1.5s |
| `waldrand-loading-slow.svg` | **animated** 2.4s variant |
| `waldrand-lockup.svg` | mark + wordmark, horizontal |
| `waldrand-lockup-inverted.svg` | same, for dark grounds |
| `waldrand-lockup-stacked.svg` | centred, with API SURFACE line |
| `waldrand-wordmark.svg` | wordmark alone |
| `waldrand-badge.svg` | README/status badge |

Lockups reference Archivo by name — load the font, or convert text to outlines for print.

### `png/` — raster
`favicon-16/32/48/64`, `apple-touch-icon` (180), `icon-192`, `icon-512`, `icon-1024`,
`mark-inverted-512`, `mark-transparent-512`, `og-image-1200x630`.

### Root — drop-in
- `favicon.svg` — copy to your web root
- `site.webmanifest` — PWA icons, theme colours
- `head-snippet.html` — favicon, manifest, OG and font tags
- `loading.css` + `loading-snippet.html` — CSS loading variant, honours `prefers-reduced-motion`
- `cli-snippet.txt` — ASCII mark, ANSI colours, shields.io badge URL

## Loading state
Two ways in. `svg/waldrand-loading.svg` is self-contained — use it in an `<img>`, no CSS.
`loading.css` drives an inline SVG instead, so the mark inherits page colours and respects
reduced-motion. The ridge holds at 30%, the threshold travels bottom → top over 1.5s,
fading at both edges. Resolve to the static mark once loaded.

## Rules
- Clear space: 1/4 of the mark's edge length on all sides.
- The threshold line is the only accent. Don't recolour it, don't duplicate it.
- Use `-small` at 24px and below.
- Never distort, rotate, shadow, or gradient the mark.
- `.dev` is dimmed only at wordmark grade; in running UI text set it full-strength.
