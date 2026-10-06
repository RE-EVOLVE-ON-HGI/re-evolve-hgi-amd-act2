/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const api = process.env.HGI_API_INTERNAL_URL
    if (!api) return []

    const base = api.replace(/\/$/, '')
    return [
      { source: '/api/:path*', destination: `${base}/api/:path*` },
      { source: '/realtime/:path*', destination: `${base}/realtime/:path*` },
    ]
  },
}

export default nextConfig
