# Socket.IO Setup Guide

## Environment Variables

Add the following to your `.env.local` file:

```env
# Socket.IO Server URL (for production)
# Leave empty for local development (will use server.js on same port)
# For production, set to your deployed Socket.IO server URL
NEXT_PUBLIC_SOCKET_URL=https://qickbite-socket-server.onrender.com
```

## Local Development

For local development, you have two options:

### Option 1: Use Combined Server (Recommended)
```bash
npm run dev:socket
```
This runs `server.js` which includes both Next.js and Socket.IO on port 3000.

### Option 2: Use Separate Socket Server
**Terminal 1:**
```bash
npm run dev
```

**Terminal 2:**
```bash
cd socket-server
npm install
npm start
```

## Production Setup

1. **Deploy Socket.IO Server** to Render/Railway
2. **Set Environment Variable** in your Next.js deployment (Vercel):
   ```
   NEXT_PUBLIC_SOCKET_URL=https://qickbite-socket-server.onrender.com
   ```
3. **Deploy Next.js App** to Vercel

## Connection Flow

1. Socket connects to `NEXT_PUBLIC_SOCKET_URL` or falls back to `localhost:3000`
2. Path is automatically determined:
   - External server (Render/Railway): `/socket.io`
   - Local server.js: `/api/socket`
3. User joins appropriate rooms:
   - Admin: `admin` room
   - Customer: `customer` and `customer-{userId}` rooms

## Debugging

Check browser console for:
- `🔌 Initializing Socket.IO connection` - Connection starting
- `✅ Socket.IO connected successfully` - Connected
- `❌ Socket.IO disconnected` - Disconnected
- `📥 Received order-status-changed event` - Status update received
- `📤 Emitting order status update` - Status update sent

## Troubleshooting

### Socket shows "Offline"
1. Check if Socket.IO server is running
2. Verify `NEXT_PUBLIC_SOCKET_URL` is set correctly
3. Check browser console for connection errors
4. Verify CORS settings on Socket.IO server

### Real-time updates not working
1. Check socket connection status in browser console
2. Verify user has joined correct rooms
3. Check Socket.IO server logs
4. Verify events are being emitted correctly

