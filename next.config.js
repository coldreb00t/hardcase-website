/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export for simple hosting
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Explicitly define environment variables for static export
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
}

// Log environment variables during build
// Note: For static export with runtime config, missing values at build-time is OK
// Real values will be loaded from /public/env-config.js in the browser
const supabaseUrlSet = !!process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKeySet = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔧 Build-time environment check:')
console.log('  NEXT_PUBLIC_SUPABASE_URL:', supabaseUrlSet ? '✅ Set' : '⚠️  Will use runtime config')
console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKeySet ? '✅ Set' : '⚠️  Will use runtime config')

if (!supabaseUrlSet || !supabaseKeySet) {
  console.log('  ℹ️  Runtime config will be loaded from /public/env-config.js in browser')
}

module.exports = nextConfig
