/**
 * Helper function to construct asset paths that work with an optional basePath.
 *
 * Production is deployed via GitHub Pages using the repo subpath
 * so NEXT_PUBLIC_BASE_PATH handles the prefix automatically.
 *
 * @param path - The asset path starting with /
 * @returns The full asset path including basePath if configured
 */
export function assetPath(path: string): string {
  const rawBasePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim()
  const normalizedBasePath =
    rawBasePath === "/" ? "" : rawBasePath.replace(/\/+$/, "")

  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  return `${normalizedBasePath}${normalizedPath}`
}
