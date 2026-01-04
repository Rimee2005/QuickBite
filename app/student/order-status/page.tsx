"use client"

import { useState, useEffect } from "react"
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
  items: Array<{ name: string; quantity: number; price: number }>
  totalAmount: number
  status: "pending" | "accepted" | "preparing" | "ready" | "completed" | "cancelled"
  estimatedTime?: number
  createdAt: string
}

export default function OrderStatusPage() {
  const [order, setOrder] = useState<Order | null>(null)
  const [status, setStatus] = useState<"pending" | "accepted" | "preparing" | "ready" | "picked-up">("pending")
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const orderId = searchParams.get("orderId")
  const { notifications, isConnected } = useSocket('customer', user?.id)
  const { t } = useLanguage()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || user?.type !== "student") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  // Fetch order from API
  useEffect(() => {
    if (!orderId) {
      toast({
        title: t("status.invalid_order"),
        description: t("status.order_id_missing"),
        variant: "destructive",
      })
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
        toast({
          title: t("status.error"),
          description: t("status.failed_load"),
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, router, toast])

  // Listen for real-time status updates via Socket.IO
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0]
      if (latestNotification.type === 'status-update' && latestNotification.data) {
        const updateData = latestNotification.data
        if (updateData.orderId === orderId) {
          setStatus(updateData.status as any)
          if (updateData.estimatedTime) {
            setEstimatedTime(updateData.estimatedTime)
            setTimeRemaining(updateData.estimatedTime * 60)
          }
          updateProgress(updateData.status)
          
          toast({
            title: `${t("status.status_updated")} 🔔`,
            description: latestNotification.message,
          })
        }
      }
    }
  }, [notifications, orderId, toast])

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const markAsPickedUp = () => {
    setStatus("picked-up")
    toast({
      title: `✅ ${t("status.order_complete")}`,
      description: t("status.thank_you"),
    })
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
      case "picked-up":
        return "✅"
      default:
        return "⏳"
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "from-yellow-400 to-orange-500"
      case "accepted":
        return "from-blue-400 to-blue-600"
      case "preparing":
        return "from-purple-400 to-purple-600"
      case "ready":
        return "from-green-400 to-green-600"
      case "picked-up":
        return "from-emerald-400 to-emerald-600"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  if (!isAuthenticated || user?.type !== "student") {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/student/dashboard">
                <Button
                  variant="ghost"
                  className="rounded-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t("status.title")}</h1>
                <p className="text-gray-600 dark:text-gray-300">{t("status.subtitle")}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl mb-2">{getStatusIcon()}</div>
              <Badge className={`bg-gradient-to-r ${getStatusColor()} text-white border-0`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Status Card */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <CardHeader className={`bg-gradient-to-r ${getStatusColor()} text-white p-8`}>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold mb-2">Order {orderId}</CardTitle>
                    <p className="text-white/90">{t("status.placed_by")} {user?.name || t("cart.student")}</p>
                  </div>
                  <div className="text-6xl animate-pulse">{getStatusIcon()}</div>
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-8">
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
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-[1.5rem] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          {t("status.mark_picked")}
                        </Button>
                      </div>
                    </div>
                  )}

                  {status === "picked-up" && (
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

                      {/* Rating Section */}
                      <div className="bg-emerald-50 dark:bg-emerald-900 rounded-2xl p-6">
                        <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-4">
                          {t("status.rate_experience")}
                        </h4>
                        <div className="flex justify-center space-x-2 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              className="text-2xl hover:scale-110 transition-transform"
                              onClick={() =>
                                toast({
                                  title: `${t("feedback.thank_you")} ⭐`,
                                  description: `${t("status.rate_experience")} ${star} ${star !== 1 ? t("common.items") : t("common.item")}`,
                                })
                              }
                            >
                              <Star className="w-8 h-8 text-yellow-400 hover:text-yellow-500 fill-current" />
                            </button>
                          ))}
                        </div>
                        <Link href="/student/dashboard">
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
          <div className="lg:col-span-1 space-y-6">
            {/* Order Details */}
            <Card className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg border border-gray-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800 dark:text-white">{t("status.order_details")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800 dark:text-white">{t("status.need_help")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{t("status.call_canteen")}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">+91 98765 43210</p>
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
              <CardContent className="p-6 text-center">
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
