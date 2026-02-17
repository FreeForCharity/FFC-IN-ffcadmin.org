import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'

// Normalize basePath: must start with "/" and not end with "/" per Next.js requirements
const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
const basePath = rawBasePath ? `/${rawBasePath.replace(/^\/|\/$/g, '')}` : ''

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Only apply basePath/assetPrefix when NEXT_PUBLIC_BASE_PATH is set.
  // An empty string means "no basePath", so we skip in that case.
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
}

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default analyzer(nextConfig)
