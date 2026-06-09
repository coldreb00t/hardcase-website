/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Standalone-сборка под Docker-деплой Timeweb (Dockerfile -> node server.js)
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig

