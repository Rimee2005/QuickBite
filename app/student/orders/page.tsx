"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

interface Order {
  id: string
  date: string
  time: string
  items: string[]
  total: number
  status: "picked-up" | "cancelled"
  rating?: number
}

const orders: Order[] = [
  {
    id: "#QB-1321",
    date: "2024-01-15",
    time: "12:30 PM",
    items: ["1x Burger 🍔", "1x Cold Coffee ☕"],
    total: 110,
    status: "picked-up",
    rating: 5,
  },
  {
    id: "#QB-1320",
    date: "2024-01-14",
    time: "1:15 PM",
    items: ["2x Samosa 🥟", "1x Mango Juice 🥭"],
    total: 65,
    status: "picked-up",
    rating: 4,
  },
  {
    id: "#QB-1319",
    date: "2024-01-13",
    time: "11:45 AM",
    items: ["1x Chicken Biryani 🍛"],
    total: 120,
    status: "cancelled",
  },
  {
    id: "#QB-1318",
    date: "2024-01-12",
    time: "2:00 PM",
    items: ["1x French Fries 🍟", "1x Cold Coffee ☕"],
    total: 90,
    status: "picked-up",
    rating: 5,
  },
]

export default function OrderHistoryPage() {
  const { t } = useLanguage()

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 sm:gap-4 mb-6">
            <Link href="/student/dashboard">
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
        {!loading && (
          <div className="space-y-4 sm:space-y-5">
            {orders.map((order, index) => {
              const statusDisplay = getStatusDisplay(order.status)
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
                            className={`font-semibold text-xs sm:text-sm px-2.5 py-1 rounded-full ${
                              statusDisplay.isPickedUp
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700"
                                : "bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-700"
                            }`}
                          >
                            {statusDisplay.isPickedUp ? `✓ ${statusDisplay.label}` : `✗ ${statusDisplay.label}`}
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

                      {order.rating && (
                        <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-2.5 border border-amber-200 dark:border-amber-800/50">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("orders.your_rating") || "Your Rating:"}</span>
                          <div className="flex items-center gap-1">
                            {renderStars(order.rating)}
                            <span className="ml-2 text-sm font-bold text-amber-700 dark:text-amber-400">
                              {order.rating}/5
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
        {orders.length === 0 && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-8 sm:p-12 text-center transform hover:scale-105 transition-all duration-300">
            <div className="text-6xl sm:text-7xl mb-6 animate-bounce">📋</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {t("orders.no_orders") || "No orders yet"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-base sm:text-lg">
              {t("orders.no_orders_desc") || "Your order history will appear here once you place your first order"}
            </p>
            <Link href="/student/dashboard">
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
