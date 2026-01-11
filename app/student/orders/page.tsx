"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface OrderItem {
  menuItemId: string
  name: string | { en: string; hi?: string; mai?: string; bho?: string }
  quantity: number
  price: number
}

interface Order {
  orderId: string
  userId: string
  userName: string
  userEmail: string
  items: OrderItem[]
  totalAmount: number
  status: "pending" | "accepted" | "preparing" | "ready" | "completed" | "cancelled"
  createdAt: string
  updatedAt: string
  rating?: number // Average rating for the order
}

interface Review {
  menuItemId: string
  rating: number
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<Record<string, Review[]>>({}) // orderId -> reviews
  const { t, getTranslatedName } = useLanguage()
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated (wait for session to load)
  // Allow both students and teachers (teachers use student dashboard)
  useEffect(() => {
    if (isLoading) return
    
    const checkAuth = setTimeout(() => {
      if (!isAuthenticated || (user && user.type === "admin")) {
        if (user?.type === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/login")
        }
      }
    }, 500)
    
    return () => clearTimeout(checkAuth)
  }, [isLoading, isAuthenticated, user, router])

  // Show loading state while session is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Fetch orders from API
  useEffect(() => {
    // Allow both students and teachers
    if (!isAuthenticated || (user && user.type === "admin")) {
      return
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders")
        if (response.ok) {
          const data = await response.json()
          setOrders(data.orders || [])
        } else {
          console.error("Failed to fetch orders")
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [isAuthenticated, user])

  // Fetch reviews for completed orders
  useEffect(() => {
    if (orders.length === 0 || !user?.id) return

    const fetchReviews = async () => {
      try {
        const completedOrders = orders.filter(o => o.status === "completed")
        if (completedOrders.length === 0) return

        // Fetch all reviews for the user, then filter by orderId
        const response = await fetch(`/api/reviews?userId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          const allReviews = data.reviews || []
          
          // Group reviews by orderId
          const reviewsMap: Record<string, Review[]> = {}
          completedOrders.forEach(order => {
            reviewsMap[order.orderId] = allReviews.filter(
              (review: any) => review.orderId === order.orderId
            )
          })
          setReviews(reviewsMap)
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      }
    }

    fetchReviews()
  }, [orders, user?.id])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-5 h-5 transition-all duration-200 ${
          i < rating 
            ? "text-yellow-500 fill-yellow-500 drop-shadow-md" 
            : "text-gray-300 fill-gray-200"
        }`} 
      />
    ))
  }

  const getStatusDisplay = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return { 
          label: t("orders.status.completed") || "Completed", 
          icon: "✅",
          className: "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg shadow-emerald-500/30",
          iconClassName: "animate-pulse"
        }
      case "ready":
        return { 
          label: t("orders.status.ready") || "Ready", 
          icon: "🎉",
          className: "bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-md shadow-blue-500/20",
          iconClassName: ""
        }
      case "preparing":
        return { 
          label: t("orders.status.preparing") || "Preparing", 
          icon: "👨‍🍳",
          className: "bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-md shadow-purple-500/20",
          iconClassName: ""
        }
      case "accepted":
        return { 
          label: t("orders.status.accepted") || "Accepted", 
          icon: "✓",
          className: "bg-gradient-to-r from-indigo-500 to-blue-600 text-white border-0 shadow-md shadow-indigo-500/20",
          iconClassName: ""
        }
      case "pending":
        return { 
          label: t("orders.status.pending") || "Pending", 
          icon: "⏳",
          className: "bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-0 shadow-md shadow-yellow-500/20",
          iconClassName: "animate-pulse"
        }
      case "cancelled":
        return { 
          label: t("orders.status.cancelled") || "Cancelled", 
          icon: "✗",
          className: "bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 shadow-md shadow-red-500/20",
          iconClassName: ""
        }
      default:
        return { 
          label: status, 
          icon: "•",
          className: "bg-gray-500 text-white border-0",
          iconClassName: ""
        }
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    } catch {
      return dateString
    }
  }

  // Calculate average rating for an order
  const getOrderRating = (order: Order): number | undefined => {
    const orderReviews = reviews[order.orderId] || []
    if (orderReviews.length === 0) return undefined
    
    const totalRating = orderReviews.reduce((sum, review) => sum + review.rating, 0)
    return Math.round((totalRating / orderReviews.length) * 10) / 10 // Round to 1 decimal
  }

  // Allow both students and teachers (teachers use student dashboard)
  if (!isAuthenticated || (user && user.type === "admin")) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 sm:gap-4 mb-6">
            <Link href={user?.type === "teacher" ? "/teacher/dashboard" : "/student/dashboard"}>
              <Button 
                variant="outline"
                size="sm"
                className="border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md h-9 sm:h-10 px-3 sm:px-4"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">{t("orders.back_to_menu") || "Back to Menu"}</span>
                <span className="sm:hidden whitespace-nowrap">{t("orders.menu") || "Menu"}</span>
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t("orders.title") || "Order History"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{t("orders.subtitle") || "View all your past orders"}</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">{t("orders.loading") || "Loading orders..."}</p>
          </div>
        )}

        {/* Orders List */}
        {!loading && orders.length > 0 && (
          <div className="space-y-4 sm:space-y-5">
            {orders.map((order, index) => {
              const statusDisplay = getStatusDisplay(order.status)
              const orderRating = getOrderRating(order)
              return (
                <Card 
                  key={order.orderId} 
                  className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-emerald-100/50 dark:hover:shadow-emerald-900/20 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01] overflow-hidden"
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animation: "slideInUp 0.6s ease-out forwards",
                    opacity: 0,
                  }}
                >
                  <CardContent className="p-5 sm:p-6">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex-1">
                        <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                          <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">
                            #{order.orderId}
                          </h3>
                          <Badge
                            className={`font-bold text-xs sm:text-sm px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105 ${statusDisplay.className} ${statusDisplay.iconClassName}`}
                          >
                            <span className="mr-1.5">{statusDisplay.icon}</span>
                            {statusDisplay.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {formatDate(order.createdAt)} • {formatTime(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Items Ordered */}
                    <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                        {t("orders.items_ordered") || "Items Ordered"}
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item, itemIndex) => {
                          const translatedName = getTranslatedName(item)
                          return (
                            <div 
                              key={itemIndex} 
                              className="flex items-center gap-2.5 text-sm sm:text-base text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2.5 border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <span className="text-lg leading-none">🍽️</span>
                              <span className="flex-1 font-medium">
                                {item.quantity}x {translatedName}
                              </span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Total and Rating */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t("orders.total") || "Total:"}</span>
                        <span className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{order.totalAmount}
                        </span>
                      </div>

                      {orderRating && (
                        <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-2.5 border border-amber-200 dark:border-amber-800/50">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("orders.your_rating") || "Your Rating:"}</span>
                          <div className="flex items-center gap-1">
                            {renderStars(Math.round(orderRating))}
                            <span className="ml-2 text-sm font-bold text-amber-700 dark:text-amber-400">
                              {orderRating}/5
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-8 sm:p-12 text-center transform hover:scale-105 transition-all duration-300">
            <div className="text-6xl sm:text-7xl mb-6 animate-bounce">📋</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {t("orders.no_orders") || "No orders yet"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-base sm:text-lg">
              {t("orders.no_orders_desc") || "Your order history will appear here once you place your first order"}
            </p>
            <Link href={user?.type === "teacher" ? "/teacher/dashboard" : "/student/dashboard"}>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                {t("orders.browse_menu") || "Browse Menu"}
              </Button>
            </Link>
          </Card>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  )
}
