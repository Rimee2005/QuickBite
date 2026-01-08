# Fixed: "Cannot read properties of undefined (reading '/_app')"

## Problem
- **Error**: `TypeError: Cannot read properties of undefined (reading '/_app')`
- **Cause**: Pages Router file (`pages/_app.tsx`) conflicting with App Router
- **Location**: Next.js trying to access `/_app` which doesn't exist in App Router

## Root Cause
The project uses **App Router** (with `app/` directory) but had a leftover **Pages Router** file (`pages/_app.tsx`). Next.js was trying to use both routing systems, causing a conflict.

## Solution Applied

### 1. Removed Pages Router File
- Deleted `pages/_app.tsx` (not needed in App Router)
- The `pages/api/` directory is empty, so no API routes to migrate

### 2. Cleaned Build
```bash
rm -rf .next
npm run build
```

## ✅ Result
- Build completed successfully
- No more `/_app` errors
- App Router working correctly

## App Router vs Pages Router

### App Router (Current Setup)
- Uses `app/` directory
- `app/layout.tsx` replaces `pages/_app.tsx`
- `app/error.tsx` for error boundaries
- API routes in `app/api/`

### Pages Router (Removed)
- Used `pages/` directory
- `pages/_app.tsx` for global app wrapper
- `pages/_document.tsx` for HTML structure
- API routes in `pages/api/`

## Verification

After fix:
- ✅ Build successful
- ✅ No `/_app` errors
- ✅ Login page should work
- ✅ All routes accessible

## If Error Persists

1. **Clean build:**
   ```bash
   rm -rf .next
   npm run build
   ```

2. **Check for other Pages Router files:**
   ```bash
   find pages -type f
   ```

3. **Remove any remaining Pages Router files** (except if you need `pages/api/` for specific routes)

## Notes

- App Router is the recommended approach for Next.js 13+
- Pages Router can coexist but causes confusion
- All functionality should be in `app/` directory
- API routes work in both `app/api/` and `pages/api/`

