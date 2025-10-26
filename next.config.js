/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Removed 'output: export' to support dynamic pages (/login, /dashboard)
  // with Supabase authentication and runtime features
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig

