# Vercel Environment Variables Setup - CRITICAL

## ⚠️ CRITICAL: These Must Be Set Correctly

### 1. NEXTAUTH_URL (MOST IMPORTANT)

```env
NEXTAUTH_URL=https://your-exact-vercel-url.vercel.app
```

**Rules:**
- ✅ Must be your **exact** Vercel deployment URL
- ✅ Must start with `https://` (not `http://`)
- ✅ No trailing slash (`/`)
- ✅ Must match the domain where cookies are set
- ❌ Don't use `localhost` or `127.0.0.1`
- ❌ Don't use a different domain

**How to Find Your Vercel URL:**
1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Domains**
4. Copy the production domain (e.g., `your-app.vercel.app`)
5. Use: `https://your-app.vercel.app` (no trailing slash)

**Common Mistakes:**
- ❌ `NEXTAUTH_URL=http://your-app.vercel.app` (HTTP instead of HTTPS)
- ❌ `NEXTAUTH_URL=https://your-app.vercel.app/` (trailing slash)
- ❌ `NEXTAUTH_URL=https://www.your-app.vercel.app` (www prefix if not configured)
- ❌ `NEXTAUTH_URL=your-app.vercel.app` (missing https://)

### 2. NEXTAUTH_SECRET (REQUIRED)

```env
NEXTAUTH_SECRET=your-secret-key-here-minimum-32-characters
```

**Generate Secret:**
```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Online
# Visit: https://generate-secret.vercel.app/32
```

**Rules:**
- ✅ Minimum 32 characters
- ✅ Must be consistent (don't change after deployment)
- ✅ Use random, secure string
- ❌ Don't use simple strings like "secret" or "password"

### 3. MONGODB_URI (REQUIRED)

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickbite?retryWrites=true&w=majority
```

**Rules:**
- ✅ Full connection string from MongoDB Atlas
- ✅ Include database name
- ✅ Include connection options

### 4. Other Variables (As Needed)

```env
# Socket.IO Server (if using external server)
NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.onrender.com

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🔧 How to Set in Vercel

### Step 1: Go to Vercel Dashboard
1. Navigate to [vercel.com](https://vercel.com)
2. Select your project
3. Click **Settings** → **Environment Variables**

### Step 2: Add Each Variable
1. Click **Add New**
2. Enter variable name (e.g., `NEXTAUTH_URL`)
3. Enter variable value (e.g., `https://your-app.vercel.app`)
4. Select environment:
   - ✅ **Production** (required)
   - ✅ **Preview** (optional, for preview deployments)
   - ✅ **Development** (optional, for local dev)
5. Click **Save**

### Step 3: Verify All Variables
Make sure these are set for **Production**:
- [ ] `NEXTAUTH_URL` = Your exact Vercel URL
- [ ] `NEXTAUTH_SECRET` = 32+ character string
- [ ] `MONGODB_URI` = Your MongoDB connection string
- [ ] Other required variables

### Step 4: Redeploy
After setting variables:
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger redeploy

## ✅ Verification

### Check Environment Variables:
1. Go to Vercel → Settings → Environment Variables
2. Verify all variables are set for **Production**
3. Check values are correct (no typos)

### Test After Deployment:
1. Clear browser cookies and cache
2. Visit your Vercel URL
3. Try to login
4. Check browser DevTools → Application → Cookies
5. Should see `__Secure-next-auth.session-token` cookie

### Check Vercel Logs:
1. Go to Vercel → Deployments
2. Click on latest deployment
3. Click **Functions** tab
4. Check for any errors related to:
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - Session creation

## 🐛 Common Issues

### Issue: "NEXTAUTH_URL is not set"
**Solution:**
- Set `NEXTAUTH_URL` in Vercel environment variables
- Make sure it's set for **Production** environment
- Redeploy after setting

### Issue: "Invalid NEXTAUTH_SECRET"
**Solution:**
- Generate a new secret (32+ characters)
- Set it in Vercel environment variables
- Redeploy after setting

### Issue: Cookies not being set
**Check:**
- `NEXTAUTH_URL` matches your Vercel URL exactly
- `NEXTAUTH_URL` starts with `https://`
- No trailing slash in `NEXTAUTH_URL`

**Solution:**
- Verify `NEXTAUTH_URL` is correct
- Clear browser cookies
- Try again

## 📝 Quick Checklist

Before deploying, verify:
- [ ] `NEXTAUTH_URL` is set to your exact Vercel URL
- [ ] `NEXTAUTH_URL` starts with `https://`
- [ ] `NEXTAUTH_URL` has no trailing slash
- [ ] `NEXTAUTH_SECRET` is set (32+ characters)
- [ ] `MONGODB_URI` is set correctly
- [ ] All variables are set for **Production** environment
- [ ] Redeployed after setting variables

## 🚀 After Setting Variables

1. **Redeploy** your application
2. **Clear browser cookies** and cache
3. **Test login** with both student and admin accounts
4. **Check cookies** in DevTools → Application → Cookies
5. **Verify** no redirect loops

Your authentication should now work! 🎉

