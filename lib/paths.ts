/**
 * Static assets in `public/` are not rewritten by `basePath`, so anything that
 * points at one goes through here.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string): string => `${basePath}${path}`;

export const GITHUB_REPO = "https://github.com/Waldrand-dev/waldrand.dev";
