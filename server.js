/**
 * Custom Next.js Server with Socket.IO
 * This file sets up Socket.IO alongside Next.js
 * 
 * To run: node server.js (instead of npm run dev)
 * Or update package.json scripts to use this server
 */

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Initialize Socket.IO
  const io = new Server(httpServer, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: dev
        ? ['http://localhost:3000', 'http://127.0.0.1:3000']
        : process.env.NEXTAUTH_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  })

  // Socket.IO connection handling
  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id)

    // Handle user joining rooms based on role
    socket.on('join-room', (data) => {
      const { room, userId, userType } = data || {}
      
      if (room) {
        socket.join(room)
        console.log(`👤 Socket ${socket.id} joined room: ${room}`)
      }
      
      // If user is a customer, also join their personal room
      if (userType === 'customer' && userId) {
        socket.join(`customer-${userId}`)
        console.log(`👤 Socket ${socket.id} joined personal room: customer-${userId}`)
      }
    })

    // Handle new orders from customers
    socket.on('order-placed', (orderData) => {
      console.log('🛒 New order received:', orderData)
      
      // Broadcast to all admin users in the 'admin' room
      io.to('admin').emit('new-order', {
        type: 'new-order',
        order: orderData,
        timestamp: new Date().toISOString(),
        message: `New order #${orderData.orderId} from ${orderData.userName}`,
      })
      
      console.log(`📢 Notified admins about order ${orderData.orderId}`)
    })

    // Handle order status updates from admin
    socket.on('order-status-update', (updateData) => {
      console.log('📋 Order status update:', updateData)
      
      const { orderId, status, userId, estimatedTime, items } = updateData || {}
      
      if (!orderId || !status || !userId) {
        console.error('Invalid order status update data')
        return
      }
      
      // Notify the specific customer about their order status
      io.to(`customer-${userId}`).emit('order-status-changed', {
        type: 'status-update',
        orderId,
        status,
        estimatedTime,
        items, // Include order items
        timestamp: new Date().toISOString(),
        message: getStatusMessage(status, orderId, estimatedTime, items),
      })
      
      console.log(`📢 Notified customer ${userId} about order ${orderId} status: ${status}`)
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id)
    })

    // Handle errors
    socket.on('error', (error) => {
      console.error('🔥 Socket error:', error)
    })
  })

  httpServer
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`🚀 Ready on http://${hostname}:${port}`)
      console.log(`🔌 Socket.IO server initialized on /api/socket`)
    })
})

/**
 * Helper function to generate status messages with order items
 */
function getStatusMessage(status, orderId, estimatedTime, items) {
  // Format order items: "2x Burger, 1x Pizza"
  const itemsText = items && items.length > 0
    ? items.map(item => `${item.quantity}x ${item.name}`).join(', ')
    : 'Your order'
  
  switch (status) {
    case 'accepted':
      return `${itemsText} has been accepted!${estimatedTime ? ` Estimated time: ${estimatedTime} minutes` : ''}`
    case 'preparing':
      return `${itemsText} is being prepared! 🍳`
    case 'ready':
      return `${itemsText} is ready for pickup! 🎉`
    case 'completed':
      return `${itemsText} has been completed! ✅`
    case 'cancelled':
      return `${itemsText} has been cancelled`
    default:
      return `${itemsText} status updated to ${status}`
  }
}

