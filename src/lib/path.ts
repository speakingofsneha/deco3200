// every root-relative link and asset goes through here, so the site works
// both at / (local dev) and under a sub-folder like /deco3200/ (GitHub Pages).
const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export function url(path: string): string {
  return path.startsWith("/") ? `${base}${path}` : path;
}
