import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";

import { endpointsTable, statusCards } from "./src/render";

const root = dirname(fileURLToPath(import.meta.url));

/**
 * Fills the `<!--@name-->` placeholders in the HTML with markup generated from
 * `src/endpoints.ts`. Doing it here rather than in the browser keeps the API
 * surface in the shipped HTML: readable with JavaScript off, visible to
 * crawlers, and free of a layout shift on load.
 */
const waldrandHtml = (): Plugin => ({
  name: "waldrand-html",
  transformIndexHtml: {
    order: "pre",
    handler(html) {
      return html
        .replace("<!--@endpoints-table-->", endpointsTable())
        .replace("<!--@status-cards-->", statusCards());
    },
  },
});

export default defineConfig({
  // Relative asset URLs, so the build works both at waldrand.dev and under a
  // GitHub Pages project path.
  base: "./",
  appType: "mpa",
  plugins: [waldrandHtml()],
  build: {
    // `assets/` in the repo is brand material; bundler output goes next to it.
    assetsDir: "build",
    target: "es2022",
    cssTarget: "chrome100",
    rollupOptions: {
      input: {
        index: resolve(root, "index.html"),
        docs: resolve(root, "docs.html"),
        status: resolve(root, "status.html"),
        notfound: resolve(root, "404.html"),
      },
    },
  },
  server: { port: 5173, open: false },
});
