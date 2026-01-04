# Real-Time Order Management with Socket.IO

This document explains how the real-time order management system works using Socket.IO.

## 🚀 Quick Start

### 1. Start the Server

Instead of using `npm run dev`, use the custom server that includes Socket.IO:

```bash
npm run dev:socket
```

Or manually:
```bash
node server.js
```

This starts both Next.js and Socket.IO server on port 3000.

### 2. How It Works

#### **Order Flow:**

1. **Customer places order** → Order saved to MongoDB → Socket.IO emits `order-placed` event
2. **Admin receives notification** → New order appears instantly on admin dashboard
3. **Admin updates status** → Status saved to MongoDB → Socket.IO emits `order-status-update` event
4. **Customer receives update** → Order status page updates in real-time

## 📡 Socket.IO Events

### Client → Server Events

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

### Server → Client Events

#### `new-order` (Admin only)
Received when a new order is placed.
```javascript
socket.on('new-order', (data) => {
  console.log('New order:', data.order)
  // data.order contains the full order object
})
```

#### `order-status-changed` (Customer only)
Received when order status is updated.
```javascript
socket.on('order-status-changed', (data) => {
  console.log('Status updated:', data.status)
  // data.orderId, data.status, data.estimatedTime
})
```

## 🔧 Implementation Details

### Frontend Hook: `useSocket`

Located in `hooks/useSocket.ts`, this hook provides:

```typescript
const {
  socket,           // Socket instance
  isConnected,      // Connection status
  notifications,    // Array of notifications
  emitNewOrder,     // Function to emit new order
  emitStatusUpdate, // Function to emit status update
  clearNotifications,
  removeNotification
} = useSocket('admin' | 'customer', userId?)
```

### Usage Examples

#### Admin Dashboard
```typescript
const { isConnected, notifications, emitStatusUpdate } = useSocket('admin')

// Listen for new orders
useEffect(() => {
  if (notifications.length > 0) {
    const latest = notifications[0]
    if (latest.type === 'new-order') {
      // Add new order to list
      setOrders(prev => [latest.data, ...prev])
    }
  }
}, [notifications])

// Update order status
const updateStatus = async (orderId, status, userId, estimatedTime) => {
  // Update via API
  await fetch(`/api/orders/${orderId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status, estimatedTime })
  })
  
  // Emit socket event
  emitStatusUpdate({ orderId, status, userId, estimatedTime })
}
```

#### Customer Order Status
```typescript
const { notifications } = useSocket('customer', user.id)

// Listen for status updates
useEffect(() => {
  if (notifications.length > 0) {
    const latest = notifications[0]
    if (latest.type === 'status-update' && latest.data.orderId === orderId) {
      setStatus(latest.data.status)
      setEstimatedTime(latest.data.estimatedTime)
    }
  }
}, [notifications, orderId])
```

## 📁 File Structure

```
├── server.js                    # Custom Next.js server with Socket.IO
├── app/
│   ├── api/
│   │   ├── orders/
│   │   │   ├── route.ts        # GET, POST orders
│   │   │   └── [id]/route.ts   # GET, PATCH specific order
│   │   └── socket/route.ts     # Socket.IO route handler
│   ├── admin/
│   │   └── dashboard/page.tsx # Admin dashboard with real-time orders
│   └── student/
│       ├── cart/page.tsx       # Place order (emits socket event)
│       └── order-status/page.tsx # View order status (listens for updates)
├── hooks/
│   └── useSocket.ts            # React hook for Socket.IO
└── lib/
    └── models/
        └── order.ts            # MongoDB Order model
```

## 🎯 Order Status Flow

1. **pending** → Order just placed, waiting for admin
2. **accepted** → Admin accepted with ETA
3. **preparing** → Order is being prepared
4. **ready** → Order ready for pickup
5. **completed** → Order picked up
6. **cancelled** → Order cancelled

## 🔒 Security Notes

- Socket.IO connections are authenticated via NextAuth session
- Only admins can update order status
- Customers can only see their own orders
- All orders are persisted in MongoDB

## 🐛 Troubleshooting

### Socket not connecting?
1. Make sure you're using `npm run dev:socket` (not `npm run dev`)
2. Check browser console for connection errors
3. Verify Socket.IO server is running (check terminal logs)

### Orders not appearing in real-time?
1. Check if Socket.IO connection is established (`isConnected` should be `true`)
2. Verify you're in the correct room (`admin` for admin, `customer-{userId}` for customers)
3. Check server logs for emitted events

### Status updates not received?
1. Verify the order ID matches
2. Check if customer is in the correct room (`customer-{userId}`)
3. Ensure `emitStatusUpdate` is called after API update succeeds

## 📝 Next Steps

- Add order cancellation feature
- Add admin-to-customer messaging
- Add order history with real-time updates
- Add push notifications for mobile

