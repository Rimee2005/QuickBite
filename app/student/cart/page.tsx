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

export default function CartPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const { emitNewOrder, isConnected } = useSocket('customer', user?.id)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || user?.type !== "student") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  const placeOrder = async () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty! 🛒",
        description: "Add some items to your cart first",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please login to place an order",
        variant: "destructive",
      })
      return
    }

    setIsPlacingOrder(true)

    try {
      // Prepare order items
      const orderItems = items.map(item => ({
        menuItemId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }))

      const totalAmount = getTotalPrice()

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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order')
      }

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
        title: "🎉 Order placed successfully!",
        description: `Order ${order.orderId} has been sent to the kitchen. You'll be notified when it's ready.`,
      })

      // Redirect to order status with the new order ID
      router.push(`/student/order-status?orderId=${order.orderId}`)
    } catch (error: any) {
      console.error('Error placing order:', error)
      toast({
        title: "Order failed ❌",
        description: error.message || "Failed to place order. Please try again.",
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
        <Card className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-700 p-12 text-center max-w-md transform hover:scale-105 transition-all duration-300">
          <div className="relative mb-8">
            <div className="text-8xl mb-4 animate-bounce">🛒</div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">0</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
            Discover delicious meals and add them to your cart!
          </p>
          <Link href="/student/dashboard">
            <Button className="bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white font-medium py-4 px-8 rounded-[1.5rem] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Browse Menu
            </Button>
          </Link>
        </Card>
      </div>
    )
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
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Your Cart</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {items.length} item{items.length !== 1 ? "s" : ""} • {user?.name || "Student"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl">🛒</div>
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 mt-1">
                {items.reduce((total, item) => total + item.quantity, 0)} items
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Order Items</h2>
              <Badge variant="outline" className="text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4 mr-1" />
                Estimated: 10-15 min
              </Badge>
            </div>

            {items.map((item, index) => (
              <Card
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "slideInUp 0.5s ease-out forwards",
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                        {item.emoji}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">{item.name}</h3>
                        <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xl">₹{item.price}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Subtotal: ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 rounded-2xl p-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-10 h-10 p-0 rounded-xl hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <div className="w-12 text-center">
                          <span className="font-bold text-lg text-gray-800 dark:text-white">{item.quantity}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-10 h-10 p-0 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-600 dark:text-emerald-400"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-10 h-10 p-0 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                        onClick={() => {
                          removeItem(item.id)
                          toast({
                            title: "Item removed! 🗑️",
                            description: `${item.name} has been removed from your cart`,
                          })
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white p-6">
                  <CardTitle className="text-xl font-bold flex items-center">
                    <CreditCard className="w-6 h-6 mr-2" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Items Breakdown */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Items</h4>
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-medium text-gray-800 dark:text-white">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                        <span className="text-gray-800 dark:text-white">₹{getTotalPrice()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Service Fee</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Taxes</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">Included</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800 dark:text-white">Total</span>
                      <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{getTotalPrice()}
                      </span>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-blue-50 dark:bg-blue-900 rounded-xl p-4">
                    <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-sm font-medium">Payment Method</span>
                    </div>
                    <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">Cash on Pickup</p>
                  </div>

                  {/* Estimated Time */}
                  <div className="bg-emerald-50 dark:bg-emerald-900 rounded-xl p-4">
                    <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-200">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Estimated Time</span>
                    </div>
                    <p className="text-emerald-700 dark:text-emerald-300 text-sm mt-1">
                      Admin will set exact time after confirmation
                    </p>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    onClick={placeOrder}
                    disabled={isPlacingOrder}
                    className="w-full bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-[1.5rem] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isPlacingOrder ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Placing Order...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <ShoppingBag className="w-5 h-5" />
                        <span>Place Order</span>
                      </div>
                    )}
                  </Button>

                  {/* Additional Info */}
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      By placing this order, you agree to our terms and conditions
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
