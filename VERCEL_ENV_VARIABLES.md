# Vercel Environment Variables Setup

## Required Environment Variables

### 1. NextAuth Configuration (CRITICAL)

```env
# Your Vercel deployment URL (MUST match exactly)
NEXTAUTH_URL=https://your-app.vercel.app

# Secret for JWT signing (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-secret-key-here-minimum-32-characters
```

**Important:**
- `NEXTAUTH_URL` must be your **exact Vercel URL** (e.g., `https://qickbite.vercel.app`)
- Include `https://` protocol
- No trailing slash
- Must match the domain where cookies are set

### 2. MongoDB Connection

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickbite?retryWrites=true&w=majority
```

### 3. Socket.IO Server (If using external server)

```env
NEXT_PUBLIC_SOCKET_URL=https://qickbite-socket-server.onrender.com
```

### 4. Cloudinary (Image Upload)

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 5. Email Configuration (Nodemailer)

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🔧 How to Set in Vercel

1. **Go to Vercel Dashboard:**
   - Navigate to your project
   - Click **Settings** → **Environment Variables**

2. **Add Each Variable:**
   - Click **Add New**
   - Enter variable name
   - Enter variable value
   - Select environment (Production, Preview, Development)
   - Click **Save**

3. **Redeploy:**
   - After adding variables, go to **Deployments**
   - Click **Redeploy** on latest deployment
   - Or push a new commit to trigger redeploy

## ⚠️ Common Mistakes

### Mistake 1: Wrong NEXTAUTH_URL
❌ `NEXTAUTH_URL=https://your-app.vercel.app/` (trailing slash)
✅ `NEXTAUTH_URL=https://your-app.vercel.app` (no trailing slash)

❌ `NEXTAUTH_URL=http://your-app.vercel.app` (HTTP instead of HTTPS)
✅ `NEXTAUTH_URL=https://your-app.vercel.app` (HTTPS required)

### Mistake 2: Missing NEXTAUTH_SECRET
❌ Not set or too short
✅ Generate with: `openssl rand -base64 32`

### Mistake 3: Wrong Environment
❌ Set only in Development
✅ Set in **Production** (and Preview if needed)

### Mistake 4: Mismatched URLs
❌ `NEXTAUTH_URL` doesn't match actual Vercel URL
✅ Must match exactly (check Vercel project settings)

## 🔍 Verification

### Check Environment Variables:
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Verify all required variables are set
3. Check they're set for **Production** environment

### Test After Deployment:
1. Login to your app
2. Open Browser DevTools → Application → Cookies
3. Should see `__Secure-next-auth.session-token` cookie
4. Should redirect to dashboard successfully

## 📝 Quick Checklist

- [ ] `NEXTAUTH_URL` set to exact Vercel URL (HTTPS, no trailing slash)
- [ ] `NEXTAUTH_SECRET` set (32+ characters)
- [ ] `MONGODB_URI` set correctly
- [ ] `NEXT_PUBLIC_SOCKET_URL` set (if using external socket server)
- [ ] All variables set for **Production** environment
- [ ] Redeployed after setting variables

## 🚀 Generate NEXTAUTH_SECRET

```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/32
```

## 💡 Pro Tips

1. **Use Vercel CLI:**
   ```bash
   vercel env add NEXTAUTH_URL production
   vercel env add NEXTAUTH_SECRET production
   ```

2. **Verify in Runtime:**
   - Add temporary log: `console.log(process.env.NEXTAUTH_URL)`
   - Check Vercel function logs

3. **Test Locally:**
   - Copy `.env.local` to match production
   - Test with `npm run build && npm start`

