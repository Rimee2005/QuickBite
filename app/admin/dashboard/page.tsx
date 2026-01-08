"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Check, Clock, Bell, LogOut, Settings, Menu, X, Wifi, WifiOff, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { useSocket } from "@/hooks/useSocket"
import { useAuth } from "@/contexts/auth-context"

interface OrderItem {
  menuItemId: string
  name: string
  quantity: number
  price: number
}

interface Order {
  _id?: string
  orderId: string
  userId: string
  userName: string
  userEmail: string
  items: OrderItem[]
  totalAmount: number
  status: "pending" | "accepted" | "preparing" | "ready" | "completed" | "cancelled"
  estimatedTime?: number
  createdAt: string
  updatedAt: string
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const warningShownRef = useRef(false)
  const { toast } = useToast()
  const router = useRouter()
  const { t } = useLanguage()
  const { user } = useAuth()
  const { isConnected, notifications, emitStatusUpdate } = useSocket('admin')

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        // Filter out completed and cancelled orders for active queue
        const activeOrders = data.orders.filter(
          (order: Order) => order.status !== 'completed' && order.status !== 'cancelled'
        )
        setOrders(activeOrders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setTimeout(() => {
        toast({
          title: t("admin.error_loading"),
          description: t("admin.failed_fetch"),
          variant: "destructive",
        })
      }, 0)
    } finally {
      setLoading(false)
    }
  }

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders()
  }, [])

  // Listen for new orders via Socket.IO
  const processedNotificationsRef = useRef<Set<string>>(new Set())
  const lastToastOrderIdRef = useRef<string | null>(null)
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Handle notifications - update orders only (toast removed to prevent infinite loops)
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0]
      if (latestNotification.type === 'new-order' && latestNotification.data) {
        const newOrder = latestNotification.data as Order
        const notificationId = latestNotification.id || newOrder.orderId
        
        // Skip if already processed
        if (processedNotificationsRef.current.has(notificationId)) {
          return
        }
        
        processedNotificationsRef.current.add(notificationId)
        console.log('📦 New order received via socket:', newOrder.orderId)
        
        // Check if order already exists to avoid duplicates
        setOrders((prev) => {
          const exists = prev.some(o => o.orderId === newOrder.orderId)
          if (exists) {
            console.log('Order already exists, skipping:', newOrder.orderId)
            return prev
          }
          return [newOrder, ...prev]
        })
        
        // Toast removed - causes infinite loop with Radix UI
        // Orders will still update in real-time, just no toast notification
      }
    }
  }, [notifications]) // Only depend on notifications array

  // Debug: Log socket connection status
  useEffect(() => {
    console.log('🔌 Admin Socket Status:', { isConnected, notificationsCount: notifications.length })
  }, [isConnected, notifications.length])

  // Show warning if socket is not connected (only once, no toast to avoid loops)
  useEffect(() => {
    if (!isConnected && !warningShownRef.current) {
      const timer = setTimeout(() => {
        if (!isConnected && !warningShownRef.current) {
          warningShownRef.current = true
          console.warn('⚠️ Socket.IO is not connected. Real-time features disabled.')
          console.warn('💡 To enable real-time updates, run: npm run dev:socket')
          // Removed toast to prevent infinite loops - use console warning instead
        }
      }, 3000)
      return () => clearTimeout(timer)
    } else if (isConnected) {
      // Reset warning flag when connected
      warningShownRef.current = false
    }
  }, [isConnected]) // Removed toast from dependencies

  // Update order status
  const updatingOrdersRef = useRef<Set<string>>(new Set())
  const updateOrderStatus = async (
    orderId: string, 
    status: 'accepted' | 'preparing' | 'ready',
    estimatedTime?: number
  ) => {
    // Prevent duplicate updates
    if (updatingOrdersRef.current.has(orderId)) {
      console.log('Order update already in progress:', orderId)
      return
    }
    
    try {
      updatingOrdersRef.current.add(orderId)
      
      const order = orders.find(o => o.orderId === orderId)
      if (!order) {
        updatingOrdersRef.current.delete(orderId)
        return
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, estimatedTime }),
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      const data = await response.json()
      const updatedOrder = data.order

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? updatedOrder : o))
      )
      
      // Remove from updating set after a delay
      setTimeout(() => {
        updatingOrdersRef.current.delete(orderId)
      }, 1000)

      // Emit socket event to notify customer (include order items)
      console.log('📤 Emitting status update:', { orderId: updatedOrder.orderId, status: updatedOrder.status, isConnected })
      emitStatusUpdate({
        orderId: updatedOrder.orderId,
        status: updatedOrder.status,
        userId: updatedOrder.userId,
        estimatedTime: updatedOrder.estimatedTime,
        items: updatedOrder.items, // Include order items
      })

      // Use setTimeout to call toast outside render cycle, with debounce
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current)
      }
      
      // Only show toast if this is a different order or enough time has passed
      if (lastToastOrderIdRef.current !== orderId) {
        lastToastOrderIdRef.current = orderId
        toastTimeoutRef.current = setTimeout(() => {
          toast({
            title: `${t("admin.status_updated")} ✅`,
            description: t("admin.status_updated_desc"),
          })
          toastTimeoutRef.current = null
        }, 100)
      }
    } catch (error: any) {
      console.error('Error updating order status:', error)
      updatingOrdersRef.current.delete(orderId)
      // Use setTimeout to call toast outside render cycle
      setTimeout(() => {
        toast({
          title: `${t("admin.error_updating")} ❌`,
          description: error.message || t("admin.error_updating_desc"),
          variant: "destructive",
        })
      }, 0)
    }
  }

  // Accept order (with ETA)
  const acceptOrder = (orderId: string, eta: number) => {
    if (!eta) {
      setTimeout(() => {
        toast({
          title: `${t("admin.set_eta_first")} ⏰`,
          description: t("admin.set_eta_first_desc"),
          variant: "destructive",
        })
      }, 0)
      return
    }
    updateOrderStatus(orderId, 'accepted', eta)
  }

  // Mark as preparing
  const markAsPreparing = (orderId: string) => {
    updateOrderStatus(orderId, 'preparing')
  }

  // Mark as ready
  const markAsReady = (orderId: string) => {
    updateOrderStatus(orderId, 'ready')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-0 shadow-md shadow-yellow-500/20"
      case "accepted":
        return "bg-gradient-to-r from-indigo-500 to-blue-600 text-white border-0 shadow-md shadow-indigo-500/20"
      case "preparing":
        return "bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-md shadow-purple-500/20"
      case "ready":
        return "bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-md shadow-blue-500/20"
      case "completed":
        return "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg shadow-emerald-500/30"
      case "cancelled":
        return "bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 shadow-md shadow-red-500/20"
      default:
        return "bg-gray-500 text-white border-0"
    }
  }

  const formatOrderTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatOrderItems = (items: OrderItem[]) => {
    return items.map(item => `${item.quantity}x ${item.name}`)
  }

  const handleLogout = () => {
    setTimeout(() => {
      toast({
        title: "Admin logged out! 👋",
        description: "Session ended successfully",
      })
    }, 0)
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Mobile-First Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">{t("admin.title")}</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/admin/menu">
                <Button variant="ghost" className="text-gray-600 dark:text-gray-300">
                  <Settings className="w-4 h-4 mr-2" />
                  {t("admin.manage_menu")}
                </Button>
              </Link>
              <Link href="/admin/profile">
                <Button variant="ghost" className="text-gray-600 dark:text-gray-300">
                  <User className="w-4 h-4 mr-2" />
                  Account
                </Button>
              </Link>
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                {t("admin.logout")}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" className="p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 space-y-2">
              <Link href="/admin/menu" className="block">
                <Button variant="ghost" className="w-full justify-start text-gray-600 dark:text-gray-300">
                  <Settings className="w-4 h-4 mr-2" />
                  {t("admin.manage_menu")}
                </Button>
              </Link>
              <Link href="/admin/profile" className="block">
                <Button variant="ghost" className="w-full justify-start text-gray-600 dark:text-gray-300">
                  <User className="w-4 h-4 mr-2" />
                  Account
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 dark:text-gray-300"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t("admin.logout")}
              </Button>
            </div>
          )}
        </div>
      </nav>

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
        {/* Header - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
              {t("admin.order_queue")}
            </h1>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <Wifi className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  <WifiOff className="w-3 h-3 mr-1" />
                  Offline
                </Badge>
              )}
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{t("admin.manage_orders")}</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">{t("admin.loading_orders") || "Loading orders..."}</p>
          </div>
        )}

        {/* Orders Grid - Mobile First */}
        {!loading && (
          <>
            {orders.length > 0 ? (
              <div className="space-y-4 sm:space-y-6">
                {orders.map((order, index) => (
                  <Card
                    key={order.orderId}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 animate-slide-in-up"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div>
                          <CardTitle className="text-lg sm:text-xl text-gray-800 dark:text-white">
                            {order.userName} - {order.orderId}
                          </CardTitle>
                          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mt-1">
                            {order.userEmail}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">₹{order.totalAmount.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end space-x-4">
                          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {formatOrderTime(order.createdAt)}
                          </span>
                          <Badge className={`${getStatusColor(order.status)} text-xs sm:text-sm px-3 py-1.5 rounded-full font-bold transition-all duration-300 hover:scale-105 ${order.status === "completed" ? "animate-pulse" : ""}`}>
                            {order.status === "pending" && "⏳ Pending"}
                            {order.status === "accepted" && "✅ Accepted"}
                            {order.status === "preparing" && "👨‍🍳 Preparing"}
                            {order.status === "ready" && "🎉 Ready"}
                            {order.status === "completed" && "✅ Completed"}
                            {order.status === "cancelled" && "✗ Cancelled"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* Order Items */}
                      <div className="mb-4 sm:mb-6">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 text-sm sm:text-base">
                          {t("admin.order_items")}
                        </h4>
                        <div className="space-y-1">
                          {formatOrderItems(order.items).map((item, index) => (
                            <p key={index} className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                              {item}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        {order.status === "pending" && (
                          <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                              <Select onValueChange={(value) => acceptOrder(order.orderId, Number.parseInt(value))}>
                                <SelectTrigger className="rounded-2xl h-12 border-gray-200 dark:border-gray-600">
                                  <SelectValue placeholder={t("admin.set_eta")} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="5">5 {t("common.minutes") || "minutes"}</SelectItem>
                                  <SelectItem value="10">10 {t("common.minutes") || "minutes"}</SelectItem>
                                  <SelectItem value="15">15 {t("common.minutes") || "minutes"}</SelectItem>
                                  <SelectItem value="20">20 {t("common.minutes") || "minutes"}</SelectItem>
                                  <SelectItem value="30">30 {t("common.minutes") || "minutes"}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              className="bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white rounded-2xl h-12 px-6 font-medium"
                              onClick={() => acceptOrder(order.orderId, 10)}
                            >
                              <Check className="w-4 h-4 mr-2" />
                              {t("admin.accept_order") || "Accept Order"}
                            </Button>
                          </div>
                        )}

                        {order.status === "accepted" && (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm sm:text-base">
                                ETA: {order.estimatedTime} {t("common.minutes") || "minutes"}
                              </span>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                              <Button
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl h-12 px-4 font-medium flex-1 sm:flex-none"
                                onClick={() => markAsPreparing(order.orderId)}
                              >
                                <Clock className="w-4 h-4 mr-2" />
                                Preparing
                              </Button>
                              <Button
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl h-12 px-4 font-medium flex-1 sm:flex-none"
                                onClick={() => markAsReady(order.orderId)}
                              >
                                <Bell className="w-4 h-4 mr-2" />
                                {t("admin.mark_ready") || "Mark Ready"}
                              </Button>
                            </div>
                          </div>
                        )}

                        {order.status === "preparing" && (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm sm:text-base">
                                {order.estimatedTime ? `ETA: ${order.estimatedTime} ${t("common.minutes") || "minutes"}` : "Preparing..."}
                              </span>
                            </div>
                            <Button
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl h-12 px-6 font-medium w-full sm:w-auto"
                              onClick={() => markAsReady(order.orderId)}
                            >
                              <Bell className="w-4 h-4 mr-2" />
                              {t("admin.mark_ready") || "Mark Ready"}
                            </Button>
                          </div>
                        )}

                        {order.status === "ready" && (
                          <div className="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 rounded-2xl p-4">
                            <Check className="w-5 h-5 mr-2" />
                            <span className="font-medium text-sm sm:text-base">{t("admin.ready_pickup") || "Ready for Pickup"}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 sm:p-12 text-center">
                <div className="text-6xl sm:text-8xl mb-4">📋</div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">{t("admin.no_orders") || "No Orders"}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  {t("admin.orders_appear") || "New orders will appear here in real-time"}
                </p>
              </Card>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in-up {
          animation-name: slideInUp;
          animation-duration: 0.5s;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  )
}
