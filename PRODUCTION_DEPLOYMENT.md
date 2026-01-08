# 🚀 Production Deployment Guide: Next.js + Socket.IO + MongoDB

## 📋 Table of Contents
1. [Why Socket.IO Can't Run on Vercel](#why-socketio-cant-run-on-vercel)
2. [Architecture Overview](#architecture-overview)
3. [Socket Server Setup](#socket-server-setup)
4. [Environment Variables](#environment-variables)
5. [Deployment Steps](#deployment-steps)
6. [Common Mistakes](#common-mistakes)

---

## ❌ Why Socket.IO Can't Run on Vercel

### The Problem:
1. **Serverless Functions**: Vercel uses serverless functions that have a **10-second timeout**
2. **No Persistent Connections**: WebSocket connections need to stay open indefinitely
3. **Cold Starts**: Each request may spin up a new function instance, losing connection state
4. **Stateless**: Serverless functions can't maintain state between requests

### What Happens:
- Socket connections drop after 10 seconds
- Reconnections fail because the function instance is gone
- Real-time features break completely

### Solution:
Run Socket.IO on a **long-running server** (Render, Railway, DigitalOcean, etc.) that maintains persistent connections.

---

## 🏗️ Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────┐
│   Next.js App   │         │  Socket.IO       │         │   MongoDB    │
│   (Vercel)      │────────▶│  Server          │────────▶│   Atlas      │
│                 │  HTTP   │  (Render/Railway) │  TCP    │              │
│  - Frontend     │         │                  │         │              │
│  - API Routes   │         │  - WebSockets    │         │  - Database  │
│  - useSocket    │◀────────│  - Real-time      │         │              │
│                 │ WebSocket│  - Rooms         │         │              │
└─────────────────┘         └──────────────────┘         └──────────────┘
```

**Flow:**
1. Next.js app runs on Vercel (frontend + API routes)
2. Socket.IO server runs on Render/Railway (WebSocket connections)
3. Both connect to MongoDB Atlas (shared database)
4. Frontend connects to Socket.IO server via WebSocket

---

## 🔧 Socket Server Setup

### File Structure:
```
socket-server/
├── index.js          # Main server file
├── package.json      # Dependencies
└── .env.example      # Environment variables template
```

### Key Features:
- ✅ Express server for health checks
- ✅ Socket.IO with proper CORS
- ✅ MongoDB connection
- ✅ Room-based messaging
- ✅ Graceful shutdown

---

## 🔐 Environment Variables

### 1. Vercel (Next.js App)

Add these in **Vercel Dashboard → Settings → Environment Variables**:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/qickbite?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_SECRET=your-super-secret-key-here-min-32-chars
NEXTAUTH_URL=https://your-app.vercel.app

# Socket.IO Server URL (IMPORTANT!)
NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.onrender.com

# Cloudinary (if using)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Nodemailer)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

### 2. Socket Server (Render/Railway)

Add these in **Render Dashboard → Environment** or **Railway → Variables**:

```bash
# MongoDB (same as Vercel)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/qickbite?retryWrites=true&w=majority

# Server Port (Render/Railway sets this automatically)
PORT=3001

# Allowed Origins (comma-separated)
ALLOWED_ORIGINS=https://your-app.vercel.app,https://www.your-app.vercel.app

# Vercel URL (for CORS)
NEXT_PUBLIC_VERCEL_URL=https://your-app.vercel.app
```

---

## 📦 Deployment Steps

### Step 1: Deploy Socket Server to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up/login

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**
   ```
   Name: qickbite-socket-server
   Environment: Node
   Build Command: cd socket-server && npm install
   Start Command: cd socket-server && npm start
   ```

4. **Add Environment Variables**
   - Add all variables from "Socket Server" section above
   - Click "Save Changes"

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Copy the service URL (e.g., `https://qickbite-socket.onrender.com`)

### Step 2: Deploy Socket Server to Railway (Alternative)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up/login

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service**
   - Click "Add Service" → "GitHub Repo"
   - Select repository
   - Set Root Directory: `socket-server`
   - Set Start Command: `npm start`

4. **Add Environment Variables**
   - Go to "Variables" tab
   - Add all variables from "Socket Server" section

5. **Deploy**
   - Railway auto-deploys on push
   - Copy the service URL from "Settings" → "Domains"

### Step 3: Update Next.js useSocket Hook

Update `hooks/useSocket.ts` to use the external Socket.IO server:

```typescript
// hooks/useSocket.ts
const socketInstance = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
  {
    path: '/socket.io', // Important: match socket server path
    transports: ['websocket', 'polling'],
    timeout: 5000,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    autoConnect: true,
  }
)
```

### Step 4: Deploy Next.js to Vercel

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Project**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   ```

3. **Add Environment Variables**
   - Go to "Settings" → "Environment Variables"
   - Add all variables from "Vercel" section above
   - **IMPORTANT**: Add `NEXT_PUBLIC_SOCKET_URL` with your Render/Railway URL

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-app.vercel.app`

### Step 5: Configure MongoDB Atlas

1. **Whitelist IP Addresses**
   - Go to MongoDB Atlas Dashboard
   - Click "Network Access" → "Add IP Address"
   - Add `0.0.0.0/0` (allows all IPs) OR specific IPs:
     - Vercel IPs (check Vercel docs)
     - Render IPs (check Render docs)
     - Railway IPs (check Railway docs)

2. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username and password
   - Save credentials (you'll need them for MONGODB_URI)

3. **Get Connection String**
   - Go to "Database" → "Connect"
   - Click "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Use this as `MONGODB_URI`

---

## ⚠️ Common Mistakes

### 1. Wrong Socket URL
❌ **Wrong:**
```typescript
const socketInstance = io('http://localhost:3000')
```

✅ **Correct:**
```typescript
const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL)
```

### 2. CORS Not Configured
❌ **Wrong:**
```javascript
cors: {
  origin: '*', // Too permissive
}
```

✅ **Correct:**
```javascript
cors: {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://your-app.vercel.app'],
  credentials: true,
}
```

### 3. Wrong Socket Path
❌ **Wrong:**
```typescript
path: '/api/socket' // Doesn't match server
```

✅ **Correct:**
```typescript
path: '/socket.io' // Matches server path
```

### 4. Missing NEXT_PUBLIC_ Prefix
❌ **Wrong:**
```bash
SOCKET_URL=https://... # Not accessible in browser
```

✅ **Correct:**
```bash
NEXT_PUBLIC_SOCKET_URL=https://... # Accessible in browser
```

### 5. MongoDB Connection String Issues
❌ **Wrong:**
```bash
MONGODB_URI=mongodb://localhost:27017 # Local connection
```

✅ **Correct:**
```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority
```

### 6. Not Testing Locally First
Always test the socket server locally before deploying:
```bash
cd socket-server
npm install
npm start
```

Then test connection from Next.js:
```bash
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001 npm run dev
```

---

## 🧪 Testing Checklist

After deployment, test:

- [ ] Socket server health check: `https://your-socket-server.onrender.com/health`
- [ ] Next.js app loads: `https://your-app.vercel.app`
- [ ] Socket connection works (check browser console for "🔌 Connected to socket")
- [ ] Real-time notifications work
- [ ] Order status updates work
- [ ] MongoDB connection works (check logs)

---

## 📝 Quick Reference

### Socket Server URL Format:
- Render: `https://your-service.onrender.com`
- Railway: `https://your-service.up.railway.app`

### Environment Variable Naming:
- Client-side: Must start with `NEXT_PUBLIC_`
- Server-side: No prefix needed

### Port Configuration:
- Render/Railway: Set automatically via `PORT` env var
- Local: Use `3001` or any available port

---

## 🆘 Troubleshooting

### Socket Not Connecting?
1. Check `NEXT_PUBLIC_SOCKET_URL` is set correctly
2. Verify CORS allows your Vercel domain
3. Check browser console for errors
4. Verify socket server is running (check health endpoint)

### MongoDB Connection Failed?
1. Verify `MONGODB_URI` is correct
2. Check IP whitelist in Atlas
3. Verify database user credentials
4. Check network access settings

### Build Fails on Vercel?
1. Check all environment variables are set
2. Verify `NEXT_PUBLIC_` prefix for client-side vars
3. Check build logs for specific errors
4. Ensure `package.json` has correct scripts

---

## 📚 Additional Resources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Render Web Services](https://render.com/docs/web-services)
- [Railway Deployment](https://docs.railway.app/deploy)
- [Socket.IO CORS Guide](https://socket.io/docs/v4/handling-cors/)
- [MongoDB Atlas Connection](https://www.mongodb.com/docs/atlas/connect-to-cluster/)

---

**Need Help?** Check the logs:
- Vercel: Dashboard → Deployments → View Logs
- Render: Dashboard → Service → Logs
- Railway: Dashboard → Service → Logs

