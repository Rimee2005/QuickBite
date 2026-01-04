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
    const socketInstance = io(
      process.env.NODE_ENV === 'production'
        ? process.env.NEXTAUTH_URL || window.location.origin
        : 'http://localhost:3000',
      {
        path: '/api/socket',
        transports: ['websocket', 'polling'],
      }
    )

    socketRef.current = socketInstance
    setSocket(socketInstance)

    socketInstance.on('connect', () => {
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
      console.error('🔥 Connection error:', error)
      setIsConnected(false)
    })

    // Listen for new orders (admin only)
    socketInstance.on('new-order', (data) => {
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
      addNotification({
        id: Date.now().toString(),
        type: 'status-update',
        message: data.message || 'Order status updated',
        data: {
          orderId: data.orderId,
          status: data.status,
          estimatedTime: data.estimatedTime,
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
      socketRef.current.emit('order-placed', orderData)
    } else {
      console.warn('Socket not connected. Cannot emit order.')
    }
  }

  const emitStatusUpdate = (updateData: {
    orderId: string
    status: string
    userId: string
    estimatedTime?: number
  }) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('order-status-update', updateData)
    } else {
      console.warn('Socket not connected. Cannot emit status update.')
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
