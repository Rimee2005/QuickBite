# 🔧 Socket.IO Troubleshooting Guide

## Problem: Real-time updates only show after refresh

This means Socket.IO is not working. Follow these steps:

## ✅ Step 1: Check if Socket Server is Running

### Check Terminal
Look for these messages:
- ✅ `🔌 Socket.IO server initialized on /api/socket` - Server is running
- ✅ `🔌 Client connected: [socket-id]` - Client connected successfully
- ❌ No socket messages - Server is NOT running

### Check Browser Console
Open browser DevTools (F12) → Console tab:
- ✅ `🔌 Connected to socket` - Connection successful
- ⚠️ `⚠️ Socket.IO connection timeout` - Server not running
- ❌ `🔥 Connection error` - Connection failed

## ✅ Step 2: Start Socket Server

### Option A: Use Combined Server (Recommended)

**Stop current server** (Ctrl+C), then:

```bash
npm run dev:socket
```

You should see:
```
🚀 Ready on http://localhost:3000
🔌 Socket.IO server initialized on /api/socket
```

### Option B: Use Separate Socket Server

**Terminal 1** (Next.js):
```bash
npm run dev
```

**Terminal 2** (Socket Server):
```bash
cd socket-server
npm install  # First time only
npm start
```

## ✅ Step 3: Verify Connection

1. **Open Admin Dashboard**
   - Look for connection indicator (top right)
   - Green WiFi icon = Connected ✅
   - Red WiFi icon = Disconnected ❌

2. **Check Browser Console**
   - Should see: `🔌 Connected to socket`
   - Should see: `🔌 Admin Socket Status: { isConnected: true }`

3. **Test Real-time**
   - Place an order from student side
   - Should appear instantly in admin dashboard (no refresh needed)
   - Update order status from admin
   - Should update instantly on student order status page

## 🐛 Common Issues

### Issue 1: "Socket.IO connection timeout"
**Cause:** Socket server not running  
**Fix:** Run `npm run dev:socket` instead of `npm run dev`

### Issue 2: "Connection error"
**Cause:** Wrong socket path or port  
**Fix:** 
- Make sure you're using `server.js` (combined server)
- Or check `NEXT_PUBLIC_SOCKET_URL` environment variable

### Issue 3: Events not received
**Cause:** Not joined correct room  
**Fix:** Check browser console for:
- `👤 Socket [id] joined room: admin` (for admin)
- `👤 Socket [id] joined room: customer-[userId]` (for student)

### Issue 4: Events emitted but not received
**Cause:** Server not broadcasting correctly  
**Fix:** Check server terminal for:
- `📢 Notified admins about order [orderId]`
- `📢 Notified customer [userId] about order [orderId]`

## 📊 Debug Checklist

- [ ] Socket server is running (`npm run dev:socket`)
- [ ] Browser console shows "🔌 Connected to socket"
- [ ] Admin dashboard shows green WiFi icon
- [ ] Server terminal shows "🔌 Client connected"
- [ ] Browser console shows socket status logs
- [ ] Events are being emitted (check console logs)
- [ ] Events are being received (check console logs)

## 🔍 Debug Commands

### Check if port 3000 is in use:
```bash
lsof -ti:3000
```

### Check if socket server is running:
```bash
curl http://localhost:3000/api/socket
```

### Check browser console for:
```javascript
// Should see these logs:
🔌 Connected to socket
🔌 Admin Socket Status: { isConnected: true, notificationsCount: 0 }
📤 Emitting new order: QB-...
📥 Received new-order event: QB-...
```

## 💡 Quick Fix

If nothing works, try this:

1. **Stop all servers** (Ctrl+C in all terminals)
2. **Kill any processes on port 3000:**
   ```bash
   kill -9 $(lsof -ti:3000)
   ```
3. **Start fresh:**
   ```bash
   npm run dev:socket
   ```
4. **Clear browser cache and reload** (Ctrl+Shift+R)
5. **Check browser console** for connection messages

## 📝 Still Not Working?

1. Check `server.js` is in project root
2. Check `package.json` has `"dev:socket": "node server.js"`
3. Check browser console for specific error messages
4. Check server terminal for error messages
5. Verify MongoDB connection (Socket.IO needs DB for some features)

