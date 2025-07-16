import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'

const isAnalyze = process.env.ANALYZE === 'true'
const isDev = process.env.NODE_ENV === 'development'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,

  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'investigamais.com',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: isDev
          ? 'http://localhost:4000/api/:path*'
          : 'http://127.0.0.1:3000/api/:path*',
      },
    ]
  },
}

export default isAnalyze
  ? withBundleAnalyzer({ enabled: true })(nextConfig)
  : nextConfig
