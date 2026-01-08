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
      return
    }

    // In production, use external Socket.IO server (Render/Railway)
    // In development, use local server (server.js) or fallback to separate socket server
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL 
      || (process.env.NODE_ENV === 'production' 
        ? process.env.NEXTAUTH_URL || window.location.origin
        : window.location.origin) // Use same origin when using server.js (port 3000)

    // Determine socket path based on URL
    // If using server.js (localhost:3000), use /api/socket
    // If using separate socket server (localhost:3001), use /socket.io
    const socketPath = process.env.NEXT_PUBLIC_SOCKET_URL 
      ? '/socket.io' // Separate socket server
      : '/api/socket' // server.js (combined Next.js + Socket.IO)

    const socketInstance = io(socketUrl, {
      path: socketPath,
      transports: ['websocket', 'polling'],
      timeout: 5000, // 5 second timeout
      reconnection: true,
      reconnectionAttempts: 5, // Increased for production
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      autoConnect: true,
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
      console.log('🔌 Connected to socket')

      // Join appropriate rooms based on user role
      if (userRole === 'admin') {
        socketInstance.emit('join-room', { room: 'admin', userType: 'admin' })
      } else if (userRole === 'customer') {
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

    socketInstance.on('disconnect', () => {
      console.log('❌ Disconnected from socket')
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
      console.log('📥 Received order-status-changed event:', data.orderId, data.status)
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
      socketInstance.disconnect()
    }
  }, [userRole, userId])

  const addNotification = (notification: SocketNotification) => {
    setNotifications((prev: SocketNotification[]) => [
      notification,
      ...prev.slice(0, 9)
    ])

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
