"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, Minus, ShoppingCart, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useLanguage } from "@/contexts/language-context"

interface FoodItem {
  id: number
  name: string
  price: number
  category: string
  image: string
  emoji: string
}

const foodItems: FoodItem[] = [
  { id: 1, name: "Burger", price: 70, category: "Meals", image: "/placeholder.svg?height=200&width=200", emoji: "🍔" },
  {
    id: 2,
    name: "Cold Coffee",
    price: 40,
    category: "Beverages",
    image: "/placeholder.svg?height=200&width=200",
    emoji: "☕",
  },
  {
    id: 3,
    name: "French Fries",
    price: 50,
    category: "Snacks",
    image: "/placeholder.svg?height=200&width=200",
    emoji: "🍟",
  },
  {
    id: 4,
    name: "Chicken Biryani",
    price: 120,
    category: "Meals",
    image: "/placeholder.svg?height=200&width=200",
    emoji: "🍛",
  },
  { id: 5, name: "Samosa", price: 15, category: "Snacks", image: "/placeholder.svg?height=200&width=200", emoji: "🥟" },
  {
    id: 6,
    name: "Mango Juice",
    price: 35,
    category: "Beverages",
    image: "/placeholder.svg?height=200&width=200",
    emoji: "🥭",
  },
]

export default function StudentDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const { items, addItem, updateQuantity, getTotalItems } = useCart()
  const { t } = useLanguage()

  const categories = [
    { key: "All", label: t("dashboard.categories.all") },
    { key: "Snacks", label: t("dashboard.categories.snacks") },
    { key: "Beverages", label: t("dashboard.categories.beverages") },
    { key: "Meals", label: t("dashboard.categories.meals") },
  ]

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.type !== "student")) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, user, router])

  const filteredItems = foodItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const addToCart = (item: FoodItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      emoji: item.emoji,
    })
    toast({
      title: `${t("dashboard.added_to_cart")} 🛒`,
      description: `${item.name} ${item.emoji} ${t("dashboard.added_desc")}`,
    })
  }

  const getItemQuantity = (itemId: number) => {
    const cartItem = items.find((item) => item.id === itemId)
    return cartItem?.quantity || 0
  }

  const handleLogout = () => {
    logout()
    toast({
      title: `${t("dashboard.logged_out")} 👋`,
      description: t("dashboard.see_you"),
    })
    router.push("/")
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Don't render anything while redirecting
  if (!isAuthenticated || user?.type !== "student") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Mobile-First Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">{t("nav.title")}</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/student/orders">
                <Button variant="ghost" className="text-gray-600 dark:text-gray-300">
                  {t("dashboard.my_orders")}
                </Button>
              </Link>
              <Link href="/student/cart">
                <Button variant="outline" className="relative">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {t("dashboard.cart")}
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-emerald-400 text-white text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                {t("dashboard.logout")}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <Link href="/student/cart">
                <Button variant="outline" size="sm" className="relative p-2">
                  <ShoppingCart className="w-4 h-4" />
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-emerald-400 text-white text-xs px-1 py-0 min-w-[1rem] h-4 flex items-center justify-center">
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 space-y-2">
              <Link href="/student/orders" className="block">
                <Button variant="ghost" className="w-full justify-start text-gray-600 dark:text-gray-300">
                  {t("dashboard.my_orders")}
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 dark:text-gray-300"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t("dashboard.logout")}
              </Button>
            </div>
          )}
        </div>
      </nav>

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
        {/* Greeting - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {t("dashboard.greeting")} {user?.name || "Student"} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{t("dashboard.question")}</p>
        </div>

        {/* Search and Filters - Mobile First */}
        <div className="mb-6 sm:mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <Input
              placeholder={t("dashboard.search")}
              className="pl-10 sm:pl-12 rounded-2xl border-gray-200 dark:border-gray-600 h-12 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filters - Horizontal Scroll on Mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? "default" : "outline"}
                className={`rounded-2xl whitespace-nowrap flex-shrink-0 h-10 px-4 text-sm ${
                  selectedCategory === category.key
                    ? "bg-emerald-400 hover:bg-emerald-500 text-white"
                    : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950"
                }`}
                onClick={() => setSelectedCategory(category.key)}
              >
                {category.label}
                {category.key === "Snacks" && " 🍟"}
                {category.key === "Beverages" && " ☕"}
                {category.key === "Meals" && " 🍛"}
              </Button>
            ))}
          </div>
        </div>

        {/* Food Items Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item, index) => {
            const quantity = getItemQuantity(item.id)
            return (
              <Card
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden transform hover:-translate-y-1"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationName: "slideInUp",
                  animationDuration: "0.5s",
                  animationTimingFunction: "ease-out",
                  animationFillMode: "forwards",
                }}
              >
                {/* Food Image/Emoji */}
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                  <span className="text-4xl sm:text-5xl lg:text-6xl">{item.emoji}</span>
                </div>

                <CardContent className="p-4">
                  {/* Item Info */}
                  <div className="mb-4">
                    <h3 className="font-bold text-base sm:text-lg text-gray-800 dark:text-white mb-1 line-clamp-1">
                      {item.name} {item.emoji}
                    </h3>
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg sm:text-xl">₹{item.price}</p>
                  </div>

                  {/* Add to Cart / Quantity Controls */}
                  {quantity > 0 ? (
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-2xl p-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0 rounded-xl hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                        onClick={() => updateQuantity(item.id, quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="font-bold text-lg text-gray-800 dark:text-white px-4">{quantity}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-600 dark:text-emerald-400"
                        onClick={() => updateQuantity(item.id, quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
                      onClick={() => addToCart(item)}
                    >
                      {t("dashboard.add_to_cart")}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{t("dashboard.no_items")}</h3>
            <p className="text-gray-600 dark:text-gray-300">{t("dashboard.try_adjusting")}</p>
          </div>
        )}
      </div>

      {/* Floating Cart Button - Mobile Only */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-6 right-6 md:hidden z-40">
          <Link href="/student/cart">
            <Button className="bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white rounded-full w-14 h-14 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300">
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                  {getTotalItems()}
                </Badge>
              </div>
            </Button>
          </Link>
        </div>
      )}

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
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </div>
  )
}
