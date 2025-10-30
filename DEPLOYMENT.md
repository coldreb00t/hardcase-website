# Deployment Instructions for HARD CASE Website

This project uses Next.js with **static export** (`output: 'export'`) and requires environment variables to be available during the build process.

## Environment Variables

The following environment variables are required:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://waatdpjvzacdfnebskhf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Important Notes:

1. **NEXT_PUBLIC_** prefix is required for browser-accessible variables
2. Variables must be available **during build time** (not just runtime)
3. Next.js replaces these values in the code during build

## Deployment Options

### Option 1: Vercel (Recommended)

1. Import your GitHub repository to Vercel
2. Add environment variables in **Project Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy automatically

### Option 2: Netlify

1. Import your repository to Netlify
2. Add environment variables in **Site settings → Build & deploy → Environment**
3. Deploy

### Option 3: GitHub Pages / Static Hosting

For fully static hosting without build-time environment injection:

1. Create `.env.local` with your variables
2. Build locally:
   ```bash
   npm run build
   ```
3. Upload `out/` directory to your hosting
4. **⚠️ Warning**: Environment variables are embedded in the HTML/JS files

### Option 4: Custom Server

1. Set environment variables on your server:
   ```bash
   export NEXT_PUBLIC_SUPABASE_URL=https://waatdpjvzacdfnebskhf.supabase.co
   export NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```
2. Build:
   ```bash
   npm run build
   ```
3. Serve `out/` directory with Nginx/Apache

## Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://waatdpjvzacdfnebskhf.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...your-actual-key
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Troubleshooting

### "Missing Supabase environment variables" Error

**During Build:**
- Make sure variables are set in your hosting platform's environment settings
- For local builds, ensure `.env.local` exists with correct values

**In Browser:**
- Check browser console for the actual values being used
- Verify variables are embedded in the built HTML/JS files

### Build Succeeds but App Fails in Browser

This means:
- ✅ Build used placeholder values (expected behavior)
- ❌ Browser doesn't have real values embedded

**Solution:** Add environment variables to your hosting platform's build settings.

## Security Notes

1. **NEXT_PUBLIC_** variables are **PUBLIC** - visible in browser
2. The `SUPABASE_ANON_KEY` is safe to expose (it's public by design)
3. Row Level Security (RLS) in Supabase protects your data
4. Never expose `SUPABASE_SERVICE_ROLE_KEY` in `NEXT_PUBLIC_` variables

## Current Setup

- ✅ Static export enabled (`output: 'export'`)
- ✅ Lazy Supabase initialization (loads on demand)
- ✅ Build-time placeholder values (prevents build errors)
- ✅ Runtime validation (ensures variables exist in browser)
- ✅ Works with any static hosting
