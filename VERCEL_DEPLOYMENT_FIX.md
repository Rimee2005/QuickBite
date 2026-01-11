# Vercel Deployment - Login Redirect Fix

## Problem
Login works on localhost but fails to redirect to dashboard after deployment on Vercel.

## Root Cause
1. **Cookie Configuration**: NextAuth.js cookies need proper configuration for production
2. **Session Timing**: Session not immediately available after login
3. **Redirect Logic**: Dashboard redirects before session is established
4. **Environment Variables**: `NEXTAUTH_URL` must be set correctly

## ✅ Solutions Applied

### 1. NextAuth Cookie Configuration
Updated `app/api/auth/[...nextauth]/route.ts`:
- ✅ `httpOnly: true` - Prevents XSS attacks
- ✅ `secure: true` - Only in production (requires HTTPS)
- ✅ `sameSite: 'lax'` - Allows cookies on same-site requests
- ✅ Proper cookie names with `__Secure-` prefix in production

### 2. Login Page Session Handling
Updated `app/login/page.tsx`:
- ✅ Retry logic to wait for session establishment (up to 2 seconds)
- ✅ Use `window.location.href` in production for full page reload
- ✅ Proper error handling if session doesn't establish

### 3. Dashboard Redirect Logic
Updated `app/student/dashboard/page.tsx`:
- ✅ Wait 500ms before checking authentication
- ✅ Only redirect if session is definitely not available
- ✅ Prevents premature redirects

### 4. SessionProvider Configuration
Updated `components/providers.tsx`:
- ✅ Proper basePath configuration
- ✅ Refetch on window focus
- ✅ Regular session refresh

## 🔧 Required Environment Variables

### For Vercel Deployment:

```env
# Required - Your Vercel deployment URL
NEXTAUTH_URL=https://your-app.vercel.app

# Required - Secret for JWT signing (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-secret-key-here

# MongoDB Connection
MONGODB_URI=your-mongodb-connection-string

# Other environment variables...
```

### How to Set in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - `NEXTAUTH_URL` = `https://your-app.vercel.app` (your actual Vercel URL)
   - `NEXTAUTH_SECRET` = Generate a random string (use `openssl rand -base64 32`)
   - `MONGODB_URI` = Your MongoDB Atlas connection string
   - All other required environment variables

## 🔍 Why Localhost Worked But Production Failed

### Localhost:
- ✅ Cookies work with `sameSite: 'lax'` on same-origin
- ✅ No HTTPS required (secure: false)
- ✅ Session establishes quickly
- ✅ No domain restrictions

### Production (Vercel):
- ⚠️ Cookies need `secure: true` (requires HTTPS)
- ⚠️ `NEXTAUTH_URL` must match exactly
- ⚠️ Session might take longer to establish
- ⚠️ Cross-origin issues if misconfigured

## 📝 Code Changes Summary

### 1. NextAuth Configuration (`app/api/auth/[...nextauth]/route.ts`)
```typescript
cookies: {
  sessionToken: {
    name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  // ... other cookies
}
```

### 2. Login Handler (`app/login/page.tsx`)
```typescript
// Wait for session with retry logic
let session = null
let attempts = 0
const maxAttempts = 10

while (!session && attempts < maxAttempts) {
  await new Promise(resolve => setTimeout(resolve, 200))
  session = await getSession()
  attempts++
}

// Use window.location in production
if (process.env.NODE_ENV === 'production') {
  window.location.href = redirectPath
} else {
  router.push(redirectPath)
}
```

### 3. Dashboard Redirect (`app/student/dashboard/page.tsx`)
```typescript
useEffect(() => {
  if (isLoading) return
  
  const checkAuth = setTimeout(() => {
    if (!isAuthenticated || (user && user.type !== "student")) {
      router.push("/login")
    }
  }, 500) // Wait 500ms for session
  
  return () => clearTimeout(checkAuth)
}, [isLoading, isAuthenticated, user, router])
```

## ✅ Verification Steps

1. **Check Environment Variables:**
   ```bash
   # In Vercel dashboard, verify:
   - NEXTAUTH_URL is set to your Vercel URL
   - NEXTAUTH_SECRET is set
   - MONGODB_URI is set
   ```

2. **Test Login Flow:**
   - Login with valid credentials
   - Check browser DevTools → Application → Cookies
   - Should see `__Secure-next-auth.session-token` cookie
   - Should redirect to dashboard after ~1-2 seconds

3. **Check Console:**
   - No cookie errors
   - Session established successfully
   - No redirect loops

## 🐛 Troubleshooting

### Issue: Still redirecting to login
**Solution:**
- Check `NEXTAUTH_URL` matches your Vercel URL exactly
- Verify `NEXTAUTH_SECRET` is set
- Check browser console for cookie errors
- Verify cookies are being set (DevTools → Application → Cookies)

### Issue: Cookies not being set
**Solution:**
- Ensure `NEXTAUTH_URL` is HTTPS (not HTTP)
- Check `secure: true` is only in production
- Verify domain matches (don't set domain explicitly)

### Issue: Session not persisting
**Solution:**
- Check `NEXTAUTH_SECRET` is set and consistent
- Verify MongoDB connection is working
- Check session maxAge settings

## 📚 Additional Notes

- **Same-Origin**: Since Next.js and NextAuth are on the same domain (Vercel), we use `sameSite: 'lax'`
- **Cross-Origin**: If you have a separate backend, you'd need `sameSite: 'none'` and proper CORS
- **Cookie Prefixes**: `__Secure-` prefix requires HTTPS and secure flag
- **Session Strategy**: Using JWT (not database sessions) for better performance

## 🎯 Expected Behavior After Fix

1. User logs in → NextAuth creates session
2. Cookie is set with proper security flags
3. Session is retrieved (with retry logic)
4. User is redirected to appropriate dashboard
5. Dashboard checks session (with delay)
6. User sees dashboard content

Your login should now work correctly in production! 🎉


