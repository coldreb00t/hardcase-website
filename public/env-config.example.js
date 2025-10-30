// HARD CASE - Runtime Environment Configuration
// This file is loaded in the browser to provide environment variables for static export

// INSTRUCTIONS FOR TIMEWEB.CLOUD DEPLOYMENT:
// 1. Copy this file to: public/env-config.js
// 2. Replace the values below with your actual Supabase credentials
// 3. Upload env-config.js to your server's /public directory
// 4. DO NOT commit env-config.js to git (it's in .gitignore)

window.__ENV__ = {
  NEXT_PUBLIC_SUPABASE_URL: 'YOUR_SUPABASE_URL_HERE',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY_HERE'
}
