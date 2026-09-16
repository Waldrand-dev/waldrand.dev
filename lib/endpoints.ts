/**
 * The single source of truth for the API surface.
 *
 * The table on the front page, the live/planned note above it, the endpoint
 * counts and the uptime rows on the status page are all rendered from this
 * array, so moving an endpoint from `soon` to `live` is one edit in one file.
 */

export type EndpointState = "live" | "soon";

export interface Endpoint {
  /** Stable id — used for anchors and to look up copy in the dictionary. */
  readonly id: "avatar" | "image" | "qr" | "color";
  /** Bare hostname, no scheme — use `originOf` for a URL. */
  readonly host: string;
  /**
   * Path template. `{name}` segments render as dimmed variables, so write them
   * exactly as a caller would type them.
   */
  readonly path: string;
  /** Concrete route used by the external health checker. */
  readonly checkPath: string;
  readonly method: "GET";
  readonly contentType: string;
  readonly state: EndpointState;
}

export const endpoints: readonly Endpoint[] = [
  {
    id: "avatar",
    host: "avatar.waldrand.dev",
    path: "/{seed}.svg",
    checkPath: "/status.svg",
    method: "GET",
    contentType: "image/svg+xml",
    state: "live",
  },
  {
    id: "image",
    host: "image.waldrand.dev",
    path: "/{w}x{h}",
    checkPath: "/1x1",
    method: "GET",
    contentType: "image/webp",
    state: "soon",
  },
  {
    id: "qr",
    host: "qr.waldrand.dev",
    path: "/{data}.svg",
    checkPath: "/status.svg",
    method: "GET",
    contentType: "image/svg+xml",
    state: "soon",
  },
  {
    id: "color",
    host: "color.waldrand.dev",
    path: "/palette",
    checkPath: "/palette?seed=status",
    method: "GET",
    contentType: "application/json",
    state: "soon",
  },
] as const;

/** `https://` plus the host — the one place a scheme is added. */
export const originOf = (endpoint: Endpoint): string => `https://${endpoint.host}`;

export const liveEndpoints = endpoints.filter((e) => e.state === "live");
export const plannedEndpoints = endpoints.filter((e) => e.state === "soon");
export const liveCount = liveEndpoints.length;
