/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Standalone output для Docker оптимизации
  output: 'standalone',
}

module.exports = nextConfig

