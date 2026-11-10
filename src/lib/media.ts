/** Prefer lighter WebP files when we ship both formats. */
export function mediaSrc(path: string) {
  if (path === "/images/hero-vial.png" || path === "/images/lotwise-vial.png") {
    return path.replace(/\.png$/, ".webp")
  }
  if (path === "/images/banners/hero-lab.jpg") {
    return "/images/banners/hero-lab.webp"
  }
  return path
}
