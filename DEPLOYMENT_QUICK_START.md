# 🚀 Quick Deployment Checklist

## Pre-Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelist configured (0.0.0.0/0 for development)
- [ ] Socket server code ready in `socket-server/` folder
- [ ] Environment variables documented

## Step-by-Step Deployment

### 1️⃣ Deploy Socket Server (Render)

1. Go to [render.com](https://render.com) → New Web Service
2. Connect GitHub repo
3. Settings:
   - **Name**: `qickbite-socket-server`
   - **Environment**: `Node`
   - **Build Command**: `cd socket-server && npm install`
   - **Start Command**: `cd socket-server && npm start`
4. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://...
   ALLOWED_ORIGINS=https://your-app.vercel.app
   NEXT_PUBLIC_VERCEL_URL=https://your-app.vercel.app
   ```
5. Deploy → Copy URL (e.g., `https://qickbite-socket.onrender.com`)

### 2️⃣ Deploy Next.js (Vercel)

1. Go to [vercel.com](https://vercel.com) → Add New Project
2. Import GitHub repo
3. Settings:
   - **Framework**: Next.js
   - **Root Directory**: `./`
4. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://...
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXT_PUBLIC_SOCKET_URL=https://qickbite-socket.onrender.com
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   GMAIL_USER=...
   GMAIL_APP_PASSWORD=...
   ```
5. Deploy

### 3️⃣ Update Socket Server CORS

After Vercel deployment, update Socket Server:
1. Go to Render dashboard
2. Update `ALLOWED_ORIGINS` with your actual Vercel URL
3. Redeploy

### 4️⃣ Test

- [ ] Visit `https://your-app.vercel.app`
- [ ] Check browser console: "🔌 Connected to socket"
- [ ] Test real-time features
- [ ] Check Socket server health: `https://your-socket.onrender.com/health`

## 🔗 Important URLs

- **Next.js App**: `https://your-app.vercel.app`
- **Socket Server**: `https://your-socket.onrender.com`
- **Health Check**: `https://your-socket.onrender.com/health`

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| Socket not connecting | Check `NEXT_PUBLIC_SOCKET_URL` is set |
| CORS error | Update `ALLOWED_ORIGINS` in socket server |
| MongoDB connection failed | Check IP whitelist in Atlas |
| Build fails | Verify all env vars are set |

## 📚 Full Guide

See [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) for detailed explanation.

