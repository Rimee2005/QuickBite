/**
 * Production Socket.IO Server
 * 
 * This is a standalone Express + Socket.IO server that runs separately from Next.js
 * Deploy this to Render, Railway, or any long-running server platform
 * 
 * Why separate?
 * - Vercel serverless functions have a 10-second timeout
 * - WebSocket connections need persistent connections
 * - Serverless functions can't maintain state between requests
 */

require('dotenv').config()
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const mongoose = require('mongoose')

const app = express()
const httpServer = http.createServer(app)
const PORT = process.env.PORT || 3001

// MongoDB Connection
const connectMongoDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables')
    }
    
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB Atlas')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

// Initialize Socket.IO with CORS
const io = new Server(httpServer, {
  path: '/socket.io',
  cors: {
    origin: process.env.NEXT_PUBLIC_VERCEL_URL 
      ? [
          `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`,
          `https://${process.env.NEXT_PUBLIC_VERCEL_URL.replace('https://', '')}`,
          process.env.NEXT_PUBLIC_VERCEL_URL,
          ...(process.env.ALLOWED_ORIGINS?.split(',') || [])
        ]
      : process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    connections: io.sockets.sockets.size 
  })
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
    console.log('🛒 New order received:', orderData.orderId)
    
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
    console.log('📋 Order status update:', updateData.orderId)
    
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
      items,
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

/**
 * Helper function to generate status messages with order items
 */
function getStatusMessage(status, orderId, estimatedTime, items) {
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

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectMongoDB()
    
    // Start HTTP server
    httpServer.listen(PORT, () => {
      console.log(`🚀 Socket.IO server running on port ${PORT}`)
      console.log(`🔌 Socket.IO path: /socket.io`)
      console.log(`🌐 Health check: http://localhost:${PORT}/health`)
      console.log(`📡 Allowed origins:`, process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...')
  httpServer.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed')
      process.exit(0)
    })
  })
})

startServer()

