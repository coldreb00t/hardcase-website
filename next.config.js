/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export для простого хостинга
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure static assets are properly exported
  trailingSlash: true,
}

module.exports = nextConfig

