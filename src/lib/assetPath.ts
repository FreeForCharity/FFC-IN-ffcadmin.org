export function assetPath(path: string): string {
  const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const basePath = rawBasePath.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${basePath}${normalizedPath}`
}
