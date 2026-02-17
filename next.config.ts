import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
}

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default analyzer(nextConfig)
