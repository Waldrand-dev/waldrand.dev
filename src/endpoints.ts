/**
 * The single source of truth for the API surface.
 *
 * The endpoint table on the index page and the per-endpoint list on the status
 * page are both generated from this array at build time (see `src/render.ts`
 * and the `waldrandHtml` plugin in `vite.config.ts`), so flipping an endpoint
 * from `soon` to `live` is one edit in one file.
 */

export type EndpointState = "live" | "soon";

export interface Endpoint {
  /** Stable id — used for anchors and as the i18n key suffix. */
  readonly id: string;
  /** Subdomain the endpoint answers on. */
  readonly host: string;
  /**
   * Path template. `{name}` segments are rendered as dimmed variables, so
   * write them exactly as a caller would see them.
   */
  readonly path: string;
  readonly method: "GET";
  readonly contentType: string;
  readonly state: EndpointState;
  /** Median latency in ms. Only meaningful once `state` is `live`. */
  readonly p50: number | null;
}

export const endpoints: readonly Endpoint[] = [
  {
    id: "avatar",
    host: "avatar.waldrand.dev",
    path: "/{seed}.svg",
    method: "GET",
    contentType: "image/svg+xml",
    state: "soon",
    p50: null,
  },
  {
    id: "image",
    host: "image.waldrand.dev",
    path: "/{w}x{h}",
    method: "GET",
    contentType: "image/webp",
    state: "soon",
    p50: null,
  },
  {
    id: "qr",
    host: "qr.waldrand.dev",
    path: "/{data}.svg",
    method: "GET",
    contentType: "image/svg+xml",
    state: "soon",
    p50: null,
  },
  {
    id: "color",
    host: "color.waldrand.dev",
    path: "/palette",
    method: "GET",
    contentType: "application/json",
    state: "soon",
    p50: null,
  },
] as const;

export const liveCount = endpoints.filter((e) => e.state === "live").length;
