# Socket.IO Server for QickBite

Standalone Socket.IO server for production deployment on Render, Railway, or any long-running server platform.

## 🚀 Quick Start

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your values:
```env
MONGODB_URI=your-mongodb-connection-string
PORT=3001
ALLOWED_ORIGINS=http://localhost:3000
NEXT_PUBLIC_VERCEL_URL=http://localhost:3000
```

4. Start server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Production Deployment

See [PRODUCTION_DEPLOYMENT.md](../PRODUCTION_DEPLOYMENT.md) for detailed deployment instructions.

## 📡 API Endpoints

### Health Check
```
GET /health
```
Returns server status and connection count.

## 🔌 Socket.IO Events

### Client → Server

#### `join-room`
Join a room based on user role.
```javascript
socket.emit('join-room', {
  room: 'admin', // or 'customer'
  userType: 'admin', // or 'customer'
  userId: 'user123' // optional, for customer personal room
})
```

#### `order-placed`
Emit when a customer places a new order.
```javascript
socket.emit('order-placed', {
  orderId: 'QB-123456',
  userId: 'user123',
  userName: 'John Doe',
  userEmail: 'john@example.com',
  items: [...],
  totalAmount: 250.00,
  status: 'pending',
  createdAt: '2024-01-01T12:00:00Z'
})
```

#### `order-status-update`
Emit when admin updates order status.
```javascript
socket.emit('order-status-update', {
  orderId: 'QB-123456',
  status: 'accepted', // or 'preparing', 'ready'
  userId: 'user123',
  estimatedTime: 15 // optional, in minutes
})
```

### Server → Client

#### `new-order` (Admin only)
Received when a new order is placed.
```javascript
socket.on('new-order', (data) => {
  console.log('New order:', data.order)
})
```

#### `order-status-changed` (Customer only)
Received when order status is updated.
```javascript
socket.on('order-status-changed', (data) => {
  console.log('Order status:', data.status)
})
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | Yes |
| `PORT` | Server port (auto-set by Render/Railway) | No (default: 3001) |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed origins | Yes |
| `NEXT_PUBLIC_VERCEL_URL` | Your Vercel app URL (for CORS) | Yes |

## 🏗️ Architecture

This server runs separately from the Next.js app:

- **Next.js (Vercel)**: Handles HTTP requests, API routes, and frontend
- **Socket Server (Render/Railway)**: Handles WebSocket connections
- **MongoDB Atlas**: Shared database for both

## 📝 Notes

- Socket path is `/socket.io` (not `/api/socket`)
- CORS is configured to allow your Vercel domain
- MongoDB connection is established on server start
- Server supports graceful shutdown

## 🐛 Troubleshooting

### Connection Issues
- Verify `ALLOWED_ORIGINS` includes your Vercel URL
- Check CORS configuration matches your frontend
- Ensure `NEXT_PUBLIC_SOCKET_URL` is set in Next.js

### MongoDB Issues
- Verify `MONGODB_URI` is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has proper permissions

