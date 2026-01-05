"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CreditCard, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useSocket } from "@/hooks/useSocket"
import { useLanguage } from "@/contexts/language-context"

export default function CartPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const { emitNewOrder, isConnected } = useSocket('customer', user?.id)
  const { t, getTranslatedName, language } = useLanguage()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || user?.type !== "student") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  const placeOrder = async () => {
    if (items.length === 0) {
      toast({
        title: t("cart.empty_cart"),
        description: t("cart.add_items_first"),
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: t("cart.not_authenticated"),
        description: t("cart.please_login"),
        variant: "destructive",
      })
      return
    }

    setIsPlacingOrder(true)

    try {
      // Prepare order items with validation
      const orderItems = items.map((item, index) => {
        if (!item.id) {
          throw new Error(`Cart item ${index + 1} is missing an ID. Please remove and re-add the item.`)
        }
        // Pass the full name object to preserve all language translations
        const nameObj = typeof item.name === 'string' 
          ? { en: item.name } 
          : item.name
        return {
          menuItemId: String(item.id),
          name: nameObj, // Pass full name object
          quantity: item.quantity,
          price: item.price,
        }
      })

      if (orderItems.length === 0) {
        throw new Error('Cart is empty')
      }

      const totalAmount = getTotalPrice()
      
      console.log('Placing order with items:', orderItems)

      // Create order via API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: orderItems,
          totalAmount,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to place order' }))
        const errorMessage = errorData.error || `Server error: ${response.status} ${response.statusText}`
        console.error('Order creation failed:', errorMessage, errorData)
        throw new Error(errorMessage)
      }

      const data = await response.json()

      const order = data.order

      // Emit socket event for real-time notification to admin
      if (isConnected) {
        emitNewOrder({
          orderId: order.orderId,
          userId: user.id,
          userName: user.name || 'Unknown',
          userEmail: user.email || '',
          items: order.items,
          totalAmount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt,
        })
      }

      // Clear cart after successful order
      clearCart()

      toast({
        title: t("cart.order_placed"),
        description: `${t("status.order_id")} ${order.orderId} ${t("cart.order_sent")}`,
      })

      // Redirect to order status with the new order ID
      router.push(`/student/order-status?orderId=${order.orderId}`)
    } catch (error: any) {
      console.error('Error placing order:', error)
      toast({
        title: t("cart.order_failed"),
        description: error.message || t("cart.failed_desc"),
        variant: "destructive",
      })
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (!isAuthenticated || user?.type !== "student") {
    return null // Will redirect
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8 lg:p-12 text-center max-w-md transform hover:scale-105 transition-all duration-300">
          <div className="relative mb-6 sm:mb-8">
            <div className="text-6xl sm:text-7xl lg:text-8xl mb-3 sm:mb-4 animate-bounce">🛒</div>
            <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">0</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">{t("cart.empty.title")}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg">
            {t("cart.empty.subtitle")}
          </p>
          <Link href="/student/dashboard">
            <Button className="bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-[1.5rem] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {t("cart.empty.browse")}
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Left Side - Your Cart Title */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white truncate leading-tight">{t("cart.title")}</h1>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm truncate mt-0.5">
                {items.length} {items.length !== 1 ? t("cart.items_count_plural") : t("cart.items_count")} • {user?.name || t("cart.student")}
              </p>
            </div>
            
            {/* Right Side - Back to Menu Button and Cart Icon */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
              <Link href="/student/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md h-9 sm:h-10 px-3 sm:px-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline whitespace-nowrap">{t("cart.back_to_menu") || "Back to Menu"}</span>
                  <span className="sm:hidden whitespace-nowrap">{t("cart.menu") || "Menu"}</span>
                </Button>
              </Link>
              <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12">
                <div className="text-2xl sm:text-3xl leading-none">🛒</div>
                <Badge className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 bg-emerald-500 text-white dark:bg-emerald-600 dark:text-white text-xs font-bold px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center rounded-full shadow-md border-2 border-white dark:border-gray-800">
                  {items.reduce((total, item) => total + item.quantity, 0)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">{t("cart.order_items")}</h2>
              <Badge variant="outline" className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {t("cart.estimated")}
              </Badge>
            </div>

            {items.map((item, index) => (
              <Card
                key={item.id || `cart-item-${index}`}
                className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "slideInUp 0.5s ease-out forwards",
                }}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-inner flex-shrink-0">
                        {item.emoji || item.image ? (
                          item.image ? (
                            <img src={item.image} alt={getTranslatedName(item)} className="w-full h-full object-cover rounded-xl sm:rounded-2xl" />
                          ) : (
                            <span>{item.emoji}</span>
                          )
                        ) : (
                          <span>🍽️</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-base sm:text-lg text-gray-800 dark:text-white truncate">{getTranslatedName(item)}</h3>
                        <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg sm:text-xl">₹{item.price}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                          {t("cart.subtotal_label") || "Subtotal:"} ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 sm:space-x-3 bg-gray-50 dark:bg-gray-700 rounded-xl sm:rounded-2xl p-1.5 sm:p-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-8 h-8 sm:w-10 sm:h-10 p-0 rounded-lg sm:rounded-xl hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <div className="w-8 sm:w-12 text-center">
                          <span className="font-bold text-base sm:text-lg text-gray-800 dark:text-white">{item.quantity}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-8 h-8 sm:w-10 sm:h-10 p-0 rounded-lg sm:rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-600 dark:text-emerald-400"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 sm:w-10 sm:h-10 p-0 rounded-lg sm:rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                        onClick={() => {
                          removeItem(item.id)
                          toast({
                            title: `${t("cart.item_removed")} 🗑️`,
                            description: `${getTranslatedName(item)} ${t("cart.removed_desc")}`,
                          })
                        }}
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 sm:top-8">
              <Card className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl font-bold flex items-center">
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                    {t("cart.order_items")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Items Breakdown */}
                  <div className="space-y-2 sm:space-y-3">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2 sm:mb-3 text-sm sm:text-base">{t("common.items")}</h4>
                    {items.map((item, index) => (
                      <div key={item.id || `order-item-${index}`} className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600 dark:text-gray-300 truncate pr-2">
                          {item.quantity}x {getTranslatedName(item)}
                        </span>
                        <span className="font-medium text-gray-800 dark:text-white flex-shrink-0">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3 sm:pt-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600 dark:text-gray-300">{t("cart.subtotal")}</span>
                        <span className="text-gray-800 dark:text-white">₹{getTotalPrice()}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600 dark:text-gray-300">{t("cart.service_fee")}</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">{t("common.free")}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600 dark:text-gray-300">{t("cart.taxes")}</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">{t("common.included")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3 sm:pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base sm:text-lg font-bold text-gray-800 dark:text-white">{t("cart.total")}</span>
                      <span className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{getTotalPrice()}
                      </span>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-blue-50 dark:bg-blue-900 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                      <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">{t("cart.payment_method")}</span>
                    </div>
                    <p className="text-blue-700 dark:text-blue-300 text-xs sm:text-sm mt-1">{t("cart.cash_pickup")}</p>
                  </div>

                  {/* Estimated Time */}
                  <div className="bg-emerald-50 dark:bg-emerald-900 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-200">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">{t("cart.estimated_time")}</span>
                    </div>
                    <p className="text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm mt-1">
                      {t("cart.admin_time")}
                    </p>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    onClick={placeOrder}
                    disabled={isPlacingOrder}
                    className="w-full bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-[1.5rem] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                  >
                    {isPlacingOrder ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{t("cart.placing_order")}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>{t("cart.place_order")}</span>
                      </div>
                    )}
                  </Button>

                  {/* Additional Info */}
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t("cart.terms")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
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
      `}</style>
    </div>
  )
}
