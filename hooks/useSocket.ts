import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketNotification {
  id: string
  type: 'new-order' | 'status-update' | 'admin-message' | 'info'
  message: string
  data?: any
  timestamp: string
}

export const useSocket = (userRole?: 'admin' | 'customer', userId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState<SocketNotification[]>([])
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Only initialize socket if userRole is provided
    if (!userRole) {
      console.log('🔌 Socket initialization skipped: userRole not provided')
      return
    }

    // Prevent multiple initializations
    if (socketRef.current?.connected || socketRef.current?.connecting) {
      console.log('🔌 Socket already initialized, skipping...')
      return
    }

    // Get socket URL from environment variable or fallback
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000'
    
    // Determine socket path based on URL
    // If using external server (Render), use /socket.io
    // If using local server.js, use /api/socket
    const isExternalServer = socketUrl.includes('render.com') || 
                             socketUrl.includes('railway.app') || 
                             socketUrl.includes('onrender.com') ||
                             process.env.NEXT_PUBLIC_SOCKET_URL
    
    const socketPath = isExternalServer ? '/socket.io' : '/api/socket'

    console.log('🔌 Initializing Socket.IO connection:', {
      url: socketUrl,
      path: socketPath,
      userRole,
      userId
    })

    const socketInstance = io(socketUrl, {
      path: socketPath,
      transports: ['websocket', 'polling'],
      timeout: 10000, // 10 second timeout for external servers
      reconnection: true,
      reconnectionAttempts: Infinity, // Keep trying to reconnect
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      autoConnect: true,
      forceNew: true, // Force new connection to avoid reuse issues
    })

    socketRef.current = socketInstance
    setSocket(socketInstance)

    // Set a timeout to handle connection failures gracefully
    const connectionTimeout = setTimeout(() => {
      if (!socketInstance.connected) {
        console.warn('⚠️ Socket.IO connection timeout. Real-time features may not be available.')
        setIsConnected(false)
        // Don't disconnect, let it keep trying in the background
      }
    }, 6000)

    socketInstance.on('connect', () => {
      clearTimeout(connectionTimeout)
      setIsConnected(true)
      console.log('✅ Socket.IO connected successfully:', {
        socketId: socketInstance.id,
        userRole,
        userId,
        url: socketUrl
      })

      // Join appropriate rooms based on user role
      if (userRole === 'admin') {
        console.log('👤 Joining admin room...')
        socketInstance.emit('join-room', { room: 'admin', userType: 'admin' })
      } else if (userRole === 'customer') {
        console.log('👤 Joining customer rooms...', { userId })
        socketInstance.emit('join-room', { 
          room: 'customer', 
          userType: 'customer',
          userId: userId 
        })
        if (userId) {
          socketInstance.emit('join-room', { 
            room: `customer-${userId}`, 
            userType: 'customer',
            userId: userId 
          })
        }
      }
    })

    socketInstance.on('disconnect', (reason) => {
      console.log('❌ Socket.IO disconnected:', {
        reason,
        socketId: socketInstance.id,
        userRole,
        userId
      })
      setIsConnected(false)
    })

    socketInstance.on('connect_error', (error) => {
      // Only log error, don't break the app
      console.warn('⚠️ Socket.IO connection error (app will continue without real-time features):', error.message)
      setIsConnected(false)
      clearTimeout(connectionTimeout)
    })

    socketInstance.on('reconnect_attempt', () => {
      console.log('🔄 Attempting to reconnect to Socket.IO...')
    })

    socketInstance.on('reconnect_failed', () => {
      console.warn('⚠️ Socket.IO reconnection failed. Real-time features disabled.')
      setIsConnected(false)
    })

    // Listen for new orders (admin only)
    socketInstance.on('new-order', (data) => {
      console.log('📥 Received new-order event:', data.order?.orderId || data.orderId)
      addNotification({
        id: Date.now().toString(),
        type: 'new-order',
        message: data.message || 'New order received',
        data: data.order,
        timestamp: data.timestamp
      })
    })

    // Listen for order status changes (customer only)
    socketInstance.on('order-status-changed', (data) => {
      console.log('📥 Received order-status-changed event:', {
        orderId: data.orderId,
        status: data.status,
        estimatedTime: data.estimatedTime,
        message: data.message,
        timestamp: data.timestamp,
        userId
      })
      addNotification({
        id: Date.now().toString(),
        type: 'status-update',
        message: data.message || 'Order status updated',
        data: {
          orderId: data.orderId,
          status: data.status,
          estimatedTime: data.estimatedTime,
          items: data.items, // Include items in notification
        },
        timestamp: data.timestamp
      })
    })

    socketInstance.on('admin-message', (data) => {
      addNotification({
        id: Date.now().toString(),
        type: 'admin-message',
        message: data.message || 'New message from admin',
        data: data.data,
        timestamp: data.timestamp
      })
    })

    return () => {
      console.log('🧹 Cleaning up Socket.IO connection:', { userRole, userId })
      if (socketInstance.connected) {
        socketInstance.disconnect()
      }
      socketRef.current = null
      setSocket(null)
      setIsConnected(false)
    }
  }, [userRole, userId]) // Only re-run if userRole or userId changes

  const addNotification = (notification: SocketNotification) => {
    // Prevent duplicate notifications
    setNotifications((prev: SocketNotification[]) => {
      const exists = prev.some(n => n.id === notification.id)
      if (exists) {
        console.log('⚠️ Duplicate notification skipped:', notification.id)
        return prev
      }
      return [
        notification,
        ...prev.slice(0, 9) // Keep max 10 notifications
      ]
    })

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev: SocketNotification[]) =>
        prev.filter((n: SocketNotification) => n.id !== notification.id)
      )
    }, 5000)
  }

  const emitNewOrder = (orderData: any) => {
    if (socketRef.current?.connected) {
      console.log('✅ Emitting order-placed event:', orderData.orderId)
      socketRef.current.emit('order-placed', orderData)
    } else {
      console.warn('⚠️ Socket not connected. Cannot emit order. Will retry when connected.')
      // Try to emit when socket connects
      if (socketRef.current) {
        socketRef.current.once('connect', () => {
          console.log('🔄 Retrying order emission after connection')
          socketRef.current?.emit('order-placed', orderData)
        })
      }
    }
  }

  const emitStatusUpdate = (updateData: {
    orderId: string
    status: string
    userId: string
    estimatedTime?: number
    items?: Array<{ name: string; quantity: number; price: number }>
  }) => {
    if (socketRef.current?.connected) {
      console.log('✅ Emitting order-status-update event:', updateData.orderId, updateData.status)
      socketRef.current.emit('order-status-update', updateData)
    } else {
      console.warn('⚠️ Socket not connected. Cannot emit status update. Will retry when connected.')
      // Try to emit when socket connects
      if (socketRef.current) {
        socketRef.current.once('connect', () => {
          console.log('🔄 Retrying status update emission after connection')
          socketRef.current?.emit('order-status-update', updateData)
        })
      }
    }
  }

  const sendAdminMessage = (messageData: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('admin-message', messageData)
    }
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const removeNotification = (id: string) => {
    setNotifications((prev: SocketNotification[]) =>
      prev.filter((n: SocketNotification) => n.id !== id)
    )
  }

  return {
    socket,
    isConnected,
    notifications,
    emitNewOrder,
    emitStatusUpdate,
    sendAdminMessage,
    clearNotifications,
    removeNotification,
  }
}
