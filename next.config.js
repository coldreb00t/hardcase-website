/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export для простого хостинга
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig

