"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Home } from "lucide-react"
import Link from "next/link"

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 sm:gap-4 mb-6">
            <Link href="/">
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </Button>
            </Link>
            <Link href="/student/dashboard">
              <Button 
                variant="ghost" 
                className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Back to Menu</span>
                <span className="sm:hidden">Menu</span>
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Order History
          </h1>
          <p className="text-gray-600 mt-2">View all your past orders</p>
        </div>

        {/* Orders List */}
        <div className="space-y-4 sm:space-y-5">
          {orders.map((order, index) => (
            <Card 
              key={order.id} 
              className="group bg-white border-2 border-emerald-200 rounded-2xl shadow-md hover:shadow-xl hover:shadow-emerald-200/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-5 sm:p-6">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 pb-4 border-b border-emerald-100">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg sm:text-xl text-gray-900">
                        {order.id}
                      </h3>
                      <Badge
                        className={`font-semibold text-xs sm:text-sm px-2.5 py-1 ${
                          order.status === "picked-up"
                            ? "bg-emerald-100 text-emerald-800 border-2 border-emerald-300"
                            : "bg-red-100 text-red-800 border-2 border-red-300"
                        }`}
                      >
                        {order.status === "picked-up" ? "✓ Picked Up" : "✗ Cancelled"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">
                      {order.date} • {order.time}
                    </p>
                  </div>
                </div>

                {/* Items Ordered */}
                <div className="mb-4 pb-4 border-b border-emerald-100">
                  <h4 className="font-semibold text-sm text-gray-800 mb-3 uppercase tracking-wide">
                    Items Ordered
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item, itemIndex) => (
                      <div 
                        key={itemIndex} 
                        className="flex items-center gap-2 text-sm sm:text-base text-gray-800 bg-emerald-50 rounded-lg px-3 py-2.5 border border-emerald-100"
                      >
                        <span className="text-lg">{item.split(' ')[1]}</span>
                        <span className="flex-1 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total and Rating */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-gray-700">Total:</span>
                    <span className="text-2xl sm:text-3xl font-bold text-emerald-600">
                      ₹{order.total}
                    </span>
                  </div>

                  {order.rating && (
                    <div className="flex items-center gap-3 bg-emerald-50 rounded-xl px-4 py-2.5 border-2 border-emerald-200">
                      <span className="text-sm font-semibold text-gray-800">Your Rating:</span>
                      <div className="flex items-center gap-1">
                        {renderStars(order.rating)}
                        <span className="ml-2 text-sm font-bold text-emerald-700">
                          {order.rating}/5
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <Card className="bg-white border-2 border-emerald-200 rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="text-6xl sm:text-7xl mb-6">📋</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              No orders yet
            </h2>
            <p className="text-gray-700 mb-8 text-lg">
              Your order history will appear here once you place your first order
            </p>
            <Link href="/student/dashboard">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                Browse Menu
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}
