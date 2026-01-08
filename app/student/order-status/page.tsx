"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Clock, CheckCircle, ChefHat, Bell, ArrowLeft, MapPin, Phone, Star } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useSocket } from "@/hooks/useSocket"
import { useLanguage } from "@/contexts/language-context"

interface Order {
  orderId: string
  items: Array<{ menuItemId: string; name: string; quantity: number; price: number }>
  totalAmount: number
  status: "pending" | "accepted" | "preparing" | "ready" | "completed" | "cancelled"
  estimatedTime?: number
  createdAt: string
}

export default function OrderStatusPage() {
  const [order, setOrder] = useState<Order | null>(null)
  const [status, setStatus] = useState<"pending" | "accepted" | "preparing" | "ready" | "completed">("pending")
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated, isLoading } = useAuth()
  const orderId = searchParams.get("orderId")
  const { notifications, isConnected } = useSocket('customer', user?.id)
  const { t, getTranslatedName, language } = useLanguage()
  const processedNotificationsRef = useRef<Set<string>>(new Set())
  const lastToastOrderIdRef = useRef<string | null>(null)
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Redirect if not authenticated (wait for session to load)
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.type !== "student")) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, user, router])

  // Fetch order from API
  useEffect(() => {
    if (!orderId) {
      setTimeout(() => {
        toast({
          title: t("status.invalid_order"),
          description: t("status.order_id_missing"),
          variant: "destructive",
        })
      }, 0)
      router.push("/student/dashboard")
      return
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (response.ok) {
          const data = await response.json()
          const orderData = data.order
          setOrder(orderData)
          setStatus(orderData.status as any)
          setEstimatedTime(orderData.estimatedTime || null)
          if (orderData.estimatedTime) {
            setTimeRemaining(orderData.estimatedTime * 60)
          }
          updateProgress(orderData.status)
        } else {
          throw new Error('Order not found')
        }
      } catch (error) {
        console.error('Error fetching order:', error)
        setTimeout(() => {
          toast({
            title: t("status.error"),
            description: t("status.failed_load"),
            variant: "destructive",
          })
        }, 0)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, router, t]) // Removed toast from dependencies

  // Listen for real-time status updates via Socket.IO
  useEffect(() => {
    if (notifications.length > 0 && orderId) {
      const latestNotification = notifications[0]
      if (latestNotification.type === 'status-update' && latestNotification.data) {
        const updateData = latestNotification.data
        const notificationId = latestNotification.id || `${updateData.orderId}-${updateData.status}`
        
        // Skip if already processed
        if (processedNotificationsRef.current.has(notificationId)) {
          console.log('⚠️ Order status update already processed:', notificationId)
          return
        }
        
        if (updateData.orderId === orderId) {
          processedNotificationsRef.current.add(notificationId)
          
          console.log('📥 Processing order status update:', {
            orderId: updateData.orderId,
            status: updateData.status,
            estimatedTime: updateData.estimatedTime,
            hasItems: !!updateData.items
          })
          
          // Update status
          setStatus(updateData.status as any)
          
          if (updateData.estimatedTime) {
            setEstimatedTime(updateData.estimatedTime)
            setTimeRemaining(updateData.estimatedTime * 60)
          }
          
          updateProgress(updateData.status)
          
          // Update order items if provided in notification
          if (updateData.items) {
            setOrder(prev => prev ? { ...prev, items: updateData.items } : null)
          }
          
          // Show toast with debounce to prevent infinite loops
          if (lastToastOrderIdRef.current !== notificationId) {
            lastToastOrderIdRef.current = notificationId
            
            // Clear any pending toast
            if (toastTimeoutRef.current) {
              clearTimeout(toastTimeoutRef.current)
            }
            
            // Use setTimeout to call toast outside render cycle
            toastTimeoutRef.current = setTimeout(() => {
              toast({
                title: `${t("status.status_updated")} 🔔`,
                description: latestNotification.message || 'Order status updated',
              })
              toastTimeoutRef.current = null
            }, 100)
          }
        }
      }
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current)
        toastTimeoutRef.current = null
      }
    }
  }, [notifications, orderId, t]) // Removed toast and order from dependencies

  const updateProgress = (orderStatus: string) => {
    switch (orderStatus) {
      case 'pending':
        setProgress(10)
        break
      case 'accepted':
        setProgress(25)
        break
      case 'preparing':
        setProgress(60)
        break
      case 'ready':
        setProgress(100)
        setTimeRemaining(0)
        break
      default:
        setProgress(0)
    }
  }

  // Countdown timer
  useEffect(() => {
    if (timeRemaining && timeRemaining > 0 && status !== "ready") {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev && prev > 0) {
            return prev - 1
          }
          return 0
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [timeRemaining, status])

  // Show loading state while session is loading (AFTER all hooks)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Show loading state while order is being fetched
  if (loading || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300">{t("status.loading") || "Loading order details..."}</p>
        </div>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const markAsPickedUp = async () => {
    if (!orderId) return

      // Prevent duplicate submissions
      if (status === 'completed') {
        setTimeout(() => {
          toast({
            title: t("status.already_completed") || "Order already completed",
            description: t("status.already_completed_desc") || "This order has already been marked as completed.",
          })
        }, 0)
        return
      }

      // Double check the order status before submitting
      if (order?.status === 'completed') {
        setStatus("completed")
        setTimeout(() => {
          toast({
            title: t("status.already_completed") || "Order already completed",
            description: t("status.already_completed_desc") || "This order has already been marked as completed.",
          })
        }, 0)
        return
      }

    try {
      const response = await fetch(`/api/orders/${orderId}/complete`, {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json()
        
        // If order is already completed, handle gracefully
        if (errorData.error?.includes('already') || errorData.error?.includes('completed')) {
          // Refresh order status from server
          const refreshResponse = await fetch(`/api/orders/${orderId}`)
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json()
            setOrder(refreshData.order)
            setStatus(refreshData.order.status)
          }
          
          setTimeout(() => {
            toast({
              title: t("status.already_completed") || "Order already completed",
              description: t("status.already_completed_desc") || "This order has already been marked as completed.",
            })
          }, 0)
          return
        }
        
        throw new Error(errorData.error || t("status.failed_mark_completed") || 'Failed to mark order as completed')
      }

      const data = await response.json()
      setStatus("completed")
      setOrder((prev) => prev ? { ...prev, status: 'completed' } : null)
      
      setTimeout(() => {
        toast({
          title: `✅ ${t("status.order_complete")}`,
          description: t("status.order_complete_desc") || "Order marked as completed! Check your email for rating & review link.",
        })
      }, 0)
      
      // Redirect to review page after a short delay
      setTimeout(() => {
        router.push(`/student/review?orderId=${orderId}`)
      }, 2000)
    } catch (error: any) {
      console.error('Error marking order as completed:', error)
      setTimeout(() => {
        toast({
          title: t("status.error") || "Error",
          description: error.message || t("status.failed_mark_completed") || "Failed to mark order as completed",
          variant: "destructive",
        })
      }, 0)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "pending":
        return "⏳"
      case "accepted":
        return "👨‍🍳"
      case "preparing":
        return "🔥"
      case "ready":
        return "🔔"
      case "completed":
        return "✅"
      default:
        return "⏳"
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "from-yellow-500 to-orange-600 shadow-yellow-500/20"
      case "accepted":
        return "from-indigo-500 to-blue-600 shadow-indigo-500/20"
      case "preparing":
        return "from-purple-500 to-pink-600 shadow-purple-500/20"
      case "ready":
        return "from-blue-500 to-cyan-600 shadow-blue-500/20"
      case "completed":
        return "from-emerald-500 to-green-600 shadow-emerald-500/30"
      default:
        return "from-gray-400 to-gray-600 shadow-gray-500/20"
    }
  }

  if (!isAuthenticated || user?.type !== "student") {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24 gap-4 sm:gap-6 py-3 sm:py-4">
            {/* Left Side - Back Button and Title */}
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <Link href="/student/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md h-10 sm:h-11 px-4 sm:px-5 flex-shrink-0 flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline whitespace-nowrap text-sm font-medium">{t("status.back_to_menu") || "Back to Menu"}</span>
                  <span className="sm:hidden whitespace-nowrap text-sm font-medium">{t("orders.menu") || "Menu"}</span>
                </Button>
              </Link>
              <div className="min-w-0 flex-1 flex flex-col justify-center">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white truncate leading-tight mb-1">
                  {t("status.title")}
                </h1>
                <p className="text-gray-400 dark:text-gray-400 text-xs sm:text-sm truncate font-normal">
                  {t("status.subtitle")}
                </p>
              </div>
            </div>
            
            {/* Right Side - Status Icon and Badge */}
            <div className="flex items-center justify-end gap-3 sm:gap-4 flex-shrink-0">
              <div className="flex flex-col items-end gap-2">
                <div className="text-3xl sm:text-4xl leading-none">{getStatusIcon()}</div>
                <Badge className={`bg-gradient-to-r ${getStatusColor()} text-white border-0 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${status === "completed" ? "animate-pulse" : ""}`}>
                  {status === "completed" && "✅ "}
                  {status === "ready" && "🎉 "}
                  {status === "preparing" && "👨‍🍳 "}
                  {status === "accepted" && "✓ "}
                  {status === "pending" && "⏳ "}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Main Status Card */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <CardHeader className={`bg-gradient-to-r ${getStatusColor()} text-white p-6 sm:p-8`}>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold mb-2">{t("status.order") || "Order"} {orderId}</CardTitle>
                    <p className="text-white/90">{t("status.placed_by")} {user?.name || t("cart.student")}</p>
                  </div>
                  <div className="text-6xl animate-pulse">{getStatusIcon()}</div>
                </div>
              </CardHeader>

              <CardContent className="p-6 sm:p-8 space-y-6 sm:space-y-8">
                {/* Progress Bar */}
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300">
                    <span>{t("status.progress")}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3 rounded-full" />
                </div>

                {/* Status Details */}
                <div className="space-y-6">
                  {status === "pending" && (
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto">
                        <Clock className="w-10 h-10 text-yellow-600 dark:text-yellow-400 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{t("status.pending")}</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {t("status.pending_desc")}
                        </p>
                      </div>
                      <div className="bg-yellow-50 dark:bg-yellow-900 rounded-2xl p-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                          <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                            {t("status.reviewing")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {status === "accepted" && (
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                        <ChefHat className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{t("status.accepted")}</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {t("status.accepted_desc")}
                        </p>
                      </div>
                      {estimatedTime && timeRemaining && (
                        <div className="bg-blue-50 dark:bg-blue-900 rounded-2xl p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              <span className="text-blue-800 dark:text-blue-200 font-medium">
                                {t("status.estimated_time")}: {estimatedTime} {t("common.minutes")}
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {formatTime(timeRemaining)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {status === "preparing" && (
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                        <div className="text-3xl animate-bounce">🔥</div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{t("status.preparing")}</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {t("status.preparing_desc")}
                        </p>
                      </div>
                      {timeRemaining && (
                        <div className="bg-purple-50 dark:bg-purple-900 rounded-2xl p-6">
                          <div className="flex items-center justify-center space-x-4">
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                              {formatTime(timeRemaining)}
                            </div>
                            <span className="text-purple-800 dark:text-purple-200">{t("status.remaining")}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {status === "ready" && (
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                        <Bell className="w-10 h-10 text-green-600 dark:text-green-400 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
                          {t("status.ready")}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {t("status.ready_desc")}
                        </p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900 rounded-2xl p-6">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                          <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span className="text-green-800 dark:text-green-200 font-medium">
                            {t("status.pickup_location")}
                          </span>
                        </div>
                        <Button
                          onClick={markAsPickedUp}
                          disabled={status === 'completed' || order?.status === 'completed'}
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-[1.5rem] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          {status === 'completed' || order?.status === 'completed' 
                            ? (t("status.already_completed") || "Already Completed") 
                            : t("status.mark_picked")}
                        </Button>
                      </div>
                    </div>
                  )}

                  {status === "completed" && (
                    <div className="text-center space-y-6">
                      <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                          {t("status.complete")}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {t("status.complete_desc")}
                        </p>
                      </div>

                      {/* Review Section */}
                      <div className="bg-emerald-50 dark:bg-emerald-900 rounded-2xl p-6">
                        <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-4">
                          {t("status.rate_review") || "Rate & Review Your Order"} ⭐
                        </h4>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-4">
                          {t("status.share_experience") || "Share your experience and help us improve!"}
                        </p>
                        {order?.items && (
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <Link
                                key={item.menuItemId}
                                href={`/student/review?orderId=${orderId}&menuItemId=${item.menuItemId}`}
                              >
                                <Button
                                  variant="outline"
                                  className="w-full justify-between bg-white dark:bg-gray-800 hover:bg-emerald-100 dark:hover:bg-emerald-800"
                                >
                                  <span className="font-medium">{getTranslatedName(item)}</span>
                                  <Star className="w-4 h-4 ml-2 text-yellow-400" />
                                </Button>
                              </Link>
                            ))}
                          </div>
                        )}
                        <Link href="/student/dashboard" className="block mt-4">
                          <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-[1.5rem] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            {t("status.order_again")}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Information */}
          <div className="lg:col-span-1 space-y-5 sm:space-y-6">
            {/* Order Details */}
            <Card className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg border border-gray-100 dark:border-gray-700">
              <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                <CardTitle className="text-lg font-bold text-gray-800 dark:text-white">{t("status.order_details")}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">{t("status.order_id")}</span>
                    <span className="font-medium text-gray-800 dark:text-white">{orderId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">{t("status.placed_at")}</span>
                    <span className="font-medium text-gray-800 dark:text-white">{new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">{t("status.payment")}</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{t("cart.cash_pickup")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg border border-gray-100 dark:border-gray-700">
              <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                <CardTitle className="text-lg font-bold text-gray-800 dark:text-white">{t("status.need_help")}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{t("status.call_canteen")}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t("status.phone_number") || "+91 98765 43210"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{t("location.title")}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t("location.block_b")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 rounded-[1.5rem] shadow-lg border-0">
              <CardContent className="p-4 sm:p-6 text-center">
                <h3 className="font-bold text-emerald-800 dark:text-emerald-200 mb-4">{t("status.quick_actions")}</h3>
                <div className="space-y-3">
                  <Link href="/student/dashboard">
                    <Button
                      variant="outline"
                      className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-200 dark:border-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-800"
                    >
                      {t("status.browse_menu")}
                    </Button>
                  </Link>
                  <Link href="/student/orders">
                    <Button
                      variant="outline"
                      className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-200 dark:border-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-800"
                    >
                      {t("status.order_history")}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
