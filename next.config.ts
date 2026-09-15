import type { NextConfig } from "next";

/**
 * The site is a static export: `next build` writes plain HTML into `out/`,
 * which is what GitHub Pages serves. No server, no runtime.
 *
 * On a project page the site lives under `/waldrand.dev`, at the apex domain
 * it lives at `/`. The Pages workflow passes the right prefix through
 * `NEXT_PUBLIC_BASE_PATH` (from `actions/configure-pages`), so the same build
 * works in both places.
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
