# Quick Start: Socket.IO Connection

## 🚀 Setup (One Time)

Add to your `.env.local` file:
```env
NEXT_PUBLIC_SOCKET_URL=https://qickbite-socket-server.onrender.com
```

## ✅ What's Working

1. **Socket Connection**: Automatically connects to Render server
2. **Real-time Updates**: Order status updates appear instantly
3. **No Refresh Needed**: Updates work without page refresh
4. **Console Logs**: Detailed logging for debugging

## 🧪 Test It

1. **Start your app:**
   ```bash
   npm run dev
   ```

2. **Open two browsers:**
   - Admin: `http://localhost:3000/admin/dashboard`
   - Student: `http://localhost:3000/student/dashboard`

3. **Test real-time updates:**
   - Student: Place an order
   - Admin: Accept/Update order status
   - Student: See update instantly (no refresh!)

## 🔍 Check Connection

**Browser Console (F12):**
- Look for: `✅ Socket.IO connected successfully`
- Should see: `👤 Joining admin/customer rooms...`

**If you see "Offline":**
- Check `NEXT_PUBLIC_SOCKET_URL` in `.env.local`
- Restart dev server: `npm run dev`
- Check browser console for errors

## 📊 What You'll See

### Admin Dashboard:
- "Live" badge when connected
- New orders appear instantly
- Status updates sent to customers

### Student Dashboard:
- Order status updates in real-time
- Toast notifications for status changes
- No page refresh needed

## 🐛 Troubleshooting

**Socket shows "Offline":**
1. Check `.env.local` has `NEXT_PUBLIC_SOCKET_URL`
2. Restart dev server
3. Check browser console

**Updates not appearing:**
1. Check browser console for socket events
2. Verify both admin and student are connected
3. Check Socket.IO server is running on Render

