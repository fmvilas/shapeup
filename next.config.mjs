/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  experimental: {
    scrollRestoration: true,
  },
}

export default nextConfig
