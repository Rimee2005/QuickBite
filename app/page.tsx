"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  User,
  ShoppingCart,
  Clock,
  Bell,
  Shield,
  ChefHat,
  Star,
  ArrowRight,
  Github,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Sun,
  Moon,
  TrendingUp,
  Users,
  Timer,
  Flame,
  Monitor,
  CheckCircle,
  MapPinIcon,
  Languages,
  Play,
  Gift,
  MessageSquare,
  UsersIcon,
  Heart,
  Award,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"

// testimonials will be defined inside component to use translations

// Features and steps will be defined inside component to use translations

// topPicks and dailySpecials will be defined inside component to use translations

// Team members, fun facts, and FAQs will be defined inside component to use translations

// Animated counter component
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return (
    <span className="animate-count-up">
      {count}
      {suffix}
    </span>
  )
}

export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [canteenOpen, setCanteenOpen] = useState(true)
  const [feedback, setFeedback] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  // Memoize arrays to ensure they update when language changes
  const features = useMemo(() => [
    {
      icon: <Shield className="w-8 h-8 text-emerald-500" />,
      title: t("features.secure_login"),
      description: t("features.secure_login_desc"),
    },
    {
      icon: <ShoppingCart className="w-8 h-8 text-emerald-500" />,
      title: t("features.one_click"),
      description: t("features.one_click_desc"),
    },
    {
      icon: <ChefHat className="w-8 h-8 text-emerald-500" />,
      title: t("features.admin_control"),
      description: t("features.admin_control_desc"),
    },
    {
      icon: <Bell className="w-8 h-8 text-emerald-500" />,
      title: t("features.live_notifications"),
      description: t("features.live_notifications_desc"),
    },
  ], [t, language])

  const steps = useMemo(() => [
    {
      number: "01",
      title: t("steps.signup.title"),
      description: t("steps.signup.desc"),
      icon: <User className="w-6 h-6" />,
    },
    {
      number: "02",
      title: t("steps.browse.title"),
      description: t("steps.browse.desc"),
      icon: <ShoppingCart className="w-6 h-6" />,
    },
    {
      number: "03",
      title: t("steps.confirm.title"),
      description: t("steps.confirm.desc"),
      icon: <Clock className="w-6 h-6" />,
    },
    {
      number: "04",
      title: t("steps.admin.title"),
      description: t("steps.admin.desc"),
      icon: <ChefHat className="w-6 h-6" />,
    },
    {
      number: "05",
      title: t("steps.notify.title"),
      description: t("steps.notify.desc"),
      icon: <Bell className="w-6 h-6" />,
    },
  ], [t, language])

  const teamMembers = useMemo(() => [
    {
      name: t("team.chef_ramesh.name"),
      role: t("team.chef_ramesh.role"),
      experience: t("team.chef_ramesh.experience"),
      emoji: "👨‍🍳",
      specialty: t("team.chef_ramesh.specialty"),
    },
    {
      name: t("team.admin_priya.name"),
      role: t("team.admin_priya.role"),
      experience: t("team.admin_priya.experience"),
      emoji: "👩‍💼",
      specialty: t("team.admin_priya.specialty"),
    },
    {
      name: t("team.chef_sunita.name"),
      role: t("team.chef_sunita.role"),
      experience: t("team.chef_sunita.experience"),
      emoji: "👩‍🍳",
      specialty: t("team.chef_sunita.specialty"),
    },
  ], [t, language])

  const funFacts = useMemo(() => [
    {
      icon: <TrendingUp className="w-6 h-6 text-emerald-500" />,
      fact: t("facts.orders_served"),
      emoji: "🎉",
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      fact: t("facts.fastest_delivery"),
      emoji: "⚡",
    },
    {
      icon: <Heart className="w-6 h-6 text-red-500" />,
      fact: t("facts.satisfaction"),
      emoji: "❤️",
    },
    {
      icon: <Award className="w-6 h-6 text-purple-500" />,
      fact: t("facts.award"),
      emoji: "🏆",
    },
  ], [t, language])

  const faqs = useMemo(() => [
    {
      question: t("faq.login_required.q"),
      answer: t("faq.login_required.a"),
    },
    {
      question: t("faq.cancel_order.q"),
      answer: t("faq.cancel_order.a"),
    },
    {
      question: t("faq.who_prepares.q"),
      answer: t("faq.who_prepares.a"),
    },
    {
      question: t("faq.prep_time.q"),
      answer: t("faq.prep_time.a"),
    },
    {
      question: t("faq.payment.q"),
      answer: t("faq.payment.a"),
    },
    {
      question: t("faq.modify_order.q"),
      answer: t("faq.modify_order.a"),
    },
  ], [t, language])

  const topPicks = useMemo(() => [
    {
      id: 1,
      name: t("food.chicken_biryani"),
      price: 120,
      emoji: "🍛",
      offer: "20% Off",
      popular: true,
    },
    {
      id: 2,
      name: t("food.masala_dosa"),
      price: 60,
      emoji: "🥞",
      offer: null,
      popular: true,
    },
    {
      id: 3,
      name: t("food.paneer_butter_masala"),
      price: 100,
      emoji: "🍛",
      offer: "15% Off",
      popular: false,
    },
    {
      id: 4,
      name: t("food.cold_coffee"),
      price: 40,
      emoji: "☕",
      offer: null,
      popular: true,
    },
    {
      id: 5,
      name: t("food.veg_burger"),
      price: 70,
      emoji: "🍔",
      offer: "10% Off",
      popular: false,
    },
    {
      id: 6,
      name: t("food.fresh_juice"),
      price: 35,
      emoji: "🥤",
      offer: null,
      popular: true,
    },
  ], [t, language])

  const dailySpecials = useMemo(() => [
    { name: t("food.paneer_wrap"), emoji: "🌯", discount: 20 },
    { name: t("food.chicken_biryani"), emoji: "🍛", discount: 25 },
    { name: t("food.masala_dosa"), emoji: "🥞", discount: 15 },
    { name: t("food.veg_thali"), emoji: "🍽️", discount: 30 },
  ], [t, language])

  const testimonials = useMemo(() => [
    {
      id: 1,
      name: t("testimonial.priya.name"),
      role: t("testimonial.priya.role"),
      content: t("testimonial.priya.content"),
      rating: 5,
      avatar: "👩‍🎓",
    },
    {
      id: 2,
      name: t("testimonial.rahul.name"),
      role: t("testimonial.rahul.role"),
      content: t("testimonial.rahul.content"),
      rating: 5,
      avatar: "👨‍🎓",
    },
    {
      id: 3,
      name: t("testimonial.anita.name"),
      role: t("testimonial.anita.role"),
      content: t("testimonial.anita.content"),
      rating: 5,
      avatar: "👩‍💼",
    },
    {
      id: 4,
      name: t("testimonial.admin.name"),
      role: t("testimonial.admin.role"),
      content: t("testimonial.admin.content"),
      rating: 5,
      avatar: "👨‍🍳",
    },
  ], [t, language])

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-rotate testimonials and daily specials
  useEffect(() => {
    const testimonialInterval = setInterval(nextTestimonial, 5000)
    const specialInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % dailySpecials.length)
    }, 3000)

    return () => {
      clearInterval(testimonialInterval)
      clearInterval(specialInterval)
    }
  }, [])

  // Check canteen status based on time
  useEffect(() => {
    const checkCanteenStatus = () => {
      const now = new Date()
      const hour = now.getHours()
      // Canteen open from 8 AM to 8 PM
      setCanteenOpen(hour >= 8 && hour < 20)
    }

    checkCanteenStatus()
    const interval = setInterval(checkCanteenStatus, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const handleFeedbackSubmit = () => {
    if (!selectedLanguage || !feedback.trim()) {
      toast({
        title: t("feedback.please_provide"),
        variant: "destructive",
      })
      return
    }

    toast({
      title: t("feedback.thank_you"),
      description: t("feedback.helps_improve_desc"),
    })

    setFeedback("")
  }

  const handleDemoOrder = () => {
    toast({
      title: `${t("demo.activated")} 🎮`,
      description: t("demo.description"),
    })
  }

  const handleGroupOrder = () => {
    toast({
      title: `${t("group.coming_soon")} 👥`,
      description: t("group.coming_soon_desc"),
    })
  }

  // Update theme toggle to use next-themes
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Daily Specials Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white py-2 sm:py-3 px-3 sm:px-4 text-center relative overflow-hidden">
        <div className="animate-pulse">
          <span className="font-bold text-sm sm:text-base">
            {t("special.today")}: {dailySpecials[activeTestimonial].name} {dailySpecials[activeTestimonial].emoji}{" "}
            {dailySpecials[activeTestimonial].discount}% {t("special.off")} 🔥
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
          <span className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{t("nav.title")}</span>
        </div>
        <div className="flex items-center flex-wrap gap-2 sm:gap-4 w-full sm:w-auto justify-end sm:justify-start">
          {/* Language Selector */}
          <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
            <SelectTrigger className="w-auto border-none bg-transparent h-9 sm:h-10">
              <Languages className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <SelectValue className="text-xs sm:text-sm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिंदी</SelectItem>
              <SelectItem value="mai">मैथिली</SelectItem>
              <SelectItem value="bho">भोजपुरी</SelectItem>
            </SelectContent>
          </Select>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 h-9 w-9 sm:h-10 sm:w-10"
          >
            {theme === "light" ? <Moon className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>

          <Link href="/login" className="flex-1 sm:flex-initial">
            <Button
              variant="outline"
              className="w-full sm:w-auto rounded-[1.25rem] border-emerald-400 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950 text-sm sm:text-base py-2 sm:py-2.5 px-4 sm:px-6"
            >
              {t("login.login")}
            </Button>
          </Link>
          <Link href="/admin/login" className="flex-1 sm:flex-initial">
            <Button className="w-full sm:w-auto bg-emerald-400 hover:bg-emerald-500 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-[1.25rem] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base">
              {t("nav.admin")}
            </Button>
          </Link>
        </div>
      </nav>

      {/* Real-time Status Display */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 sm:mb-8">
        <div className="flex justify-center">
          <Badge
            className={`text-sm sm:text-lg py-1.5 sm:py-2 px-4 sm:px-6 rounded-full ${
              canteenOpen
                ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {canteenOpen ? "✅" : "❌"} <span className="whitespace-nowrap">{canteenOpen ? t("canteen.status.open") : t("canteen.status.closed")}</span>
          </Badge>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">
              {t("hero.badge")}
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white leading-tight">
              {t("hero.title")}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">{t("hero.subtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/login" className="flex-1 sm:flex-initial">
                <Button className="w-full sm:w-auto bg-emerald-400 hover:bg-emerald-500 text-white font-medium text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8 rounded-[1.25rem] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  {t("hero.cta1")}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/admin/login" className="flex-1 sm:flex-initial">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8 rounded-[1.25rem] border-emerald-400 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950"
                >
                  {t("hero.cta2")}
                </Button>
              </Link>
            </div>

            {/* Demo Order Button */}
            <div className="pt-2 sm:pt-4">
              <Button
                variant="outline"
                onClick={handleDemoOrder}
                className="border-dashed border-2 border-gray-400 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 text-sm sm:text-base py-2 sm:py-2.5 px-4 sm:px-6"
              >
                <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                {t("demo.title")}
              </Button>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">{t("demo.subtitle")}</p>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <Card className="bg-white dark:bg-gray-800 rounded-[1.25rem] shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl sm:text-2xl">👥</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">{t("hero.long_queue")}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{t("hero.students_waiting")}</p>
                  </div>
                </div>

                <div className="border-l-4 border-emerald-400 pl-4 sm:pl-6 ml-3 sm:ml-6">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl sm:text-2xl">😊</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">{t("hero.quick_pickup")}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{t("hero.happy_student")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Mini Video Demo Placeholder */}
            <div className="absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 bg-white dark:bg-gray-800 rounded-[1.25rem] shadow-lg p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-400 rounded-full flex items-center justify-center">
                  <Play className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white">{t("hero.how_to_order")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Canteen Location Map */}
      <section className="bg-white dark:bg-gray-800 py-12 sm:py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">{t("location.title")} 📍</h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">{t("location.address")}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <Card className="bg-gray-100 dark:bg-gray-700 rounded-[1.25rem] shadow-lg border border-gray-200 dark:border-gray-600 p-6 sm:p-8 h-48 sm:h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPinIcon className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-500 mx-auto mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{t("location.map_coming_soon")}</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {t("location.map_integration")}
                </p>
              </div>
            </Card>

            <div className="space-y-3 sm:space-y-4">
              <Card className="bg-white dark:bg-gray-700 rounded-[1.25rem] shadow-lg border border-gray-100 dark:border-gray-600 p-4 sm:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">{t("location.block_b")}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{t("location.main_campus")}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white dark:bg-gray-700 rounded-[1.25rem] shadow-lg border border-gray-100 dark:border-gray-600 p-4 sm:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">{t("location.open_hours")}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{t("location.hours")}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">{t("stats.title")} 📊</h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">{t("stats.subtitle")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 rounded-[1.25rem] shadow-lg border-0 p-6 sm:p-8 text-center">
              <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-3 sm:mb-4" />
              <div className="text-3xl sm:text-4xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">
                <AnimatedCounter end={247} suffix="+" />
              </div>
              <p className="text-sm sm:text-base text-emerald-600 dark:text-emerald-400 font-medium">🍲 {t("stats.total_orders")}</p>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-[1.25rem] shadow-lg border-0 p-6 sm:p-8 text-center">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3 sm:mb-4" />
              <div className="text-3xl sm:text-4xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                <AnimatedCounter end={5} />
              </div>
              <p className="text-sm sm:text-base text-blue-600 dark:text-blue-400 font-medium">👨‍🍳 {t("stats.active_admins")}</p>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-[1.25rem] shadow-lg border-0 p-6 sm:p-8 text-center sm:col-span-2 lg:col-span-1">
              <Timer className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 dark:text-purple-400 mx-auto mb-3 sm:mb-4" />
              <div className="text-3xl sm:text-4xl font-bold text-purple-700 dark:text-purple-300 mb-2">
                <AnimatedCounter end={12} suffix={` ${t("common.min")}`} />
              </div>
              <p className="text-sm sm:text-base text-purple-600 dark:text-purple-400 font-medium">🕐 {t("stats.avg_prep_time")}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Meet The Team Section */}
      <section className="bg-white dark:bg-gray-800 py-12 sm:py-16 lg:py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">{t("team.title")} 👥</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300">{t("team.subtitle")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-gray-700 rounded-[1.25rem] shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-600 p-6 sm:p-8 text-center"
              >
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">{member.emoji}</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2">{member.name}</h3>
                <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-2 text-sm sm:text-base">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3">{member.experience}</p>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 text-xs sm:text-sm">
                  {member.specialty}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Picks Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">{t("picks.title")} 🍽️</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300">{t("picks.subtitle")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {topPicks.map((dish) => (
              <Card
                key={dish.id}
                className="bg-white dark:bg-gray-800 rounded-[1.25rem] shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="relative">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-4xl sm:text-5xl lg:text-6xl">{dish.emoji}</span>
                  </div>
                  {dish.offer && (
                    <Badge className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white hover:bg-red-500 text-xs sm:text-sm">
                      <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                      {dish.offer}
                    </Badge>
                  )}
                  {dish.popular && (
                    <Badge className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-emerald-500 text-white hover:bg-emerald-500 text-xs sm:text-sm">
                      {t("picks.popular")}
                    </Badge>
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm sm:text-base">{dish.name}</h3>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">₹{dish.price}</span>
                    {dish.offer && (
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through">
                        ₹{Math.round(dish.price / (1 - Number.parseInt(dish.offer) / 100))}
                      </span>
                    )}
                  </div>
                  <Link href="/login">
                    <Button className="w-full bg-emerald-400 hover:bg-emerald-500 text-white font-medium py-2 sm:py-2.5 px-4 rounded-[1.25rem] transition-all duration-200 text-sm sm:text-base">
                      {t("picks.login_to_order")}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Group Order & Loyalty Program */}
      <section className="bg-white dark:bg-gray-800 py-12 sm:py-16 lg:py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Group Order */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-[1.25rem] shadow-lg border-0 p-6 sm:p-8">
              <div className="text-center">
                <UsersIcon className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 dark:text-blue-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-blue-800 dark:text-blue-200 mb-3 sm:mb-4">{t("group.title")}</h3>
                <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300 mb-4 sm:mb-6">{t("group.subtitle")}</p>
                <Button
                  onClick={handleGroupOrder}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 sm:py-3 px-5 sm:px-6 rounded-[1.25rem] text-sm sm:text-base"
                >
                  {t("group.cta")}
                </Button>
              </div>
            </Card>

            {/* Loyalty Program */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-[1.25rem] shadow-lg border-0 p-6 sm:p-8">
              <div className="text-center">
                <Gift className="w-12 h-12 sm:w-16 sm:h-16 text-purple-600 dark:text-purple-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-purple-800 dark:text-purple-200 mb-3 sm:mb-4">{t("loyalty.program")} 🎁</h3>
                <p className="text-sm sm:text-base text-purple-700 dark:text-purple-300 mb-4 sm:mb-6">{t("loyalty.title")}</p>
                <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                    1
                  </div>
                  <span className="text-sm sm:text-base text-purple-700 dark:text-purple-300">{t("loyalty.order_point")}</span>
                </div>
                <Badge className="bg-purple-600 text-white text-xs sm:text-sm">{t("loyalty.coming_soon")}</Badge>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Fun Facts Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">{t("facts.title")} 🧠</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300">{t("facts.subtitle")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {funFacts.map((fact, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-gray-800 rounded-[1.25rem] shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700 p-4 sm:p-6 text-center"
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{fact.emoji}</div>
                <div className="flex justify-center mb-2 sm:mb-3">{fact.icon}</div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">{fact.fact}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Feedback Section */}
      <section className="bg-white dark:bg-gray-800 py-12 sm:py-16 lg:py-20 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">{t("feedback.title")} 💬</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300">{t("feedback.helps_improve")}</p>
          </div>

          <Card className="bg-white dark:bg-gray-700 rounded-[1.25rem] shadow-lg border border-gray-100 dark:border-gray-600 p-6 sm:p-8">
            <div className="space-y-4 sm:space-y-6">
              {/* Emoji Rating */}
              <div className="text-center">
                <p className="text-base sm:text-lg font-medium text-gray-800 dark:text-white mb-3 sm:mb-4">{t("feedback.rate_experience")}</p>
                <div className="flex justify-center space-x-2 sm:space-x-4">
                  {[
                    { emoji: "😞", value: "poor", label: t("feedback.poor") },
                    { emoji: "😐", value: "okay", label: t("feedback.okay") },
                    { emoji: "😊", value: "good", label: t("feedback.good") },
                    { emoji: "😍", value: "excellent", label: t("feedback.excellent") },
                  ].map((rating) => (
                    <button
                      key={rating.value}
                      onClick={() => setSelectedLanguage(rating.value)}
                      className={`text-3xl sm:text-4xl p-2 sm:p-3 rounded-full transition-all duration-200 ${
                        selectedLanguage === rating.value
                          ? "bg-emerald-100 dark:bg-emerald-900 scale-110"
                          : "hover:bg-gray-100 dark:hover:bg-gray-600"
                      }`}
                    >
                      {rating.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Text */}
              <div>
                <Textarea
                  placeholder={t("feedback.placeholder")}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="rounded-[1.25rem] border-gray-300 dark:border-gray-600 text-sm sm:text-base"
                  rows={4}
                />
              </div>

              <div className="text-center">
                <Button
                  onClick={handleFeedbackSubmit}
                  className="bg-emerald-400 hover:bg-emerald-500 text-white font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-[1.25rem] text-sm sm:text-base"
                >
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  {t("feedback.submit")}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Smart Dashboard Preview */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">{t("dashboard_preview.title")} 📊</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300">{t("dashboard_preview.subtitle")}</p>
          </div>

          <Card className="bg-white dark:bg-gray-800 rounded-[1.25rem] shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                <span className="ml-2 sm:ml-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">{t("dashboard_preview.admin_dashboard")}</span>
              </div>
            </div>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <Card className="bg-emerald-50 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-300">12</div>
                  <p className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">{t("dashboard_preview.pending_orders")}</p>
                </Card>
                <Card className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-300">8 {t("common.min")}</div>
                  <p className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm">{t("dashboard_preview.avg_wait")}</p>
                </Card>
                <Card className="bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 p-3 sm:p-4 text-center sm:col-span-2 lg:col-span-1">
                  <div className="text-xl sm:text-2xl font-bold text-purple-700 dark:text-purple-300">3</div>
                  <p className="text-purple-600 dark:text-purple-400 text-xs sm:text-sm">{t("dashboard_preview.active_admins")}</p>
                </Card>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Card className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">#QB-1325 - Priya Sharma</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">1x Burger 🍔, 1x Cold Coffee ☕</p>
                    </div>
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <select className="flex-1 sm:flex-initial px-2 sm:px-3 py-1.5 sm:py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
                        <option>{t("dashboard_preview.set_eta")}</option>
                        <option>10 {t("common.min")}</option>
                        <option>15 {t("common.min")}</option>
                        <option>20 {t("common.min")}</option>
                      </select>
                      <Button size="sm" className="bg-emerald-400 hover:bg-emerald-500 text-white text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {t("dashboard_preview.accept")}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-900 rounded-lg border border-emerald-200 dark:border-emerald-700">
                <div className="flex items-start sm:items-center space-x-2">
                  <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 font-medium">
                    🎯 <strong>{t("dashboard_preview.admin_control")}</strong> {t("dashboard_preview.admin_control_desc")}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white dark:bg-gray-800 py-12 sm:py-16 lg:py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">{t("how_it_works.title")} 🔍</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300">{t("how_it_works.subtitle")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <Card className="bg-white dark:bg-gray-700 rounded-[1.25rem] shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-600 p-4 sm:p-6 text-center h-full">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <div className="text-emerald-600 dark:text-emerald-400 scale-75 sm:scale-100">{step.icon}</div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{step.number}</div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm sm:text-base">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{step.description}</p>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">{t("features.title")} 📦</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300">
              {t("features.subtitle")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-gray-700 rounded-[1.25rem] shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-600 p-4 sm:p-6 text-center"
              >
                <div className="flex justify-center mb-3 sm:mb-4 scale-75 sm:scale-100">{feature.icon}</div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm sm:text-base">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white dark:bg-gray-800 py-12 sm:py-16 lg:py-20 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">{t("testimonials.title")} 🗣️</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300">{t("testimonials.subtitle")}</p>
          </div>

          <div className="relative">
            <Card className="bg-white dark:bg-gray-700 rounded-[1.25rem] shadow-lg border border-gray-100 dark:border-gray-600 p-6 sm:p-8">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">{testimonials[activeTestimonial].avatar}</div>
                <div className="flex justify-center mb-3 sm:mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 italic px-2 sm:px-0">
                  "{testimonials[activeTestimonial].content}"
                </blockquote>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">
                    {testimonials[activeTestimonial].name}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                    {testimonials[activeTestimonial].role}
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors ${
                    index === activeTestimonial ? "bg-emerald-400" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  onClick={() => setActiveTestimonial(index)}
                />
              ))}
            </div>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full dark:border-gray-600 dark:text-gray-300 h-9 w-9 sm:h-10 sm:w-10 p-0"
                onClick={prevTestimonial}
              >
                ←
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full dark:border-gray-600 dark:text-gray-300 h-9 w-9 sm:h-10 sm:w-10 p-0"
                onClick={nextTestimonial}
              >
                →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">{t("faq.title")} ❓</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300">{t("faq.subtitle")}</p>
          </div>

          <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-gray-50 dark:bg-gray-700 rounded-[1.25rem] border border-gray-200 dark:border-gray-600 px-4 sm:px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-gray-800 dark:text-white hover:no-underline text-sm sm:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 pb-3 sm:pb-4 text-sm sm:text-base">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-emerald-400 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">{t("cta.title")} 📣</h2>
          <p className="text-base sm:text-lg lg:text-xl text-emerald-100 mb-6 sm:mb-8">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/login" className="flex-1 sm:flex-initial">
              <Button className="w-full sm:w-auto bg-white text-emerald-600 hover:bg-gray-100 font-medium text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8 rounded-[1.25rem] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                👉 {t("hero.cta1")}
              </Button>
            </Link>
            <Link href="/admin/login" className="flex-1 sm:flex-initial">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-emerald-600 text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8 rounded-[1.25rem]"
              >
                👉 {t("hero.cta2")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-8 sm:py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl font-bold">{t("nav.title")}</span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                {t("footer.tagline")}
              </p>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-400">
                <span>🏫</span>
                <span>{t("footer.campus_project")}</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t("footer.quick_links")}</h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.home")}
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.login")}
                  </Link>
                </li>
                <li>
                  <Link href="/admin/login" className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.admin_login")}
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.menu")}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.contact")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t("footer.contact_title")}</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li className="flex items-start sm:items-center space-x-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span className="break-all">support@quickbite.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-start sm:items-center space-x-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span>College Campus, India</span>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t("footer.follow_us")}</h3>
              <div className="flex space-x-4 mb-3 sm:mb-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              </div>
              <div className="text-xs sm:text-sm text-gray-400">
                <p>{t("footer.built_for_students")}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              {t("footer.copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
