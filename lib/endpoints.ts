/**
 * The single source of truth for the API surface.
 *
 * The table on the front page and the uptime rows on the status page are both
 * rendered from this array, so moving an endpoint from `soon` to `live` is one
 * edit in one file.
 */

export type EndpointState = "live" | "soon";

export interface Endpoint {
  /** Stable id — used for anchors and to look up copy in the dictionary. */
  readonly id: "avatar" | "image" | "qr" | "color";
  readonly host: string;
  /**
   * Path template. `{name}` segments render as dimmed variables, so write them
   * exactly as a caller would type them.
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
    state: "live",
    // Service time, measured in the container. An SVG is a few hundred bytes
    // of geometry off a hash, so the wire is the slow part, not the render.
    p50: 1,
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
