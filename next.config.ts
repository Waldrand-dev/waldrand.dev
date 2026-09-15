import type { NextConfig } from "next";

/**
 * The site is a static export: `next build` writes plain HTML into `out/`,
 * which Cloudflare serves as a Worker with no code of its own — see
 * `wrangler.jsonc`. No server, no runtime.
 *
 * `basePath` stays configurable through `NEXT_PUBLIC_BASE_PATH` so the build
 * can be served from a sub-path, but at waldrand.dev it is empty, which is the
 * default. Nothing sets it in normal deploys.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // Trailing slashes keep `/docs/` resolving to `docs/index.html` on a plain
  // static host.
  trailingSlash: true,
  images: { unoptimized: true },
  reactCompiler: true,
};

export default nextConfig;
