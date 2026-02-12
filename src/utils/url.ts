/**
 * Build URL with base path, works in both dev and production.
 * Handles BASE_URL with or without trailing slash.
 */
export function buildUrl(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
